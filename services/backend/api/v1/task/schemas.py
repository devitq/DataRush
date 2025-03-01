from ninja import ModelSchema, Schema

from apps.competition.models import State
from apps.task.models import CompetitionTask


class TaskOutSchema(ModelSchema):
    class Meta:
        model = CompetitionTask
        fields = ["id", "title", "description", "type"]
