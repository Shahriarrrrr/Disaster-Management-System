from rest_framework import viewsets
from heatmap.models import Heatmap
from .serializers import HeatmapSerializer

class HeatmapViewSet(viewsets.ModelViewSet):
    queryset = Heatmap.objects.all()
    serializer_class = HeatmapSerializer
