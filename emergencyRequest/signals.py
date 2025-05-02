import json
from urllib.request import urlopen
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import EmergencyRequest
from .tasks import geocode_emergency_request  # background task
from ticket.models import Ticket  # fixed path

@receiver(post_save, sender=EmergencyRequest)
def trigger_geocoding(sender, instance, created, **kwargs):
    if created:
        # Attempt to fill coordinates if missing
        if not (instance.latitude and instance.longitude):
            try:
                response = urlopen('http://ipinfo.io/json')
                data = json.load(response)
                loc = data.get('loc')
                if loc:
                    lat, lon = loc.split(',')
                    instance.latitude = float(lat)
                    instance.longitude = float(lon)
                    instance.save(update_fields=['latitude', 'longitude'])
            except Exception as e:
                print(f"IP-based geolocation failed: {e}")
                # fallback to background geocoding (address-based)
                geocode_emergency_request(request_id=instance.id)

        # Always create a Ticket
        Ticket.objects.create(emergency_request=instance)


#Different Implementations

# # from django.db.models.signals import post_save
# from django.dispatch import receiver
# from .models import EmergencyRequest
# from .tasks import geocode_emergency_request  # background task
# from ticket.models import Ticket
# from urllib.request import urlopen

# @receiver(post_save, sender=EmergencyRequest)
# def trigger_geocoding(sender, instance, created, **kwargs):
#     if created and not (instance.latitude and instance.longitude):
#         geocode_emergency_request(request_id=instance.id)
#     Ticket.objects.create(emergency_request=instance)    
        