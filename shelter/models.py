from django.db import models

class Shelter(models.Model):
    name = models.CharField(max_length=100)
    address = models.TextField()
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    postal_code = models.CharField(max_length=20)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    capacity = models.PositiveIntegerField()
    remaining_capacity = models.PositiveIntegerField()
    description = models.TextField(blank=True)
    google_maps_link = models.URLField(max_length=300, blank=True)

    def __str__(self):
        return self.name

    def get_google_maps_link(self):
        if self.latitude and self.longitude:
            return f"https://www.google.com/maps?q={self.latitude},{self.longitude}"
        return None

    def save(self, *args, **kwargs):
        # Auto-update the stored link
        if self.latitude and self.longitude:
            self.google_maps_link = self.get_google_maps_link()
        else:
            self.google_maps_link = ""
        super().save(*args, **kwargs)
