from django.db import models
from django.conf import settings
from campaign.models import Campaign

# Create your models here.

class Donation(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Success', 'Success'),
        ('Failed', 'Failed'),
        ('Cancelled', 'Cancelled'),
    ]
    donation_cause = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='donations')
    donor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    donor_name = models.CharField(max_length=255,blank=True, null=True)
    donation_amount = models.DecimalField(max_digits=10, decimal_places=2)
    donated_at = models.DateTimeField(auto_now_add=True)
    donor_remarks = models.TextField()
    transaction_id = models.CharField(max_length=255,unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')

    def display_donor_name(self):
        if self.donor:
            return self.donor.get_full_name() or self.donor.username
        return self.donor_name or "Anonymous"

    def __str__(self):
        return f"{self.display_donor_name()} - {self.donation_amount}"


class Funds(models.Model):
    total_amount = models.DecimalField(max_digits=30, decimal_places=2, default=0.00)
    last_updated = models.DateTimeField(auto_now = True)


class FundTransaction(models.Model):
    TRANSACTION_TYPES = (
        ('donation', 'Donation'),
        ('expense', 'Expense'),
    )
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    #related_donation = models.ForeignKey(Donation, on_delete=models.SET_NULL, null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    date = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.transaction_type.capitalize()} - {self.amount} on {self.date.strftime('%Y-%m-%d')}"
