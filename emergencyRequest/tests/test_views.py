from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model
from emergencyRequest.models import EmergencyRequest

User = get_user_model()

class EmergencyRequestViewSetTest(APITestCase):

    def setUp(self):
        # Create normal user
        self.user = User.objects.create_user(
            email="user@example.com",
            password="password123",
            user_name="normaluser",
            user_phone="01700000001"
        )
        # Create admin user
        self.admin = User.objects.create_superuser(
            email="admin@example.com",
            password="adminpass",
            user_name="adminuser",
            user_phone="01700000002"
        )
        # Create an emergency request
        self.emergency = EmergencyRequest.objects.create(
            user=self.user,
            location_address="123 Dhaka Road",
            latitude=23.810331,
            longitude=90.412521,
            contact_number="01722382459"
        )
        self.list_url = reverse('emergencyrequest-list')
        self.detail_url = reverse('emergencyrequest-detail', args=[self.emergency.id])

    def test_list_emergencies_normal_user(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_list_emergencies_admin(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_create_emergency(self):
        self.client.force_authenticate(user=self.user)
        data = {
            "location_address": "Banani, Dhaka",
            "latitude": 23.780573,
            "longitude": 90.419418,
            "contact_number": "01722382460",  # unique number
            "additional_details": "Flooding in street"
        }
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['location_address'], "Banani, Dhaka")
        self.assertEqual(response.data['user'], self.user.id)

    def test_retrieve_emergency(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.emergency.id)

    def test_update_emergency_owner(self):
        self.client.force_authenticate(user=self.user)
        data = {"location_address": "Updated Address"}
        response = self.client.patch(self.detail_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.emergency.refresh_from_db()
        self.assertEqual(self.emergency.location_address, "Updated Address")

    def test_update_emergency_non_owner(self):
        other_user = User.objects.create_user(
            email="other@example.com",
            password="otherpass",
            user_name="otheruser",
            user_phone="01700000003"  # unique phone
        )
        self.client.force_authenticate(user=other_user)
        data = {"location_address": "Hacked Address"}
        response = self.client.patch(self.detail_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
