from django.db import models
from django.utils import timezone

# models.py

class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Program(models.Model):
    program_name = models.CharField(max_length=255)
    program_description = models.TextField()
    program_organizer = models.CharField(max_length=255)
    program_conductor = models.CharField(max_length=255)
    program_skill = models.ForeignKey(Skill,on_delete=models.CASCADE,related_name='programs',null=True,blank=True)  # now one-to-many
    program_location = models.CharField(max_length=255)
    program_seats = models.IntegerField(default=0)
    program_start_date = models.DateTimeField()
    program_end_date = models.DateTimeField()
    program_duration = models.IntegerField()

    def calculate_enrollments(self):
        return self.volunteerprofile_set.count()  

    @property
    def program_seats_available(self):
        return self.program_seats - self.calculate_enrollments()

    def __str__(self):
        return self.program_name