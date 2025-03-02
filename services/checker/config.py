import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent

load_dotenv(BASE_DIR / ".env")

REGISTRY_LOGIN = os.getenv("REGISTRY_USERNAME", None)

REGISTRY_PASSWORD = os.getenv("REGISTRY_USERNAME", None)

REGISTRY_URL = os.getenv("REGISTRY_URL", "gitlab.prodcontest.ru:5050")

DOCKER_IMAGE = os.getenv(
    "DOCKER_IMAGE", default="gitlab.prodcontest.ru:5050/team-15/project/custom-python"
)
