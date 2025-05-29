# models.py
from django.utils import timezone 
from django.db import models

class Mission(models.Model):
    URGENCY_CHOICES = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
    ]

    STATUS_CHOICES = [
        ('Planned', 'Planned'),
        ('Active', 'Active'),
        ('Completed', 'Completed'),
    ]

    title = models.CharField(max_length=255)
    type = models.CharField(max_length=100)
    location = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()
    urgency = models.CharField(max_length=10, choices=URGENCY_CHOICES)
    volunteers_needed = models.IntegerField()
    volunteers_joined = models.IntegerField(default=0)
    description = models.TextField()
    skills = models.JSONField(default=list)  # Stores list of skills
    coordinator = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    progress = models.IntegerField(default=0)  # 0 to 100
    lives_can_be_saved = models.IntegerField(default=0)

    def __str__(self):
        return self.title



class MissionJoinRequest(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
    ]

    volunteer = models.ForeignKey('volunteer.VolunteerProfile', on_delete=models.CASCADE, related_name='mission_requests')
    mission = models.ForeignKey('mission.Mission', on_delete=models.CASCADE, related_name='join_requests')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    requested_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('volunteer', 'mission')

    def __str__(self):
        return f"{self.volunteer.user.email} - {self.mission.title} ({self.status})"

    def approve(self):
        print(f"Approving request for volunteer {self.volunteer} on mission {self.mission}")
        self.status = 'ACCEPTED'
        self.reviewed_at = timezone.now()
        self.save()

        self.volunteer.joined_missions.add(self.mission)
        print("Mission added to volunteer's joined_missions")
    def reject(self):
        self.status = 'REJECTED'
        self.reviewed_at = timezone.now()
        self.save()