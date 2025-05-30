from background_task import background
from geopy.geocoders import Nominatim
from .models import EmergencyRequest

@background(schedule=10)
def geocode_emergency_request(request_id):
    try:
        emergency = EmergencyRequest.objects.get(id=request_id)
        if not (emergency.latitude and emergency.longitude):
            address = emergency.location_address
            geolocator = Nominatim(user_agent="geopy_example")
            location = geolocator.geocode(address)
            if location:
                emergency.latitude = location.latitude
                emergency.longitude = location.longitude
                emergency.save(update_fields=['latitude', 'longitude'])
            else:
                print(f"Address can't be found: {address}")
    except Exception as e:
        print(f"Error geocoding emergency request {request_id}: {e}")
