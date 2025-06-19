from django.db import models
from django.conf import settings

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
    duration = models.CharField(max_length=50)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    instructor = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    max_participants = models.PositiveIntegerField()
    description = models.TextField()
    skills = models.ManyToManyField(Skill, related_name='courses')
    certification = models.CharField(max_length=150)
    cost = models.CharField(max_length=50)
    location = models.CharField(max_length=200)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    participants = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='joined_courses',
        blank=True
    )

    def __str__(self):
        return self.title
    
    @property
    def enrolled(self):
        # Return the current count of participants
        return self.participants.count()


class CourseJoinRequest(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='course_requests'
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='join_requests'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Pending'
    )
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'course')

    def save(self, *args, **kwargs):
        previous = None
        if self.pk:
            previous = CourseJoinRequest.objects.get(pk=self.pk)

        super().save(*args, **kwargs)

        if self.status == 'Approved':
            self.course.participants.add(self.user)
        elif previous and previous.status == 'Approved' and self.status != 'Approved':
            self.course.participants.remove(self.user)

    def __str__(self):
        return f"{self.user.user_name} → {self.course.title} ({self.status})"
