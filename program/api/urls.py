from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProgramView

router = DefaultRouter()
router.register(r'programs', ProgramView)

urlpatterns = [
    path('', include(router.urls)),
]
