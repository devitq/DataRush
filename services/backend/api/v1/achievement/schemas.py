from ninja import ModelSchema, Schema

from apps.achievement.models import Achievement


class AchievementSchema(ModelSchema):
    class Meta:
        model = Achievement
        fields = ("id", "name", "description", "icon",)
