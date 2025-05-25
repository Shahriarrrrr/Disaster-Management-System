from django.db import models
from django.conf import settings

# Create your models here.


class Campaign(models.Model):
    title = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField()
    goal_amount = models.DecimalField(max_digits=12, decimal_places=2)
    image = models.ImageField(upload_to='campaigns/', blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    featured = models.BooleanField(default=False)

    def __str__(self):
        return self.title


class CampaignUpdate(models.Model):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='updates')
    title = models.CharField(max_length=200)
    content = models.TextField()
    image = models.ImageField(upload_to="campaign_updates/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    total_collected = models.DecimalField(max_digits=12, decimal_places=2)
    def __str__(self):
        return f"{self.title} - {self.campaign.title}"


class CampaignComment(models.Model):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    posted_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Comment by {self.user} on {self.campaign.title}"