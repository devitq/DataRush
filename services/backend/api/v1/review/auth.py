from abc import ABC

from django.http import HttpRequest
from django.urls import resolve
from ninja.errors import AuthenticationError
from ninja.security.apikey import APIKeyBase

from apps.review.models import Reviewer


class APIKeyPath(APIKeyBase, ABC):
    openapi_in: str = "path"

    def _get_key(self, request: HttpRequest) -> str | None:
        func, args, kwargs = resolve(request.path)
        return kwargs.get(self.param_name)


class ReviewerAuth(APIKeyPath):
    param_name = "token"

    def authenticate(self, request, token):
        if not (reviewer := Reviewer.objects.filter(token=token).first()):
            raise AuthenticationError
        return reviewer
