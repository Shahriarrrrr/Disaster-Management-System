from rest_framework import viewsets
from ticket.models import Ticket, TicketResponse
from .serializers import TicketSerializer, TicketResponseSerializer
from .permissions import IsAdminOnly

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [IsAdminOnly]

class TicketResponseViewSet(viewsets.ModelViewSet):
    queryset = TicketResponse.objects.all()
    serializer_class = TicketResponseSerializer
    permission_classes = [IsAdminOnly]