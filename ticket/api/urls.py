from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import TicketViewSet, TicketResponseViewSet

router = DefaultRouter()
router.register(r'tickets', TicketViewSet)
router.register(r'ticket-responses', TicketResponseViewSet)

urlpatterns = [
    path('', include(router.urls)),
]