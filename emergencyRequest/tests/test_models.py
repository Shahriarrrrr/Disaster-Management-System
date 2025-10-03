from django.test import TestCase
from django.contrib.auth import get_user_model
from ..models import EmergencyRequest

User = get_user_model()

class EmergencyRequestModelTest(TestCase):

    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(
            email="tester@gmail.com",
            password="1234",
            user_name="tester"
        )
    def test_create_emergency_request(self):
        emergency = EmergencyRequest.objects.create(
            user=self.user,
            location_address="123 Dhaka Road",
            latitude=23.810331,
            longitude=90.412521,
            contact_number="01722382459",
            additional_details="Severe flooding in the area"
        )

        # Check fields
        self.assertEqual(emergency.user, self.user)
        self.assertEqual(emergency.location_address, "123 Dhaka Road")
        self.assertEqual(float(emergency.latitude), 23.810331)
        self.assertEqual(float(emergency.longitude), 90.412521)
        self.assertEqual(emergency.contact_number, "01722382459")
        self.assertEqual(emergency.additional_details, "Severe flooding in the area")

        # Default value for emergency_type
        self.assertEqual(emergency.emergency_type, "Flood")

    def test_str_method(self):
        emergency = EmergencyRequest.objects.create(
            user=self.user,
            location_address="Banani, Dhaka",
            contact_number="01722382459"
        )
        expected_str = f"Emergency by {self.user.email} at Banani, Dhaka"
        self.assertEqual(str(emergency), expected_str)
