from django.contrib.auth.hashers import check_password, make_password
from django.db import models

from apps.achievement.models import Achievement
from apps.core.models import BaseModel


class UserRole(models.Choices):
    STUDENT = "student"
    METODIST = "metodist"


class User(BaseModel):
    email = models.EmailField(unique=True, verbose_name="почта")
    username = models.SlugField(unique=True, verbose_name="юзернейм")
    password = models.TextField(verbose_name="пароль")

    created_at = models.DateTimeField(auto_now=True, verbose_name="дата создания")

    achievements = models.ManyToManyField(
        Achievement, blank=True, verbose_name="ачивки пользователя"
    )

    @staticmethod
    def make_password(password: str):
        return make_password(password)

    def check_password(self, password: str):
        return check_password(self.password, password)

    status = models.CharField(
        max_length=10, choices=UserRole, default="student"
    )

    def __str__(self) -> str:
        return self.username

    class Meta:
        verbose_name = "пользователь"
        verbose_name_plural = "пользователи"
