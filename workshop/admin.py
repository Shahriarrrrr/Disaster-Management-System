from django.contrib import admin
from .models import Course, Skill, CourseJoinRequest

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'level', 'start_date', 'end_date', 'status')
    list_filter = ('level', 'status', 'category')
    search_fields = ('title', 'instructor')


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    search_fields = ('name',)


@admin.register(CourseJoinRequest)
class CourseJoinRequestAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__username', 'course__title', 'message')
    ordering = ('-created_at',)
    list_per_page = 25

    actions = ['approve_requests', 'reject_requests']

    def approve_requests(self, request, queryset):
        updated = 0
        for join_request in queryset:
            if join_request.status != 'Approved':
                join_request.status = 'Approved'
                join_request.save()
                updated += 1
        self.message_user(request, f"{updated} request(s) approved.")
    approve_requests.short_description = "Approve selected join requests"

    def reject_requests(self, request, queryset):
        updated = 0
        for join_request in queryset:
            if join_request.status != 'Rejected':
                join_request.status = 'Rejected'
                join_request.save()
                updated += 1
        self.message_user(request, f"{updated} request(s) rejected.")
    reject_requests.short_description = "Reject selected join requests"
