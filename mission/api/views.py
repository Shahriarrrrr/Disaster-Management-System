# views.py
from rest_framework import viewsets, permissions
from mission.models import Mission, MissionJoinRequest
from .serializers import MissionSerializer, MissionJoinRequestSerializer
from volunteer.models import VolunteerProfile
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied

class MissionViewSet(viewsets.ModelViewSet):
    queryset = Mission.objects.all()
    serializer_class = MissionSerializer




class MissionJoinRequestViewSet(viewsets.ModelViewSet):
    serializer_class = MissionJoinRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MissionJoinRequest.objects.filter(volunteer__user=self.request.user)

    def perform_create(self, serializer):
        volunteer = VolunteerProfile.objects.get(user=self.request.user)
        serializer.save(volunteer=volunteer)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        action = request.data.get('action', None)

        if action in ['approve', 'reject']:
            if not request.user.is_staff:
                raise PermissionDenied("Only admins can approve or reject join requests.")

            if action == 'approve':
                instance.approve()
            else:
                instance.reject()

            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        else:
            # normal update (PATCH/PUT)
            return super().update(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        if not request.user.is_staff:
            raise PermissionDenied("Only admins can approve join requests.")

        instance = self.get_object()
        instance.approve()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        if not request.user.is_staff:
            raise PermissionDenied("Only admins can reject join requests.")

        instance = self.get_object()
        instance.reject()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    serializer_class = MissionJoinRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MissionJoinRequest.objects.filter(volunteer__user=self.request.user)

    def perform_create(self, serializer):
        volunteer = VolunteerProfile.objects.get(user=self.request.user)
        serializer.save(volunteer=volunteer)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        action = request.data.get('action', None)

        if action == 'approve':
            instance.approve()
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        elif action == 'reject':
            instance.reject()
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        else:
            # normal update (PATCH/PUT)
            return super().update(request, *args, **kwargs)

    # Optional: separate endpoints for approve/reject
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        instance = self.get_object()
        instance.approve()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        instance = self.get_object()
        instance.reject()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)