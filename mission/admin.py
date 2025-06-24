# admin.py
from django.contrib import admin
from .models import Mission, MissionJoinRequest

@admin.register(Mission)
class MissionAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'type',
        'location',
        'start_date',
        'end_date',
        'urgency',
        'volunteers_needed',
        'volunteers_joined',
        'status',
        'progress',
        'lives_can_be_saved',
    )
    list_filter = ('urgency', 'status', 'start_date', 'end_date')
    search_fields = ('title', 'location', 'coordinator', 'description')




@admin.register(MissionJoinRequest)
class MissionJoinRequestAdmin(admin.ModelAdmin):
    list_display = ('volunteer', 'mission', 'status', 'requested_at', 'reviewed_at')
    list_filter = ('status', 'requested_at')
    search_fields = (
        'volunteer__user__email',
        'volunteer__user__first_name',
        'volunteer__user__last_name',
        'mission__title',
    )
    readonly_fields = ('requested_at', 'reviewed_at')

    actions = ['approve_requests', 'reject_requests']

    @admin.action(description='Approve selected join requests')
    def approve_requests(self, request, queryset):
        for req in queryset.filter(status='PENDING'):
            req.approve()
        self.message_user(request, f"{queryset.count()} requests approved.")

    @admin.action(description='Reject selected join requests')
    def reject_requests(self, request, queryset):
        for req in queryset.filter(status='PENDING'):
            req.reject()
        self.message_user(request, f"{queryset.count()} requests rejected.")