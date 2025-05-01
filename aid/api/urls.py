from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AidRequestView

router = DefaultRouter()
router.register(r'Aid', AidRequestView)

urlpatterns = [
    path('', include(router.urls)),
]
