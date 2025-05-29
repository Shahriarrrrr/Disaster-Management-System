from django.db import models
from django.conf import settings
from campaign.models import Campaign
from program.models import Program
from mission.models import Mission


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

    causes_served = models.ManyToManyField(
        Campaign, related_name='volunteers_served', blank=True
    )
    working_hours = models.IntegerField(default=0)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='INACTIVE')

    joined_programs = models.ManyToManyField(Program, blank=True)
    joined_missions = models.ManyToManyField(Mission, related_name='volunteers_joined_mission', blank=True)
    completed_missions = models.ManyToManyField(Mission, related_name='volunteers_completed_mission', blank=True)

    def __str__(self):
        return self.user.email  # use 'username' unless you renamed the field

    def total_programs_joined(self):
        return self.joined_programs.count()

    def total_joined_missions(self):
        return self.joined_missions.count()

    def total_completed_missions(self):
        return self.completed_missions.count()



class VolunteerJoinRequest(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        ACCEPTED = 'accepted', 'Accepted'
        REJECTED = 'rejected', 'Rejected'

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='volunteer_join_request'
    )
    request_date = models.TimeField(auto_now_add=True)
    cause_of_joining = models.TextField()
    emergency_contact = models.CharField(max_length=15, unique=True)
    age = models.PositiveIntegerField()
    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.PENDING
    )

    def __str__(self):
        return f"{self.user.user_name} - {self.status}"