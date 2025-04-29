from django.db import models
from django.conf import settings
from campaign.models import Campaign
from program.models import Program


#NEEDS WORK
class VolunteerProfile(models.Model):
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('INACTIVE', 'Inactive'),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='volunteer_profile'
    )
    awards = models.TextField(blank=True, null=True)
    causes_served = models.ManyToManyField(Campaign, related_name='volunteers_served', blank=True)
    working_hours = models.IntegerField(default=0)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='INACTIVE')
    joined_programs = models.ManyToManyField(Program, blank=True)

    def total_programs_joined(self):
        return self.joined_programs.count()
