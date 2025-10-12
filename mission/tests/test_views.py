# mission/tests/test_views.py

from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from rest_framework import status
from mission.models import Mission, MissionJoinRequest
from volunteer.models import VolunteerProfile
from django.contrib.auth import get_user_model

User = get_user_model()


class MissionViewSetTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
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

    def test_list_missions(self):
        url = reverse('mission-list')  # DRF default router naming
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['title'], self.mission.title)


class MissionJoinRequestViewSetTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="vol1", password="pass123")
        self.staff_user = User.objects.create_user(username="admin", password="admin123", is_staff=True)
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

    def test_create_join_request(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('missionjoinrequest-list')
        data = {"mission_id": self.mission.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(MissionJoinRequest.objects.count(), 2)

    def test_approve_request_by_admin(self):
        self.client.force_authenticate(user=self.staff_user)
        url = reverse('missionjoinrequest-approve', args=[self.join_request.id])
        response = self.client.post(url)
        self.assertEqual(response.status_code, 200)
        self.join_request.refresh_from_db()
        self.assertEqual(self.join_request.status, 'ACCEPTED')

    def test_approve_request_by_non_admin(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('missionjoinrequest-approve', args=[self.join_request.id])
        response = self.client.post(url)
        self.assertEqual(response.status_code, 403)
