import json
import uuid

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


class UserMeEndpointTestCase(TestCase):
    def setUp(self):
        # Create test user and token
        self.user = User.objects.create(
            email="johndoe@example.com",
            username="johndoe",
            password=make_password("securepassword123")
        )
        resp = self.client.post(
            "/api/v1/sign-in",
            data=json.dumps({"email": "johndoe@example.com", "password": "securepassword123"}),
            content_type="application/json"
        ).json()
        self.token = resp['token']
        self.url = "/api/v1/me"

    def test_get_authenticated_user_data(self):
        """Test authenticated user can retrieve their profile (200 OK)"""
        response = self.client.get(
            self.url,
            HTTP_AUTHORIZATION=f"Bearer {self.token}"
        )

        self.assertEqual(response.status_code, 200)
        data = response.json()

        # Validate UserSchema structure
        self.assertIn("id", data)
        self.assertIn("email", data)
        self.assertIn("username", data)

        # Validate UUID format if ID is present
        if data["id"] is not None:
            try:
                uuid.UUID(data["id"])
            except ValueError:
                self.fail("ID is not a valid UUID")

        # Validate response content
        self.assertEqual(data["email"], "johndoe@example.com")
        self.assertEqual(data["username"], "johndoe")

    def test_unauthenticated_access(self):
        """Test unauthorized access returns 401 Unauthorized"""
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()["detail"], "Unauthorized")

    def test_invalid_auth_scheme(self):
        """Test invalid authentication scheme returns 401"""
        response = self.client.get(
            self.url,
            HTTP_AUTHORIZATION=f"InvalidScheme {self.token}"
        )

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()["detail"], "Unauthorized")

    def test_malformed_token(self):
        """Test malformed token returns 401"""
        test_cases = [
            "invalid.token.123",
            "Bearer",
            "",
            "123456"
        ]

        for token in test_cases:
            with self.subTest(token=token):
                response = self.client.get(
                    self.url,
                    HTTP_AUTHORIZATION=f"Bearer {token}"
                )
                self.assertEqual(response.status_code, 401)
                self.assertEqual(response.json()["detail"], "Unauthorized")
