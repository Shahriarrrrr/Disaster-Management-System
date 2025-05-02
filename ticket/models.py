# tickets/models.py
from django.db import models
from django.conf import settings
from emergencyRequest.models import EmergencyRequest

class Ticket(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('rescued', 'Rescued'),
        ('cancelled', 'Cancelled'),
    ]

    emergency_request = models.OneToOneField(EmergencyRequest, on_delete=models.CASCADE, related_name='ticket')
    ticket_id = models.CharField(max_length=20, unique=True, editable=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    assigned_admin = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.ticket_id:
            from uuid import uuid4
            self.ticket_id = f"TKT{uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Ticket #{self.ticket_id} for {self.emergency_request.user.email}"


class TicketResponse(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='responses')
    responder = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    message = models.TextField()
    responded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Response by {self.responder} on {self.responded_at}"