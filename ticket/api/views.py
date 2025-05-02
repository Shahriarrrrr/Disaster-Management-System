from rest_framework import viewsets
from ticket.models import Ticket, TicketResponse
from .serializers import TicketSerializer, TicketResponseSerializer

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer

class TicketResponseViewSet(viewsets.ModelViewSet):
    queryset = TicketResponse.objects.all()
    serializer_class = TicketResponseSerializer