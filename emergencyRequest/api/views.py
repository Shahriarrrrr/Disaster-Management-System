from emergencyRequest.models import EmergencyRequest
from .serializers import EmergencyRequestSerializer
from rest_framework import viewsets

class EmergencyRequestView(viewsets.ModelViewSet):
    queryset = EmergencyRequest.objects.all()
    serializer_class = EmergencyRequestSerializer
