from accounts.models import CustomUser
from rest_framework import viewsets, generics
from .serializers import CustomUserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny


class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return CustomUser.objects.filter(id=self.request.user.id)
    


class RegisterUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [AllowAny]
    def get_queryset(self):
        return CustomUser.objects.filter(id=self.request.user.id)
