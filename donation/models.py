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
    fund_cause = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='funds',null=True, blank=True)
    total_amount = models.DecimalField(max_digits=30, decimal_places=2, default=0.00)
    last_updated = models.DateTimeField(auto_now = True)
    def __str__(self):
        return f"Fund for {self.fund_cause.title} - Total Amount: {self.total_amount}"


class FundTransaction(models.Model):
    TRANSACTION_TYPES = (
        ('donation', 'Donation'),
        ('expense', 'Expense'),
    )
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    fund = models.ForeignKey(Funds, on_delete=models.CASCADE, related_name='transactions' ,null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    date = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Update the total_amount when a new transaction is saved
        if self.transaction_type == 'donation':
            self.fund.total_amount += self.amount
        elif self.transaction_type == 'expense':
            self.fund.total_amount -= self.amount
        self.fund.save()
        
        super(FundTransaction, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.transaction_type.capitalize()} - {self.amount} on {self.date.strftime('%Y-%m-%d')}"