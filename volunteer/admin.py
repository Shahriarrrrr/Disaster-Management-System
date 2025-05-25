from django.contrib import admin
from .models import VolunteerProfile, VolunteerJoinRequest

@admin.register(VolunteerProfile)
class VolunteerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'status', 'working_hours')
    list_filter = ('status',)

@admin.register(VolunteerJoinRequest)
class VolunteerJoinRequestAdmin(admin.ModelAdmin):
    list_display = ('user', 'status', 'request_date', 'age', 'emergency_contact')
    list_filter = ('status',)
    readonly_fields = ('request_date',)
