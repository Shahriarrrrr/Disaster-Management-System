from django.contrib import admin
from .models import Campaign, CampaignUpdate, CampaignComment


@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ['title', 'location', 'goal_amount', 'start_date', 'end_date', 'is_active']
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ['title', 'location']
    list_filter = ['is_active', 'start_date', 'end_date']
    ordering = ['-created_at']


@admin.register(CampaignUpdate)
class CampaignUpdateAdmin(admin.ModelAdmin):
    list_display = ['title', 'campaign', 'total_collected', 'created_at']
    search_fields = ['title', 'campaign__title']
    list_filter = ['created_at']


@admin.register(CampaignComment)
class CampaignCommentAdmin(admin.ModelAdmin):
    list_display = ['campaign', 'user', 'content', 'posted_at']
    search_fields = ['campaign__title', 'user__username', 'content']
    list_filter = ['posted_at']

