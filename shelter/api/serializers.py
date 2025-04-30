from rest_framework import serializers
from shelter.models import Shelter


class ShelterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shelter
        fields = "__all__"
        

