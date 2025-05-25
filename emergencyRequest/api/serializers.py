from rest_framework import serializers
from emergencyRequest.models import EmergencyRequest

class EmergencyRequestSerializer(serializers.ModelSerializer):
    #user_name = serializers.CharField(source='user.user_name', read_only=True)
    class Meta:
        model = EmergencyRequest
        fields = "__all__"
        