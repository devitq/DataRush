import logging
from http import HTTPStatus as status
from uuid import UUID

from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from ninja import Router

from api.v1 import schemas as global_schemas
from api.v1.review import schemas
from api.v1.task.schemas import TaskSubmissionIn
from apps.task.models import CompetitionTaskSubmission

router = Router(tags=["review"])


@router.get(
    "{token}/submissions",
    response={
        status.OK: schemas.SubmissionsOut,
    },
    description="Список отправок, на проверку которых назначен ревьюер"
)
def get_submissions(request: HttpRequest, token: str) -> tuple[status, schemas.SubmissionsOut]:
    return status.OK, schemas.SubmissionsOut()


@router.get(
    "{token}",
    response={
        status.OK: schemas.ReviewerOut,
        status.UNAUTHORIZED: global_schemas.UnauthorizedError,
    },
    description="token есть и в сваггер авторизации, но оно не работает, не верьте. подставляйте токен вручную в query",
)
def get_reviewer_profile(request: HttpRequest, token: str):
    return status.OK, request.auth

@router.get(
    "{token}/submissions/{submition_id}",
    response={
        status.OK: schemas.SubmissionOut,
    },
)
def get_submission(request: HttpRequest, token: str, submition_id: UUID) -> tuple[status, schemas.SubmissionsOut]:
    submission = get_object_or_404(CompetitionTaskSubmission, id=submition_id)
    return status.OK, submission
