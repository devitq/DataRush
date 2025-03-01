from http import HTTPStatus as status
from uuid import UUID

from django.shortcuts import get_object_or_404
from ninja import Router

from apps.team.models import Team
from api.v1.team.schemas import TeamSchemaOut, CreateTeamSchema
from api.v1.schemas import UnauthorizedError, BadRequestError, NotFoundError

router = Router()


@router.post(
    "",
    response={
        201: TeamSchemaOut,
        400: BadRequestError,
        401: UnauthorizedError,
    },
    description="Create team. Note: members array must have team members uuid, default can be empty"
)
def create_team(request, team_data: CreateTeamSchema) -> (int, TeamSchemaOut):
    team = Team(name=team_data.name, owner=request.auth)
    team.members.add(request.auth)
    team.save()
    return 201, team


@router.get(
    "{team_id}",
    response={
        200: TeamSchemaOut,
        401: UnauthorizedError,
        404: NotFoundError,
    }
)
def get_team(request, team_id: UUID) -> (int, TeamSchemaOut):
    return get_object_or_404(Team, pk=team_id)
