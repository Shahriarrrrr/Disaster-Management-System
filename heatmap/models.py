from django.db import models

class Heatmap(models.Model):
    DISASTER_TYPES = [
        ("Earthquake", "Earthquake"),
        ("Flood", "Flood"),
        ("Wildfire", "Wildfire"),
        ("Hurricane", "Hurricane"),
        ("Tornado", "Tornado"),
    ]

    SEVERITY_LEVELS = [
        ("Low", "Low"),
        ("Medium", "Medium"),
        ("High", "High"),
    ]

    STATUS_CHOICES = [
        ("Active", "Active"),
        ("Recovering", "Recovering"),
        ("Resolved", "Resolved"),
        ("Contained", "Contained"),
    ]

    type = models.CharField(max_length=20, choices=DISASTER_TYPES)
    severity = models.CharField(max_length=10, choices=SEVERITY_LEVELS)
    magnitude = models.FloatField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    location = models.CharField(max_length=255)
    date = models.DateField()
    affected_people = models.PositiveIntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    description = models.TextField()
    casualties = models.PositiveIntegerField()
    damage_cost = models.BigIntegerField()

    def __str__(self):
        return f"{self.type} in {self.location} on {self.date}"
