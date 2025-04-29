from rest_framework import serializers
from volunteer.models import VolunteerProfile


class VolunteerSerializer(serializers.ModelSerializer):
    class Meta:
        model = VolunteerProfile
        fields = '__all__'
        depth = 1  # Optional, if you want nested representations