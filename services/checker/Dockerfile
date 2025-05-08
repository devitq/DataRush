# Stage 1: Install dependencies
FROM docker.io/python:3.13-alpine AS builder

COPY --from=ghcr.io/astral-sh/uv:0.4.30 /uv /uvx /bin/

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONOPTIMIZE=2 \
    UV_COMPILE_BYTECODE=1 \
    UV_PROJECT_ENVIRONMENT=/opt/venv

COPY pyproject.toml .

RUN uv sync --no-dev --no-install-project --no-cache


# Stage 2: Start the application
FROM docker.io/python:3.13-alpine

WORKDIR /app

COPY --from=builder /opt/venv /opt/venv

COPY . .

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONOPTIMIZE=2 \
    PATH="/opt/venv/bin:$PATH"

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --start-interval=2s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:8000/health || exit 1

CMD [ "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000" ]
