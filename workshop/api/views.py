from rest_framework import viewsets
from workshop.models import Course, Skill
from .serializers import (
    CourseSerializer, CourseCreateUpdateSerializer,
    SkillSerializer
)

class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return CourseCreateUpdateSerializer
        return CourseSerializer
