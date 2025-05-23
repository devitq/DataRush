import datetime
from typing import Any

import jwt
from django.conf import settings
from django.http import HttpRequest
from ninja.errors import AuthenticationError
from ninja.security import HttpBearer

from apps.user.models import User


class BearerAuth(HttpBearer):
    def authenticate(self, request: HttpRequest, token: str) -> Any | None:
        try:
            data = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            if data["exp"] < datetime.datetime.now().timestamp():
                return None
        except Exception:
            raise AuthenticationError

        try:
            user = User.objects.get(id=data["id"])
        except User.DoesNotExist:
            raise AuthenticationError
        return user

    @staticmethod
    def generate_jwt(user: User) -> str:
        data = {
            "exp": (
                datetime.datetime.now() + datetime.timedelta(days=365)
            ).timestamp(),
            "id": str(user.id),
        }
        return jwt.encode(data, settings.SECRET_KEY, algorithm="HS256")
