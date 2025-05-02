from django.contrib import admin
from .models import Ticket, TicketResponse
# Register your models here.


admin.site.register(Ticket)
admin.site.register(TicketResponse)
