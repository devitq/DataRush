import json
from django.test import TestCase
from django.contrib.auth.hashers import make_password

from apps.user.models import User


class SignUpAPITestCase(TestCase):
    def test_successful_sign_up(self):
        payload = {
            "email": "user@example.com",
            "password": "securepassword123",
            "username": "123",
        }
        response = self.client.post(
            "/api/v1/sign-up",
            data=json.dumps(payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertIn("token", response.json())
        self.assertEqual(User.objects.count(), 1)

    def test_missing_required_fields(self):
        payload = {"password": "testpass123", "username": "sffsdf"}
        response = self.client.post(
            "/api/v1/sign-up",
            data=json.dumps(payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 400)

    def test_invalid_email_format(self):
        payload = {
            "email": "ervtb uktr bym",
            "password": "securepassword123",
            "username": "123",
        }
        response = self.client.post(
            "/api/v1/sign-up",
            data=json.dumps(payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 400)

    def test_existing_user_conflict(self):
        User.objects.create(
            email="existing@example.com", password="existingpass123", username="testing"
        )
        payload = {
            "email": "existing@example.com",
            "password": "sfsad",
            "username": "testing",
        }
        response = self.client.post(
            "/api/v1/sign-up",
            data=json.dumps(payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 409)
        self.assertIn("detail", response.json())

class SignInAPITestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            email="valid@example.com",
            password=make_password("securepassword123"),
            username="testuser"
        )
        print(self.user.password)
        self.valid_payload = {
            "email": "valid@example.com",
            "password": "securepassword123"
        }

    def test_successful_sign_in(self):
        response = self.client.post(
            "/api/v1/sign-in",
            data=json.dumps(self.valid_payload),
            content_type="application/json"
        )
        print(make_password(self.valid_payload["password"]))
        self.assertEqual(response.status_code, 200)
        self.assertIn("token", response.json())

    def test_missing_credentials(self):
        # Test missing email
        response = self.client.post(
            "/api/v1/sign-in",
            data=json.dumps({"password": "pass"}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)

        # Test missing password
        response = self.client.post(
            "/api/v1/sign-in",
            data=json.dumps({"email": "test@example.com"}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)

    def test_invalid_email_format(self):
        payload = {
            "email": "invalid-email",
            "password": "password123"
        }
        response = self.client.post(
            "/api/v1/sign-in",
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 401)

    def test_incorrect_password(self):
        payload = {
            "email": "valid@example.com",
            "password": "wrongpassword"
        }
        response = self.client.post(
            "/api/v1/sign-in",
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()["detail"], "Unauthorized")

    def test_nonexistent_user(self):
        payload = {
            "email": "notexist@example.com",
            "password": "password123"
        }
        response = self.client.post(
            "/api/v1/sign-in",
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()["detail"], "Unauthorized")
