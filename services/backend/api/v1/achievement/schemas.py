from ninja import ModelSchema, Schema
from pydantic import Field

from apps.achievement.models import Achievement, UserAchievement


class AchievementSchema(ModelSchema):
    class Meta:
        model = Achievement
        fields = (
            "id",
            "name",
            "description",
            "icon",
        )


class UserAchievementSchema(Schema):
    name: str = Field(..., alias="achievement.name")
    description: str = Field(..., alias="achievement.description")
    icon: str = Field(..., alias="achievement.icon")

    class Meta:
        model = UserAchievement
        fields = ("received_at",)
