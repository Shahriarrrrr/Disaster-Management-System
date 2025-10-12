# mission/tests/test_serializers.py

from django.test import TestCase
from mission.models import Mission, MissionJoinRequest
from mission.api.serializers import MissionSerializer, MissionJoinRequestSerializer
from volunteer.models import VolunteerProfile
from django.contrib.auth import get_user_model

User = get_user_model()

class MissionSerializerTest(TestCase):
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

    def test_serialization(self):
        serializer = MissionSerializer(self.mission)
        data = serializer.data
        self.assertEqual(data["title"], "Flood Relief")
        self.assertEqual(data["urgency"], "High")


class MissionJoinRequestSerializerTest(TestCase):
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

    def test_serialization(self):
        serializer = MissionJoinRequestSerializer(self.join_request)
        data = serializer.data
        self.assertEqual(data["status"], "PENDING")
        self.assertEqual(data["volunteer"], str(self.volunteer))
        self.assertEqual(data["mission"], str(self.mission))
