from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field, HttpUrl
import aiohttp
import asyncio
import docker
import hashlib
import os
import base64
import tempfile
import logging
from urllib.parse import urlparse
import re
import config


CONTAINER_TIMEOUT = 60
MAX_FILE_SIZE = 4 * 1024 * 1024
ALLOWED_FILENAME_CHARS = r"[^a-zA-Z0-9_\-.]"


app = FastAPI()
docker_client = docker.from_env()
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


class FileDetails(BaseModel):
    url: HttpUrl = Field(
        ..., description="URL to download the file from (supports HTTP/HTTPS)"
    )
    bind_path: str = Field(
        ...,
        description="Container path to bind the file (absolute)",
    )


class ExecutionRequest(BaseModel):
    code: str = Field(..., description="Base64 encoded Python code to execute")
    answer_file_path: str = Field(
        "stdout", description="Base64 encoded path to result file or 'stdout'"
    )
    expected_hash: str | None = Field(
        None, description="Optional SHA-256 hash of expected output"
    )
    files: list[FileDetails] = Field(
        [], description="List of files to mount in container"
    )


class ExecutionResponse(BaseModel):
    success: bool = Field(..., description="Execution success status")
    hash_match: bool | None = Field(
        None, description="Output hash matches expected (if provided)"
    )
    output: str = Field(..., description="Captured stdout or file contents")
    result_hash: str = Field(..., description="SHA-256 hash of output")
    error: str = Field(..., description="Execution errors or stderr")


class HealthCheckResponse(BaseModel):
    status: str = Field(..., description="Service health status")
    docker: str = Field(..., description="Docker daemon status")


def decode_base64(encoded_str: str, field_name: str) -> str:
    try:
        return base64.b64decode(encoded_str).decode("utf-8")
    except Exception as e:
        logger.error(f"Base64 decode failed for {field_name}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid Base64 in {field_name}",
        )


def sanitize_filename(url: str) -> str:
    parsed = urlparse(url)
    base_name = os.path.basename(parsed.path)

    if not base_name:
        base_name = "file"

    clean = re.sub(ALLOWED_FILENAME_CHARS, "", base_name)[:255]
    return clean or "file"


async def download_file(
    session: aiohttp.ClientSession, url: str, dest_path: str
) -> None:
    try:
        async with session.get(
            url, timeout=aiohttp.ClientTimeout(total=30)
        ) as resp:
            if resp.status != 200:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Failed to download {url} - Status {resp.status}",
                )

            content = b""
            async for chunk in resp.content.iter_chunked(8192):
                content += chunk
                if len(content) > MAX_FILE_SIZE:
                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail="File size exceeds 4MB limit",
                    )

            with open(dest_path, "wb") as f:
                f.write(content)
            logger.info(f"Downloaded {url} to {dest_path}")

    except aiohttp.ClientError as e:
        logger.error(f"Download error for {url}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Download failed: {str(e)}",
        )


def run_container_safely(
    tmp_dir: str,
    command: list[str],
    bound_files: dict[str, str],
    timeout: int = CONTAINER_TIMEOUT,
) -> dict:
    container = None
    try:
        volumes = {tmp_dir: {"bind": "/execution", "mode": "rw"}}
        for host_path, container_path in bound_files.items():
            volumes[host_path] = {"bind": container_path, "mode": "ro"}

        container = docker_client.containers.run(
            image=config.DOCKER_IMAGE,
            command=command,
            volumes=volumes,
            working_dir="/execution",
            stdout=True,
            stderr=True,
            detach=True,
            mem_limit="100m",
            network_mode="none",
            cpu_period=100000,
            cpu_quota=50000,
            user="root",
            security_opt=["no-new-privileges"],
        )

        exit_code = container.wait(timeout=timeout)["StatusCode"]
        stdout = container.logs(stdout=True, stderr=False).decode().strip()
        stderr = container.logs(stdout=False, stderr=True).decode().strip()

        return {"stdout": stdout, "stderr": stderr, "status": exit_code}

    except docker.errors.DockerException as e:
        logger.error(f"Docker error: {str(e)}")
        return {
            "stdout": "",
            "stderr": f"Container error: {str(e)}",
            "status": -1,
        }
    finally:
        if container:
            try:
                container.remove(force=True)
            except docker.errors.DockerException:
                pass


def validate_file_path(path: str) -> bool:
    return (
        not os.path.isabs(path)
        and os.path.basename(path) == path
        and all(c.isalnum() or c in {"_", "-", "."} for c in path)
    )


@app.post("/execute", response_model=ExecutionResponse)
async def execute_code(request: ExecutionRequest) -> ExecutionResponse:
    try:
        code = decode_base64(request.code, "code")
        answer_path = (
            decode_base64(request.answer_file_path, "answer_file_path")
            if request.answer_file_path != "stdout"
            else "stdout"
        )
    except HTTPException as e:
        return ExecutionResponse(
            success=False,
            output="",
            result_hash="",
            error=e.detail,
            hash_match=None,
        )

    if answer_path != "stdout":
        if os.path.isabs(answer_path) or not validate_file_path(answer_path):
            return ExecutionResponse(
                success=False,
                output="",
                result_hash="",
                error="Invalid answer file path",
                hash_match=None,
            )

    with tempfile.TemporaryDirectory() as tmp_dir:
        bound_files = {}
        if request.files:
            async with aiohttp.ClientSession() as session:
                download_tasks = []
                for file in request.files:
                    filename = sanitize_filename(str(file.url))
                    dest_path = os.path.join(tmp_dir, filename)
                    bound_files[dest_path] = file.bind_path
                    download_tasks.append(
                        download_file(session, str(file.url), dest_path)
                    )

                try:
                    await asyncio.gather(*download_tasks)
                except HTTPException as e:
                    return ExecutionResponse(
                        success=False,
                        output="",
                        result_hash="",
                        error=e.detail,
                        hash_match=None,
                    )

        code_path = os.path.join(tmp_dir, "submission.py")
        with open(code_path, "w") as f:
            f.write(code)
        os.chmod(code_path, 0o444)

        if answer_path == "stdout":
            cmd = ["python", "submission.py"]
        else:
            cmd = [
                "sh",
                "-c",
                f"python submission.py && cat {answer_path} || echo 'EXECUTION_FAILED'",
            ]

        try:
            result = await asyncio.to_thread(
                run_container_safely,
                tmp_dir,
                cmd,
                bound_files,
                CONTAINER_TIMEOUT,
            )
        except Exception as e:
            logger.error(f"Container execution failed: {str(e)}")
            return ExecutionResponse(
                success=False,
                output="",
                result_hash="",
                error=f"Execution failed: {str(e)}",
                hash_match=None,
            )

        output = result["stdout"]
        error = result["stderr"]
        success = result["status"] == 0

        if answer_path != "stdout" and not output:
            error += "\nNo output captured - check answer file path"

        result_hash = hashlib.sha256(output.encode()).hexdigest()

        response = ExecutionResponse(
            success=success,
            hash_match=(
                result_hash == request.expected_hash
                if request.expected_hash
                else None
            ),
            output=output[:5000],
            result_hash=result_hash,
            error=error[:5000],
        )
        return response


@app.get("/health", response_model=HealthCheckResponse)
async def health_check() -> HealthCheckResponse:
    try:
        docker_client.ping()
        return HealthCheckResponse(status="healthy", docker="connected")
    except docker.errors.DockerException:
        return HealthCheckResponse(status="degraded", docker="unavailable")
