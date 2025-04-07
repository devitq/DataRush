import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent

load_dotenv(BASE_DIR / ".env")

DOCKER_IMAGE = os.getenv(
    "DOCKER_IMAGE",
    default="registry.gitlab.com/megazordpobeda/datarush/custom-python:latest",
)
