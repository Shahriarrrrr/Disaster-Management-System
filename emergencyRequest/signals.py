from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import EmergencyRequest
from .tasks import geocode_emergency_request  # background task

@receiver(post_save, sender=EmergencyRequest)
def trigger_geocoding(sender, instance, created, **kwargs):
    if created and not (instance.latitude and instance.longitude):
        geocode_emergency_request(request_id=instance.id)