from rest_framework import serializers
from aid.models import AidRequest

class AidRequestSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.user_name', read_only=True)
    class Meta:
        model = AidRequest
        fields = "__all__"
        read_only_fields = ('is_verified', 'is_funded', 'status', 'review_note')
        