from http import HTTPStatus as status
from uuid import UUID

from django.http import HttpRequest
from ninja import Router

import api.v1.schemas as global_schemas
from api.v1.auth import BearerAuth
from api.v1.competition import schemas

router = Router(tags=["competition"])


@router.get(
    "competition/{competition_id}",
    response={
        status.OK: schemas.CompetitionOut,
        status.BAD_REQUEST: global_schemas.BadRequestError,
        status.UNAUTHORIZED: global_schemas.UnauthorizedError,
    },
    auth=BearerAuth(),
)
def get_competition(
    request: HttpRequest, competition_id: UUID
) -> tuple[status, schemas.CompetitionOut]: ...


@router.get(
    "competitions",
    response={
        status.OK: list[schemas.CompetitionListInstanceOut],
        status.BAD_REQUEST: global_schemas.BadRequestError,
        status.UNAUTHORIZED: global_schemas.UnauthorizedError,
    },
    auth=BearerAuth(),
)
def list_competitions(
    request: HttpRequest, is_participating: bool
) -> tuple[status, list[schemas.CompetitionListInstanceOut]]: ...
