# project_name Backend

## Prerequisites

Ensure you have the following installed on your system:

- [Python](https://www.python.org/) (>=3.10,<3.12)
- [uv](https://docs.astral.sh/uv/)
- [Docker](https://www.docker.com/) (for containerized setup)

## Basic setup

### Installation

#### Clone the project

```bash
git clone project_name
```

#### Go to the project directory

```bash
cd project_name/services/backend
```

#### Customize environment

```bash
cp .env.template .env
```

And setup env vars according to your needs.

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
git clone project_name
```

### Go to the project directory

```bash
cd project_name/services/backend
```

### Build docker image

```bash
docker build -t project_name-backend .
```

### Customize environment

Customize environment with `docker run` command (or bind .env file to container), for all environment vars and default values see [.env.template](./.env.template).

### Run docker image

#### Backend

```bash
docker run -p 8080:8080 --name project_name-backend project_name-backend
```

#### Celery worker

```bash
docker run --name project_name-celery-worker project_name-backend celery -A config worker -l INFO
```

Backend will be available on [127.0.0.1:8080](http://127.0.0.1:8080).

## Testing

### Clone the project

```bash
git clone project_name
```

### Go to the project directory

```bash
cd project_name/services/backend
```

### Install dependencies

```bash
uv sync --all-extras
```

### Run tests

```bash
uv run coverage run --source="." manage.py test
```

### Check coverage

```bash
uv run coverage report
```
