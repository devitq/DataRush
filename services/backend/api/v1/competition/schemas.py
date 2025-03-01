from typing import Literal
from uuid import UUID

from ninja import ModelSchema, Schema

from apps.competition.models import Competition, State


class CompetitionOut(ModelSchema):
    id: UUID
    type: Literal["edu", "competitive"]
    participation_type: Literal["solo"]

    class Meta:
        model = Competition
        exclude = ("participants",)


class StateOut(ModelSchema):
    class Meta:
        model = State
        fields = ("state",)


class StateIn(Schema):
    state: Literal["started", "not_started", "finished"]


class CompetitionListInstanceOut(ModelSchema):
    id: UUID
    is_participating: bool
    completed: bool

    @staticmethod
    def resolve_is_participating(self, context):
        user = context["request"].auth
        return self.participants.filter(id=user.id).exists()

    @staticmethod
    def resolve_completed(self, context):
        user = context["request"].auth
        return State.objects.filter(
            competition=self, user=user, state="finished"
        ).exists()

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
