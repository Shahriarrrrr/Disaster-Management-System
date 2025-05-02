# tickets/serializers.py
from rest_framework import serializers
from ticket.models import Ticket, TicketResponse

class TicketResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketResponse
        fields = '__all__'
        read_only_fields = ['id', 'responded_at']

class TicketSerializer(serializers.ModelSerializer):
    responses = TicketResponseSerializer(many=True, read_only=True)

    class Meta:
        model = Ticket
        fields = '__all__'
        read_only_fields = ['id', 'ticket_id', 'created_at', 'updated_at']
