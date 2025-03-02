from http import HTTPStatus as status
from uuid import UUID

from django.shortcuts import get_object_or_404
from ninja import File, Router, UploadedFile

from api.v1.ping.schemas import PingOut
from api.v1.schemas import ForbiddenError, NotFoundError, UnauthorizedError
from api.v1.task.schemas import (
    HistorySubmissionOut,
    TaskOutSchema,
    TaskSubmissionOut,
)
from apps.competition.models import State
from apps.task.models import (
    Competition,
    CompetitionTask,
    CompetitionTaskSubmission,
)

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
def start_competition(request, competition_id: UUID) -> PingOut:
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
    },
)
def get_competition_tasks(
    request, competition_id: UUID
) -> list[TaskOutSchema]:
    competition = get_object_or_404(Competition, pk=competition_id)
    state = State.objects.filter(
        user=request.auth, competition=competition, state="started"
    ).first()
    if not state:
        return 403, ForbiddenError()

    return status.OK, CompetitionTask.objects.filter(
        competition=competition
    ).all()


@router.get(
    "competitions/{competition_id}/tasks/{task_id}",
    description="Get a task of competition task",
    response={
        status.OK: TaskOutSchema,
        status.UNAUTHORIZED: UnauthorizedError,
        status.FORBIDDEN: ForbiddenError,
        status.NOT_FOUND: NotFoundError,
    },
)
def get_task(request, competition_id: str, task_id: str) -> TaskOutSchema: ...


@router.post(
    "competitions/{competition_id}/tasks/{task_id}/submit",
    description="Submit task solution",
    response={
        status.OK: TaskSubmissionOut,
        status.UNAUTHORIZED: UnauthorizedError,
        status.FORBIDDEN: ForbiddenError,
        status.NOT_FOUND: NotFoundError,
    },
)
def submit_task(
    request,
    competition_id: str,
    task_id: str,
    content: UploadedFile = File(...),  # TODO: вот это надо переделать
) -> TaskSubmissionOut:
    user = request.auth
    competition = get_object_or_404(Competition, id=competition_id)
    task = get_object_or_404(
        CompetitionTask, competition=competition, id=task_id
    )

    if task.type == CompetitionTask.CompetitionTaskType.INPUT:
        submission = CompetitionTaskSubmission.objects.create(
            user=user,
            task=task,
            status=CompetitionTaskSubmission.StatusChoices.CHECKED,
            result={"correct": content == task.answer_file_path},
            content=content,
        )
    if task.type == CompetitionTask.CompetitionTaskType.REVIEW:
        submission = CompetitionTaskSubmission.objects.create(
            user=user,
            task=task,
            status=CompetitionTaskSubmission.StatusChoices.SENT,
            content=content,
        )
        submission.send_on_review()
    if task.type == CompetitionTask.CompetitionTaskType.CHECKER:
        submission = CompetitionTaskSubmission.objects.create(
            user=user,
            task=task,
            status=CompetitionTaskSubmission.StatusChoices.CHECKING,
            content=content,
        )

    return TaskSubmissionOut(submission_id=submission.id)


@router.get(
    "competitions/{competition_id}/tasks/{task_id}/history",
    response={
        status.OK: list[HistorySubmissionOut],
        status.UNAUTHORIZED: UnauthorizedError,
    },
)
def get_submissions_history(request, competition_id: UUID, task_id: UUID):
    task = get_object_or_404(
        CompetitionTask, competition_id=competition_id, id=task_id
    )
    submissions_history = CompetitionTaskSubmission.objects.filter(
        task=task, user=request.auth
    )

    return status.OK, submissions_history
