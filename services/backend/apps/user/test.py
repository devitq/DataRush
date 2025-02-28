from django.core.exceptions import ValidationError
from django.test import TestCase

from apps.user.models import User


class TestSignUp(TestCase):
    def test_correct_signup(self):
        user = User(
            email="123123@timka.su",
            password="1321312",
            username="123123",
        )
        user.full_clean()
        user.save()

    def test_incorrect_mail(self):
        user = User(
            email="123123",
            password="1321312",
            username="123123123",
        )
        with self.assertRaises(ValidationError):
            user.full_clean()

    def test_missing_params(self):
        user = User(
            password="123123",
            username="132131232131"
        )
        with self.assertRaises(ValidationError):
            user.full_clean()
