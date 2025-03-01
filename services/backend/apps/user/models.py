from django.db import models

from apps.core.models import BaseModel


class UserRole(models.Choices):
    STUDENT = "student"
    METODIST = "metodist"


class User(BaseModel):
    email = models.EmailField(unique=True, verbose_name="почта")
    username = models.SlugField(unique=True, verbose_name="юзернейм")
    password = models.TextField(verbose_name="пароль")

    status = models.CharField(
        max_length=10, choices=UserRole, default="student"
    )

    def __str__(self) -> str:
        return self.username

    class Meta:
        verbose_name = "пользователь"
        verbose_name_plural = "пользователи"
