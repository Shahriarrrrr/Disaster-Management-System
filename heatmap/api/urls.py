from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HeatmapViewSet

router = DefaultRouter()
router.register(r'heatmaps', HeatmapViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
