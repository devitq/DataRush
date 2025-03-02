#!/bin/sh

set -e

echo "Installing required libs..."
pip install -r checker_requirements.txt

echo "Starting Celery worker..."
celery -A config worker -l INFO
