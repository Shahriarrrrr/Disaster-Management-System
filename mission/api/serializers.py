# serializers.py
from rest_framework import serializers
from mission.models import Mission, MissionJoinRequest

class MissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mission
        fields = '__all__'



class MissionJoinRequestSerializer(serializers.ModelSerializer):
    volunteer = serializers.StringRelatedField(read_only=True)
    mission = serializers.StringRelatedField(read_only=True)
    mission_id = serializers.PrimaryKeyRelatedField(
        queryset=MissionJoinRequest._meta.get_field('mission').related_model.objects.all(),
        write_only=True,
        source='mission'
    )

    class Meta:
        model = MissionJoinRequest
        fields = [
            'id', 'volunteer', 'mission', 'mission_id', 'status',
            'requested_at', 'reviewed_at'
        ]
        read_only_fields = [ 'requested_at', 'reviewed_at']