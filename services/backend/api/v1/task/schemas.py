from typing import Literal
from uuid import UUID

from ninja import ModelSchema, Schema

from apps.task.models import CompetitionTask


class TaskOutSchema(ModelSchema):
    class Meta:
        model = CompetitionTask
        fields = ["id", "competition", "title", "description", "type"]


class TaskSubmissionIn(Schema):
    type: Literal["input", "file", "code"]
    content: str


class TaskSubmissionOut(Schema):
    submission_id: UUID
