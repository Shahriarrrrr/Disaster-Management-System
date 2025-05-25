from aid.models import AidRequest
from .serializers import AidRequestSerializer
from rest_framework import viewsets
from .permissions import AidRequestPermissions



class AidRequestView(viewsets.ModelViewSet):
    queryset = AidRequest.objects.all()
    serializer_class = AidRequestSerializer
    permission_classes = [AidRequestPermissions]
    def perform_create(self, serializer):
        # Automatically assign the current user as the requester
        serializer.save(user=self.request.user)