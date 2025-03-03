import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent

load_dotenv(BASE_DIR / ".env")

DOCKER_IMAGE = os.getenv(
    "DOCKER_IMAGE", default="gitlab.prodcontest.ru:5050/team-15/project/custom-python"
)
