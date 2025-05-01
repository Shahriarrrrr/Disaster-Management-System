from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmergencyRequestView

router = DefaultRouter()
router.register(r'EmergencyRequest', EmergencyRequestView)

urlpatterns = [
    path('', include(router.urls)),
]
