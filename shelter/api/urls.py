from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ShelterViewSet

# Create a router and register the viewsets
router = DefaultRouter()
router.register(r'shelters', ShelterViewSet)

urlpatterns = [
    path('', include(router.urls)),  # Include the router URLs
]