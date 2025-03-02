from typing import Literal
from uuid import UUID

from ninja import ModelSchema, Schema

from apps.task.models import CompetitionTask, CompetitionTaskSubmission


class TaskOutSchema(ModelSchema):
    class Meta:
        model = CompetitionTask
        fields = [
            "id",
            "competition",
            "title",
            "description",
            "type",
            "in_competition_position",
            "points",
            "attachments",
        ]


class TaskSubmissionOut(Schema):
    submission_id: UUID


class HistorySubmissionOut(ModelSchema):
    status: Literal["sent", "checked", "checking"]

    class Meta:
        model = CompetitionTaskSubmission
        fields = ("id", "earned_points", "timestamp", "content",)
