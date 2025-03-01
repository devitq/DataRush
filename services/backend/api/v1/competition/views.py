from http import HTTPStatus as status
from uuid import UUID

from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from ninja import Router

import api.v1.schemas as global_schemas
from api.v1.competition import schemas
from apps.competition.models import Competition, State

router = Router(tags=["competition"])


@router.get(
    "competition/{competition_id}",
    response={
        status.OK: schemas.CompetitionOut,
        status.BAD_REQUEST: global_schemas.BadRequestError,
        status.UNAUTHORIZED: global_schemas.UnauthorizedError,
        status.NOT_FOUND: global_schemas.NotFoundError,
    },
)
def get_competition(
    request: HttpRequest, competition_id: UUID
) -> tuple[status, schemas.CompetitionOut]:
    competition = get_object_or_404(Competition, id=competition_id)
    return status.OK, competition


@router.get(
    "competitions",
    response={
        status.OK: list[schemas.CompetitionListInstanceOut],
        status.BAD_REQUEST: global_schemas.BadRequestError,
        status.UNAUTHORIZED: global_schemas.UnauthorizedError,
    },
)
def list_competitions(
    request: HttpRequest, is_participating: bool
) -> tuple[status, list[schemas.CompetitionListInstanceOut]]:
    user = request.auth
    if is_participating:
        competitions = Competition.objects.filter(participants=user)
    else:
        competitions = Competition.objects.exclude(participants=user)
    return status.OK, competitions


@router.post(
    "competitions/{competition_id}/state",
    response={
        status.OK: schemas.StateOut,
        status.BAD_REQUEST: global_schemas.BadRequestError,
        status.UNAUTHORIZED: global_schemas.UnauthorizedError,
    },
)
def change_competition_state(
    request: HttpRequest,
    competition_id: UUID,
    state: schemas.StateIn,
) -> tuple[status, schemas.StateOut]:
    user = request.auth
    competition = get_object_or_404(Competition, id=competition_id)

    state_obj, _ = State.objects.update_or_create(
        user=user, competition=competition, state=state.state
    )
    return status.OK, schemas.StateOut.from_orm(state_obj)
