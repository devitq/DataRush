from ninja import ModelSchema

from apps.team.models import Team


class CreateTeamSchema(ModelSchema):
    class Meta:
        model = Team
        fields = (
            "name",
            "members",
        )


class TeamSchemaOut(ModelSchema):
    class Meta:
        model = Team
        fields = (
            "id",
            "name",
            "owner",
            "members",
        )
