from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from workshop.models import Course, Skill, CourseJoinRequest
from .serializers import (
    CourseSerializer, CourseCreateUpdateSerializer,
    SkillSerializer, CourseJoinRequestSerializer, CourseJoinRequestUpdateSerializer
)

class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return CourseCreateUpdateSerializer
        return CourseSerializer

    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class CourseJoinRequestViewSet(viewsets.ModelViewSet):
    queryset = CourseJoinRequest.objects.all()

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return CourseJoinRequestUpdateSerializer
        return CourseJoinRequestSerializer

    def perform_create(self, serializer):
        # Automatically associate the request with the logged-in user
        serializer.save(user=self.request.user)

    def get_queryset(self):
        # Optional: Filter to only show requests related to the current user
        if self.request.user.is_staff:
            return CourseJoinRequest.objects.all()
        return CourseJoinRequest.objects.filter(user=self.request.user)

    permission_classes = [permissions.IsAuthenticated]
