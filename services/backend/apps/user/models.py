from django.db import models

from apps.core.models import BaseModel


class UserRole(models.Choices):
    STUDENT = "student"
    METODIST = "metodist"


class User(BaseModel):
    email = models.EmailField(unique=True, verbose_name="Почта")
    username = models.SlugField(unique=True, verbose_name="Юзернейм")
    password = models.TextField(verbose_name="Пароль")

    status = models.CharField(
        max_length=10, choices=UserRole, default="student"
    )

    def __str__(self):
        return self.username

    class Meta:
        verbose_name = "пользователь"
        verbose_name_plural = "пользователи"
