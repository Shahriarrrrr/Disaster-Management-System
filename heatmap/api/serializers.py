from rest_framework import serializers
from heatmap.models import Heatmap

class HeatmapSerializer(serializers.ModelSerializer):
    class Meta:
        model = Heatmap
        fields = '__all__'
