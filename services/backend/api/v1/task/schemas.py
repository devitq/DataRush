from typing import Literal
from uuid import UUID

from ninja import ModelSchema, Schema

from apps.task.models import CompetitionTask, CompetitionTaskSubmission, CompetitionTaskAttachment


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
        ]


class TaskSubmissionOut(Schema):
    submission_id: UUID


class HistorySubmissionOut(ModelSchema):
    status: Literal["sent", "checked", "checking"]

    class Meta:
        model = CompetitionTaskSubmission
        fields = ("id", "earned_points", "timestamp", "content",)


class TaskAttachmentSchema(ModelSchema):
    class Meta:
        model = CompetitionTaskAttachment
        fields = ("id", "file", "public",)
