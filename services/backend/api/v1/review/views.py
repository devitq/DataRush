from datetime import datetime
from http import HTTPStatus as status
from uuid import UUID

from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from ninja import Router

from api.v1 import schemas as global_schemas
from api.v1.review import schemas
from apps.review.models import Review, ReviewStatusChoices
from apps.task.models import CompetitionTaskSubmission

router = Router(tags=["review"])


@router.get(
    "{token}",
    response={
        status.OK: schemas.ReviewerOut,
        status.UNAUTHORIZED: global_schemas.UnauthorizedError,
    },
    description="token есть и в сваггер авторизации, но оно не работает, не верьте. подставляйте токен вручную в path",
)
def get_reviewer_profile(request: HttpRequest, token: str):
    return status.OK, request.auth


@router.get(
    "{token}/submissions/{submition_id}",
    response={
        status.OK: schemas.SubmissionOut,
    },
)
def get_submission(
    request: HttpRequest, token: str, submition_id: UUID
) -> tuple[status, schemas.SubmissionsOut]:
    submission = get_object_or_404(CompetitionTaskSubmission, id=submition_id)
    reviewer = request.auth

    review = Review.objects.get(reviewer=reviewer, submission=submission)
    if review.state == ReviewStatusChoices.NOT_CHECKED.value:
        review.state = ReviewStatusChoices.CHECKING.value
        review.save()

    return status.OK, submission


@router.get(
    "{token}/submissions",
    response={
        status.OK: schemas.SubmissionsOut,
    },
    description="Список отправок, на проверку которых назначен ревьюер",
)
def get_submissions(
    request: HttpRequest, token: str
) -> tuple[status, schemas.SubmissionsOut]:
    return status.OK, schemas.SubmissionsOut()


@router.post(
    "{token}/submissions/{submition_id}/evaluate",
    response={
        status.OK: schemas.SubmissionOut,
    },
    description="Оценка посылки. В body отправляется список с slug критерия и оценкой по этому критерию",
)
def evaluate_submission(
    request: HttpRequest,
    token: str,
    submition_id: UUID,
    evaluation_info: schemas.EvaluationIn,
) -> tuple[status, schemas.SubmissionsOut]:
    submission = get_object_or_404(CompetitionTaskSubmission, id=submition_id)
    reviewer = request.auth

    review = Review.objects.get(reviewer=reviewer, submission=submission)
    evaluation = evaluation_info.dict()["evaluation"]
    review.evaluation = evaluation
    review.state = ReviewStatusChoices.CHECKED.value
    review.submission.reviewed_at = datetime.now()

    points = 0
    for criterea in evaluation:
        points += criterea["mark"]
    review.submission.earned_points = points

    review.save()

    return status.OK, review.submission
