from rest_framework import serializers
from campaign.models import Campaign, CampaignUpdate, CampaignComment

class CampaignUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignUpdate
        fields = ['id', 'title', 'content', 'image', 'created_at', 'total_collected']

class CampaignCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignComment
        fields = ['id', 'user', 'content', 'posted_at']

class CampaignSerializer(serializers.ModelSerializer):
    updates = CampaignUpdateSerializer(many=True, read_only=True)  # Nested updates
    comments = CampaignCommentSerializer(many=True, read_only=True)  # Nested comments
    
    class Meta:
        model = Campaign
        fields = [
            'id', 'title', 'location', 'slug', 'description', 'goal_amount',
            'image', 'start_date', 'end_date', 'is_active', 'created_at',
            'updates', 'comments'
        ]
