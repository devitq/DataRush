from uuid import UUID

from ninja import ModelSchema

from apps.competition.models import Competition


class CompetitionOut(ModelSchema):
    id: UUID

    class Meta:
        model = Competition
        fields = "__all__"


class CompetitionListInstanceOut(ModelSchema):
    id: UUID
    is_participating: bool
    completed: bool

    class Meta:
        model = Competition
        fields = (
            "id",
            "title",
            "description",
            "start_date",
            "end_date",
            "image_url",
        )
