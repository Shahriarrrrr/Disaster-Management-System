# volunteer/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VolunteerView

router = DefaultRouter()
router.register(r'volunteers', VolunteerView, basename='volunteer')

urlpatterns = [
    path('', include(router.urls)),
]