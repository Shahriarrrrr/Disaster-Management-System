from rest_framework import viewsets, status, permissions
from .serializers import VolunteerSerializer, VolunteerJoinRequestSerializer
from volunteer.models import VolunteerProfile, VolunteerJoinRequest
from rest_framework.exceptions import NotAuthenticated
from rest_framework.response import Response

class VolunteerView(viewsets.ModelViewSet):
    serializer_class = VolunteerSerializer

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            raise NotAuthenticated("Authentication credentials were not provided.")
        if user.is_staff or user.is_superuser:
            return VolunteerProfile.objects.all()
        return VolunteerProfile.objects.filter(user=user)

    def create(self, request, *args, **kwargs):
        user = request.user  # Automatically gets the user from the token

        # Check if the user already has a volunteer profile
        if VolunteerProfile.objects.filter(user=user).exists():
            return Response({"detail": "Volunteer profile already exists."}, status=status.HTTP_400_BAD_REQUEST)

        # Use the provided data to create the volunteer profile
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            # Save the volunteer profile, associating it with the logged-in user
            volunteer_profile = serializer.save(user=user)

            # Return a success response with the newly created profile data
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VolunteerJoinRequestViewSet(viewsets.ModelViewSet):
    serializer_class = VolunteerJoinRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users can only see their own join requests unless staff
        user = self.request.user
        if user.is_staff:
            return VolunteerJoinRequest.objects.all()
        return VolunteerJoinRequest.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  # Assign logged-in user automatically