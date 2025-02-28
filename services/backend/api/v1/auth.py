import datetime
from typing import Optional, Any

import jwt
from django.conf import settings
from django.http import HttpRequest
from ninja.security import HttpBearer

from apps.user.models import User


class BearerAuth(HttpBearer):
    def authenticate(self, request: HttpRequest, token: str) -> Optional[Any]:
        data = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        if data["exp"] < datetime.datetime.now().timestamp():
            return None

        user = User.objects.get(id=data["id"])
        return user

    @staticmethod
    def generate_jwt(user: User) -> str:
        data = {
            "exp": (datetime.datetime.now() + datetime.timedelta(days=365)).timestamp(),
            "id": str(user.id)
        }
        return jwt.encode(data, settings.SECRET_KEY, algorithm="HS256")
