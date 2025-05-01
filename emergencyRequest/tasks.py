from background_task import background
from geopy.geocoders import Nominatim
from .models import EmergencyRequest

@background(schedule=60)
def geocode_emergency_request(request_id):
    try:
        emergency = EmergencyRequest.objects.get(id=request_id)
        if not (emergency.latitude and emergency.longitude):
            geolocator = Nominatim(user_agent="DMSRF")
            location = geolocator.geocode(emergency.location_address)
            
            if location:
                emergency.latitude = location.latitude
                emergency.longitude = location.longitude
                emergency.save(update_fields=['latitude', 'longitude'])
    except Exception as e:
        print(f"Error geocoding: {e}")