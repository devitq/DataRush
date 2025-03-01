import uuid

from django.contrib.auth.hashers import make_password
from django.test import TestCase

from apps.user.models import User
from apps.competition.models import Competition


class CompetitionEndpointTests(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            email="user@example.com",
            password=make_password("password123"),
            username="t1wk4",
        )

        self.competition = Competition.objects.create(
            title="AI Challenge",
            description="Machine Learning Competition",
            type="solo",
            participation_type="edu",
        )

        resp = self.client.post(
            "/api/v1/sign-in",
            data={"email": self.user.email, "password": "password123"},
            content_type="application/json",
        ).json()
        token = resp["token"]

        self.valid_headers = {"HTTP_AUTHORIZATION": f"Bearer {token}"}

    # --- Helper methods ---
    def get_url(self, competition_id):
        return f"/api/v1/competition/{competition_id}"

    # --- Test Cases ---
    def test_get_competition_success(self):
        """Authenticated user gets competition details (200 OK)"""
        response = self.client.get(
            self.get_url(self.competition.id), **self.valid_headers
        )

        self.assertEqual(response.status_code, 200)
        data = response.json()

        # Validate required fields
        self.assertEqual(data["id"], str(self.competition.id))
        self.assertEqual(data["title"], "AI Challenge")
        self.assertEqual(data["type"], "solo")

        # Validate optional null fields
        self.assertIsNone(data["image_url"])
        self.assertIsNone(data["start_date"])
        self.assertIsNone(data["end_date"])

    def test_invalid_uuid_format(self):
        """Invalid UUID format returns 400 Bad Request"""
        response = self.client.get(
            self.get_url("invalid-id"), **self.valid_headers
        )
        self.assertEqual(response.status_code, 400)

    def test_unauthenticated_access(self):
        """Missing auth token returns 401 Unauthorized"""
        response = self.client.get(self.get_url(self.competition.id))
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()["detail"], "Unauthorized")

    def test_nonexistent_competition(self):
        """Valid UUID but missing competition returns 404"""
        new_uuid = uuid.uuid4()
        response = self.client.get(
            self.get_url(new_uuid), **self.valid_headers
        )
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()["detail"], "Not Found")

    def test_invalid_auth_token(self):
        """Invalid token returns 401 Unauthorized"""
        response = self.client.get(
            self.get_url(self.competition.id),
            HTTP_AUTHORIZATION="Bearer invalid_token",
        )
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()["detail"], "Unauthorized")

    def test_malformed_auth_header(self):
        """Malformed Authorization header returns 401"""
        cases = [
            ("InvalidScheme valid_token_123", 401),
            ("Bearer", 401),  # Missing token
            ("", 401),  # No header
        ]

        for header, expected_status in cases:
            with self.subTest(header=header):
                response = self.client.get(
                    self.get_url(self.competition.id),
                    HTTP_AUTHORIZATION=header,
                )
                self.assertEqual(response.status_code, expected_status)
