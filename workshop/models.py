from django.db import models

class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Course(models.Model):
    LEVEL_CHOICES = [
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    ]

    STATUS_CHOICES = [
        ('Open', 'Open'),
        ('Almost Full', 'Almost Full'),
        ('Full', 'Full'),
    ]

    title = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    duration = models.CharField(max_length=50)  # Alternatively, you could use IntegerField for hours
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    instructor = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    max_participants = models.PositiveIntegerField()
    enrolled = models.PositiveIntegerField()
    description = models.TextField()
    skills = models.ManyToManyField(Skill, related_name='courses')
    certification = models.CharField(max_length=150)
    cost = models.CharField(max_length=50)
    location = models.CharField(max_length=200)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)

    def __str__(self):
        return self.title
