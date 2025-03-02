# DataRush Checker

## Prerequisites

Ensure you have the following installed on your system:

- [Python](https://www.python.org/) (>=3.10,<3.12)
- [uv](https://docs.astral.sh/uv/)
- [Docker](https://www.docker.com/) (for containerized setup)

## Basic setup

### Installation

#### Clone the project

```bash
git clone git@gitlab.prodcontest.ru:team-15/project.git
```

#### Go to the project directory

```bash
cd project/services/checker
```

#### Install dependencies

##### For dev environment

```bash
uv sync --all-extras
```

##### For prod environment

```bash
uv sync --no-dev
```

#### Running

##### Apply migrations

```bash
uv run python manage.py migrate
```

##### Start celery worker

```bash
celery -A config worker -l INFO
```

##### Start server

In dev mode:

```bash
uv run python manage.py runserver
```

In prod mode:

```bash
uv run gunicorn config.wsgi
```

## Containerized setup

### Clone the project

```bash
git clone git@gitlab.prodcontest.ru:team-15/project.git
```

### Go to the project directory

```bash
cd project/services/checker
```

### Build docker image

```bash
docker build -t datarush-checker .
```
