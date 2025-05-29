# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MissionViewSet, MissionJoinRequestViewSet

router = DefaultRouter()
router.register(r'missions', MissionViewSet)
router.register(r'mission-requests', MissionJoinRequestViewSet, basename='mission-requests')

urlpatterns = [
    path('', include(router.urls)),
]
