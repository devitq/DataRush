import uuid
from datetime import timedelta, datetime, tzinfo

from dateutil.parser import isoparse
import pytz
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
            type="edu",
            participation_type="solo",
        )

        resp = self.client.post(
            "/api/v1/sign-in",
            data={"email": self.user.email, "password": "password123"},
            content_type="application/json",
        ).json()
        token = resp["token"]

        self.valid_headers = {"HTTP_AUTHORIZATION": f"Bearer {token}"}

    def get_url(self, competition_id):
        return f"/api/v1/competition/{competition_id}"

    def test_get_competition_success(self):
        response = self.client.get(
            self.get_url(self.competition.id), **self.valid_headers
        )

        self.assertEqual(response.status_code, 200)
        data = response.json()

        # Validate required fields
        self.assertEqual(data["id"], str(self.competition.id))
        self.assertEqual(data["title"], "AI Challenge")
        self.assertEqual(data["type"], "edu")

        # Validate optional null fields
        self.assertIsNone(data["image_url"])
        self.assertIsNone(data["start_date"])
        self.assertIsNone(data["end_date"])

    def test_invalid_uuid_format(self):
        response = self.client.get(
            self.get_url("invalid-id"), **self.valid_headers
        )
        self.assertEqual(response.status_code, 400)

    def test_unauthenticated_access(self):
        response = self.client.get(self.get_url(self.competition.id))
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()["detail"], "Unauthorized")

    def test_nonexistent_competition(self):
        new_uuid = uuid.uuid4()
        response = self.client.get(
            self.get_url(new_uuid), **self.valid_headers
        )
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()["detail"], "Not Found")

    def test_invalid_auth_token(self):
        response = self.client.get(
            self.get_url(self.competition.id),
            HTTP_AUTHORIZATION="Bearer invalid_token",
        )
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()["detail"], "Unauthorized")

    def test_malformed_auth_header(self):
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


class CompetitionsEndpointTests(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            email="user@example.com",
            password=make_password("password123"),
            username="t1wk4",
        )

        resp = self.client.post(
            "/api/v1/sign-in",
            data={"email": self.user.email, "password": "password123"},
            content_type="application/json",
        ).json()
        token = resp["token"]

        # Create test competitions
        now = datetime.now(tz=pytz.utc)
        self.competitions = []
        for i in range(1, 6):
            competition = Competition.objects.create(
                title=f"Competition {i}",
                description=f"Description {i}",
                type=(
                    Competition.CompetitionType.EDU
                    if i % 2 == 0
                    else Competition.CompetitionType.COMPETITIVE
                ),
                participation_type=Competition.CompetitionParticipationType.SOLO,
                start_date=(now + timedelta(days=i)).isoformat(),
                end_date=(now + timedelta(days=i + 7)).isoformat(),
            )
            if i <= 2:
                competition.participants.add(self.user)
            self.competitions.append(competition)

        self.valid_headers = {"HTTP_AUTHORIZATION": f"Bearer {token}"}

    def get_url(self, params=None):
        base_url = "/api/v1/competitions"
        return f"{base_url}?{params}" if params else base_url

    def test_get_participating_competitions(self):
        response = self.client.get(
            self.get_url("is_participating=true"), **self.valid_headers
        )

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 2)
        self.assertEqual(
            {item["id"] for item in data},
            {str(self.competitions[0].id), str(self.competitions[1].id)},
        )

    def test_competition_type_values(self):
        response = self.client.get(
            self.get_url("is_participating=true"), **self.valid_headers
        )

        for i in range(len(response.json())):
            item = response.json()[i]
            if (i + 1) % 2 == 0:
                self.assertEqual(item["type"], "edu")
            else:
                self.assertEqual(item["type"], "competitive")

    def test_participation_type_values(self):
        response = self.client.get(
            self.get_url("is_participating=false"), **self.valid_headers
        )

        types = [item["participation_type"] for item in response.json()]
        self.assertCountEqual(types, ["solo", "solo", "solo"])

    def test_datetime_formatting(self):
        response = self.client.get(
            self.get_url("is_participating=true"), **self.valid_headers
        )

        for item in response.json():
            if item["start_date"]:
                try:
                    isoparse(item["start_date"])
                except ValueError:
                    self.fail("Invalid start_date format")
            if item["end_date"]:
                try:
                    isoparse(item["end_date"])
                except ValueError:
                    self.fail("Invalid end_date format")

    def test_competition_metadata(self):
        response = self.client.get(
            self.get_url("is_participating=true"), **self.valid_headers
        )

        item = response.json()[0]
        self.assertEqual(item["title"], "Competition 1")
        self.assertEqual(item["description"], "Description 1")
        self.assertEqual(item["type"], "competitive")
        self.assertEqual(item["participation_type"], "solo")

    def test_verbose_name_consistency(self):
        response = self.client.get(
            self.get_url("is_participating=true"), **self.valid_headers
        )

        item = response.json()[0]
        self.assertNotIn("название", item)
        self.assertIn("title", item)

    def test_null_dates_handling(self):
        competition = Competition.objects.create(
            title="No Dates Competition",
            description="Test competition",
            type=Competition.CompetitionType.EDU,
            participation_type=Competition.CompetitionParticipationType.SOLO,
        )

        response = self.client.get(
            self.get_url("is_participating=false"), **self.valid_headers
        )

        test_item = next(
            item
            for item in response.json()
            if item["id"] == str(competition.id)
        )
        self.assertIsNone(test_item["start_date"])
        self.assertIsNone(test_item["end_date"])

    def test_participation_status_filtering(self):
        response = self.client.get(
            self.get_url("is_participating=false"), **self.valid_headers
        )

        data = response.json()
        self.assertEqual(len(data), 3)
