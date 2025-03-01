from django.db import models

from apps.core.models import BaseModel


class Reviewer(BaseModel):
    name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)

    token = models.CharField(max_length=100)
