from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, SkillViewSet, CourseJoinRequestViewSet

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'skills', SkillViewSet)
router.register(r'join-requests', CourseJoinRequestViewSet)  # <— added

urlpatterns = [
    path('', include(router.urls)),
]
