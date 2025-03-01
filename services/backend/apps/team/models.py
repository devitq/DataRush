from django.db import models

from apps.core.models import BaseModel
from apps.user.models import User


class Team(BaseModel):
    name = models.CharField(max_length=50, verbose_name="название")
    owner = models.ForeignKey(User, on_delete=models.CASCADE,
                              verbose_name="владелец")
    members = models.ManyToManyField(User, related_name="team_members",
                                     verbose_name="участники")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "команда"
        verbose_name_plural = "команды"
