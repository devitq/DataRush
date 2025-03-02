import ast
import contextlib
import hashlib
import os
import sys
import tempfile
from io import StringIO

from config.celery import app
from apps.task.models import CompetitionTaskSubmission

ALLOWED_MODULES = {
    "pandas",
    "numpy",
    "matplotlib",
    "seaborn",
    "scipy",
    "sklearn",
    "datetime",
    "json",
    "csv",
    "math",
    "statistics",
    "statsmodels",
}


class SecurityException(Exception):
    pass


def validate_code(code_str):
    try:
        tree = ast.parse(code_str)
    except SyntaxError as e:
        raise SecurityException(f"Syntax error: {e!s}")

    class ImportVisitor(ast.NodeVisitor):
        def visit_Import(self, node):
            for alias in node.names:
                module = alias.name.split(".")[0]
                if module not in ALLOWED_MODULES:
                    raise SecurityException(f"Disallowed import: {module}")

        def visit_ImportFrom(self, node):
            if node.module:
                module = node.module.split(".")[0]
                if module not in ALLOWED_MODULES:
                    raise SecurityException(
                        f"Disallowed import from: {module}"
                    )

    class SecurityVisitor(ast.NodeVisitor):
        def generic_visit(self, node):
            if isinstance(node, (ast.Call, ast.Attribute)):
                if "system" in getattr(node, "attr", ""):
                    raise SecurityException("Dangerous system call detected")
            super().generic_visit(node)

    try:
        ImportVisitor().visit(tree)
        SecurityVisitor().visit(tree)
    except SecurityException:
        raise
    except Exception as e:
        raise SecurityException(f"Security check failed: {e!s}")


def secure_exec(code_str, result_path, input_files=None):
    original_dir = os.getcwd()
    original_stdout = sys.stdout
    sys.stdout = captured_stdout = StringIO()
    result_content = None

    if input_files is None:
        input_files = []

    with tempfile.TemporaryDirectory() as temp_dir:
        try:
            os.chdir(temp_dir)

            for file in input_files:
                file_path = os.path.join(temp_dir, file["bind_at"])
                os.makedirs(os.path.dirname(file_path), exist_ok=True)
                with open(file_path, "wb") as f:
                    f.write(file["content"])

            restricted_globals = {
                "__builtins__": {
                    "open": open,
                    "print": print,
                    "str": str,
                    "int": int,
                    "float": float,
                    "bool": bool,
                    "list": list,
                    "dict": dict,
                    "tuple": tuple,
                    "set": set,
                }
            }

            exec(code_str, restricted_globals)

            if result_path == "stdout":
                result_content = captured_stdout.getvalue().encode("utf-8")
            else:
                with open(result_path, "rb") as f:
                    result_content = f.read()

        except Exception as e:
            raise RuntimeError(f"Execution error: {e!s}")
        finally:
            os.chdir(original_dir)
            sys.stdout = original_stdout

    return result_content


@app.task(bind=True)
def analyze_data_task(
    self, code_str, result_path, expected_file_link, submission_id, input_files=[]
):
    try:
        validate_code(code_str)

        result_content = secure_exec(code_str, result_path, input_files)

        result_hash = hashlib.sha256(result_content).hexdigest()
        expected_hash = hashlib.sha256(expected_bytes).hexdigest()

        with contextlib.suppress(CompetitionTaskSubmission.DoesNotExist):
            submission = CompetitionTaskSubmission.objects.get(id=submission_id)
            submission.result = {"correct": True}

        return {
            "success": True,
            "match": result_hash == expected_hash,
            "result_hash": result_hash,
            "expected_hash": expected_hash,
        }

    except SecurityException as e:
        return {"success": False, "error": f"Security violation: {e!s}"}
    except RuntimeError as e:
        return {"success": False, "error": f"Execution error: {e!s}"}
    except Exception as e:
        return {"success": False, "error": f"Unexpected error: {e!s}"}
