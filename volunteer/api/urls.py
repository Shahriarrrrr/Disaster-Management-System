# volunteer/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VolunteerView, VolunteerJoinRequestViewSet

router = DefaultRouter()
router.register(r'volunteers', VolunteerView, basename='volunteer')
router.register(r'join-requests', VolunteerJoinRequestViewSet, basename='join-request')

urlpatterns = [
    path('', include(router.urls)),
]