from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import VolunteerJoinRequest, VolunteerProfile

@receiver(post_save, sender=VolunteerJoinRequest)
def create_volunteer_profile(sender, instance, created, **kwargs):
    if instance.status == VolunteerJoinRequest.Status.ACCEPTED:
        # Avoid duplicate profile creation
        if not hasattr(instance.user, 'volunteer_profile'):
            VolunteerProfile.objects.create(user=instance.user)  # status defaults to INACTIVE
