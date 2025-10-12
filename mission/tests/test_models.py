# mission/tests/test_models.py

from django.test import TestCase
from django.utils import timezone
from mission.models import Mission, MissionJoinRequest
from volunteer.models import VolunteerProfile
from django.contrib.auth import get_user_model

User = get_user_model()


class MissionModelTest(TestCase):
    def setUp(self):
        self.mission = Mission.objects.create(
            title="Flood Relief",
            type="Rescue",
            location="Dhaka",
            start_date="2025-01-01",
            end_date="2025-01-05",
            urgency="High",
            volunteers_needed=5,
            description="Help flood victims",
            skills=["First Aid", "Swimming"],
            coordinator="John Doe",
            status="Planned",
            progress=0,
            lives_can_be_saved=20
        )

    def test_str_method(self):
        self.assertEqual(str(self.mission), "Flood Relief")

    def test_default_volunteers_joined(self):
        self.assertEqual(self.mission.volunteers_joined, 0)


class MissionJoinRequestModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="vol1", email="vol1@example.com", password="pass123")
        self.volunteer = VolunteerProfile.objects.create(user=self.user)
        self.mission = Mission.objects.create(
            title="Earthquake Rescue",
            type="Rescue",
            location="Sylhet",
            start_date="2025-02-01",
            end_date="2025-02-10",
            urgency="Medium",
            volunteers_needed=3,
            description="Rescue trapped victims",
            skills=["Medical Aid"],
            coordinator="Jane Doe",
            status="Active",
        )
        self.join_request = MissionJoinRequest.objects.create(volunteer=self.volunteer, mission=self.mission)

    def test_str_method(self):
        expected = f"{self.volunteer.user.email} - {self.mission.title} (PENDING)"
        self.assertEqual(str(self.join_request), expected)

    def test_approve(self):
        self.join_request.approve()
        self.join_request.refresh_from_db()
        self.mission.refresh_from_db()

        self.assertEqual(self.join_request.status, "ACCEPTED")
        self.assertIn(self.mission, self.volunteer.joined_missions.all())
        self.assertEqual(self.mission.volunteers_joined, 1)
        self.assertIsNotNone(self.join_request.reviewed_at)

    def test_reject(self):
        self.join_request.reject()
        self.join_request.refresh_from_db()
        self.assertEqual(self.join_request.status, "REJECTED")
        self.assertIsNotNone(self.join_request.reviewed_at)
