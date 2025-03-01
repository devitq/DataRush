from http import HTTPStatus as status

from django.shortcuts import get_object_or_404
from ninja import Router

from api.v1.schemas import NotFoundError, UnauthorizedError, ForbiddenError
from api.v1.ping.schemas import PingOut
from api.v1.task.schemas import TaskOutSchema
from apps.competition.models import Competition, State

router = Router(tags=["competition"])


@router.post(
    "competitions/{competition_id}/start",
    description="Start a competition completing (open access to tasks)",
    response={
        status.OK: PingOut,
        status.UNAUTHORIZED: UnauthorizedError,
        status.NOT_FOUND: NotFoundError,
    },
)
def start_competition(request, competition_id: str) -> PingOut:
    competition = get_object_or_404(Competition, pk=competition_id)
    state_obj, _ = State.objects.update_or_create(
        user=request.auth, competition=competition, state="started"
    )
    return status.OK, PingOut()


@router.get(
    "competitions/{competition_id}/tasks",
    description="Get all tasks of competition (works only if user started competition)",
    response={
        status.OK: list[TaskOutSchema],
        status.UNAUTHORIZED: UnauthorizedError,
        status.FORBIDDEN: ForbiddenError,
        status.NOT_FOUND: NotFoundError,
    }
)
def get_competition_tasks(request, competition_id: str) -> list[TaskOutSchema]:
    ...


@router.get(
    "competitions/{competition_id}/tasks/{task_id}",
    description="Get a task of competition task",
    response={
        status.OK: TaskOutSchema,
        status.UNAUTHORIZED: UnauthorizedError,
        status.FORBIDDEN: ForbiddenError,
        status.NOT_FOUND: NotFoundError,
    }
)
def get_task(request, competition_id: str, task_id: str) -> TaskOutSchema:
    ...


@router.post(
    "competitions/{competition_id}/tasks/{task_id}/submit",
    description="Submit task solution",
    response={
        status.OK: PingOut,  # todo maybe I should write an other schema for this
        status.UNAUTHORIZED: UnauthorizedError,
        status.FORBIDDEN: ForbiddenError,
        status.NOT_FOUND: NotFoundError,
    }
)
def submit_task(request, competition_id: str, task_id: str) -> PingOut:
    ...
