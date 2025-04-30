from rest_framework import viewsets
from .permissions import IsAdminOrReadOnly
from shelter.models import Shelter
from .serializers import ShelterSerializer

class ShelterViewSet(viewsets.ModelViewSet):
    queryset = Shelter.objects.all()
    serializer_class = ShelterSerializer
    permission_classes = [IsAdminOrReadOnly]