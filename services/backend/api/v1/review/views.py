from http import HTTPStatus as status

from django.http import HttpRequest
from ninja import Router

from api.v1.review import schemas
from api.v1 import schemas as global_schemas

router = Router(tags=["review"])


@router.get(
    "{token}/tasks",
    response={
        status.OK: schemas.SubmissionsOut,
    },
)
def ping(request: HttpRequest, token) -> tuple[status, schemas.SubmissionsOut]:
    return status.OK, schemas.SubmissionsOut()


@router.get(
    "{token}",
    response={
        status.OK: schemas.ReviewerOut,
        status.UNAUTHORIZED: global_schemas.UnauthorizedError
    },
    description="token есть и в сваггер авторизации, но оно не работает, не верьте. подставляйте токен вручную в query"
)
def get_reviewer(
    request: HttpRequest,
    token: str
):
    return status.OK, request.auth