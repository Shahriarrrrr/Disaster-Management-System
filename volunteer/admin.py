from django.contrib import admin
from .models import VolunteerProfile, VolunteerJoinRequest

@admin.register(VolunteerProfile)
class VolunteerProfileAdmin(admin.ModelAdmin):
    list_display = (
        'user', 
        'status', 
        'working_hours', 
        'total_programs_joined',
        'total_joined_missions',
        'total_completed_missions'
    )
    list_filter = ('status',)
    search_fields = ('user__user_name', 'user__email')  # Optional: helps admin search
    filter_horizontal = (
        'causes_served', 
        'joined_programs', 
        'joined_missions', 
        'completed_missions'
    )  # Better UI for many-to-many fields

@admin.register(VolunteerJoinRequest)
class VolunteerJoinRequestAdmin(admin.ModelAdmin):
    list_display = ('user', 'status', 'request_date', 'age', 'emergency_contact')
    list_filter = ('status',)
    readonly_fields = ('request_date',)
