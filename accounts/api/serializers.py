from rest_framework import serializers
from accounts.models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = [
            'id',
            'email',
            'password',
            'user_name',
            'user_gender',
            'user_age',
            'user_phone',
            'user_state',
            'user_address',
            'user_profile_image',
            'user_nid',
            'user_type',
            'user_awards',
            'user_total_donate',
            'user_last_donated_at',
        ]
        read_only_fields = ['user_total_donate', 'user_last_donated_at']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.is_superuser = False  # Enforce safety
        user.is_staff = False
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
