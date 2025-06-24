from django.db import models
from django.conf import settings

class EmergencyRequest(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='emergency_requests'
    )
    location_address = models.CharField(max_length=255)

    latitude = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True)

    emergency_type = models.CharField(max_length=100, default="Flood")
    additional_details = models.TextField(blank=True)
    contact_number = models.CharField(max_length=20)
    requested_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Emergency by {self.user.email} at {self.location_address}"
