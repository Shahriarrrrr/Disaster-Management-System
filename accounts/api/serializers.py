from rest_framework import serializers
from accounts.models import CustomUser


class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only = True)

    class Meta:
        model  = CustomUser
        #fields = ['user_name','password','user_address']
        fields = '__all__'

    # def create(self, validated_data):
    #     password = validated_data.pop('password')  # Extract password
    #     print(f"The password : {password}")
    #     user = CustomUser(**validated_data)        # Create instance (without password)
    #     user.set_password(password)                # Hash the password
    #     user.save()                                # Save to DB
    #     return user
    def create(self, validated_data):
        password = validated_data.pop('password')
        
        # Use the manager's create_user method to avoid creating superuser by mistake
        user = CustomUser.objects.create_user(**validated_data)
        user.set_password(password)  # Hash the password
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