from django.db import models

from apps.core.models import BaseModel


class User(BaseModel):
    email = models.EmailField(unique=True, verbose_name="Почта")
    username = models.SlugField(unique=True, verbose_name="Юзернейм")
    password = models.TextField(verbose_name="Пароль")

    def __str__(self):
        return self.username

    class Meta:
        verbose_name = "пользователь"
        verbose_name_plural = "пользователи"
