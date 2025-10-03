from django.test import TestCase
from django.contrib.auth import get_user_model
from emergencyRequest.models import EmergencyRequest
from emergencyRequest.api.serializers import EmergencyRequestSerializer
from datetime import datetime

User = get_user_model()


class EmergencyRequestSerializerTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="user@example.com",
            password="password123",
            user_name="normaluser",
            user_phone="01700000001"
        )
        self.emergency = EmergencyRequest.objects.create(
            user=self.user,
            location_address="123 Dhaka Road",
            latitude=23.810331,
            longitude=90.412521,
            contact_number="01722382459",
            additional_details="Severe flooding"
        )

    def test_serialize_emergency(self):
        serializer = EmergencyRequestSerializer(self.emergency)
        data = serializer.data

        self.assertEqual(data["id"], self.emergency.id)
        self.assertEqual(data["location_address"], "123 Dhaka Road")
        self.assertEqual(float(data["latitude"]), float(self.emergency.latitude))
        self.assertEqual(data["user"], self.user.id)  # should show user id

    def test_deserialize_valid_data(self):
        data = {
            "location_address": "Banani, Dhaka",
            "latitude": 23.780573,
            "longitude": 90.419418,
            "contact_number": "01722382460",
            "additional_details": "Flooding in street",
            "emergency_type": "Flood",
        }
        serializer = EmergencyRequestSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_missing_required_field(self):
        data = {
            "latitude": 23.780573,
            "longitude": 90.419418,
            "contact_number": "01722382461",
        }
        serializer = EmergencyRequestSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("location_address", serializer.errors)

    def test_read_only_user_field(self):
        """Ensure 'user' cannot be set directly via serializer input"""
        data = {
            "location_address": "Banani",
            "latitude": 23.7,
            "longitude": 90.4,
            "contact_number": "01722382462",
            "user": self.user.id,  # trying to override user
        }
        serializer = EmergencyRequestSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertNotIn("user", serializer.validated_data)  # should be excluded
