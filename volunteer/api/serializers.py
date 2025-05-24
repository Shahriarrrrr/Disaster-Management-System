from rest_framework import serializers
from volunteer.models import VolunteerProfile, VolunteerJoinRequest


class VolunteerSerializer(serializers.ModelSerializer):
    class Meta:
        model = VolunteerProfile
        fields = '__all__'
        depth = 1  # Optional, if you want nested representations



class VolunteerJoinRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = VolunteerJoinRequest
        fields = '__all__'
        read_only_fields = ['user', 'status', 'request_date']