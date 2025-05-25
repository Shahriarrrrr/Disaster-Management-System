from emergencyRequest.models import EmergencyRequest
from .serializers import EmergencyRequestSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .permissions import IsOwnerOrAdmin

class EmergencyRequestViewSet(viewsets.ModelViewSet):
    serializer_class = EmergencyRequestSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    queryset = EmergencyRequest.objects.all()  # Define the queryset here as a fallback

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return EmergencyRequest.objects.all()
        return EmergencyRequest.objects.filter(user=user)
