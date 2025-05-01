from django.db import models
from django.conf import settings
from django.core.validators import MaxValueValidator

class AidRequest(models.Model):
    BANK_CHOICES = [
    ('AB Bank', 'AB Bank'),
    ('Agrani Bank', 'Agrani Bank'),
    ('Al-Arafah Islami Bank', 'Al-Arafah Islami Bank'),
    ('Bangladesh Commerce Bank', 'Bangladesh Commerce Bank'),
    ('Bangladesh Development Bank', 'Bangladesh Development Bank'),
    ('Bangladesh Krishi Bank', 'Bangladesh Krishi Bank'),
    ('Bank Asia', 'Bank Asia'),
    ('BASIC Bank', 'BASIC Bank'),
    ('Brac Bank', 'Brac Bank'),
    ('Citibank N.A.', 'Citibank N.A.'),
    ('Commercial Bank of Ceylon', 'Commercial Bank of Ceylon'),
    ('Community Bank', 'Community Bank'),
    ('Dhaka Bank', 'Dhaka Bank'),
    ('Dutch-Bangla Bank', 'Dutch-Bangla Bank'),
    ('Eastern Bank', 'Eastern Bank'),
    ('Exim Bank', 'Exim Bank'),
    ('First Security Islami Bank', 'First Security Islami Bank'),
    ('Habib Bank', 'Habib Bank'),
    ('ICB Islamic Bank', 'ICB Islamic Bank'),
    ('IFIC Bank', 'IFIC Bank'),
    ('Islami Bank Bangladesh', 'Islami Bank Bangladesh'),
    ('Jamuna Bank', 'Jamuna Bank'),
    ('Janata Bank', 'Janata Bank'),
    ('Meghna Bank', 'Meghna Bank'),
    ('Mercantile Bank', 'Mercantile Bank'),
    ('Midland Bank', 'Midland Bank'),
    ('Modhumoti Bank', 'Modhumoti Bank'),
    ('Mutual Trust Bank', 'Mutual Trust Bank'),
    ('National Bank', 'National Bank'),
    ('National Bank of Pakistan', 'National Bank of Pakistan'),
    ('NRB Bank', 'NRB Bank'),
    ('NRB Commercial Bank', 'NRB Commercial Bank'),
    ('NRB Global Bank', 'NRB Global Bank'),
    ('One Bank', 'One Bank'),
    ('Padma Bank', 'Padma Bank'),
    ('Palli Sanchay Bank', 'Palli Sanchay Bank'),
    ('Premier Bank', 'Premier Bank'),
    ('Prime Bank', 'Prime Bank'),
    ('Pubali Bank', 'Pubali Bank'),
    ('Rupali Bank', 'Rupali Bank'),
    ('Shahjalal Islami Bank', 'Shahjalal Islami Bank'),
    ('Shimanto Bank', 'Shimanto Bank'),
    ('Social Islami Bank', 'Social Islami Bank'),
    ('Sonali Bank', 'Sonali Bank'),
    ('South Bangla Agriculture and Commerce Bank', 'South Bangla Agriculture and Commerce Bank'),
    ('Southeast Bank', 'Southeast Bank'),
    ('Standard Bank', 'Standard Bank'),
    ('Standard Chartered Bank', 'Standard Chartered Bank'),
    ('State Bank of India', 'State Bank of India'),
    ('The City Bank', 'The City Bank'),
    ('Trust Bank', 'Trust Bank'),
    ('Union Bank', 'Union Bank'),
    ('United Commercial Bank', 'United Commercial Bank'),
    ('Uttara Bank', 'Uttara Bank'),
]
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('rejected', 'Rejected'),
        ('resolved', 'Resolved'),
    ]

    URGENCY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    CATEGORY_CHOICES = [
        ('medical', 'Medical'),
        ('education', 'Education'),
        ('food', 'Food'),
        ('shelter', 'Shelter'),
        ('other', 'Other'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    amount_needed = models.IntegerField(blank=False, validators=[MaxValueValidator(999999)])
    address = models.TextField()
    state = models.CharField(max_length=255)
    contact_number = models.CharField(max_length=20)
    reason = models.TextField()
    proof_of_cause = models.FileField(upload_to='proofs/')
    related_pictures = models.ImageField(upload_to='pictures/')
    total_family_members = models.IntegerField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    urgency = models.CharField(max_length=10, choices=URGENCY_CHOICES, default='medium')
    needed_by = models.DateField(null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    is_funded = models.BooleanField(default=False)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    bkash_number = models.CharField(max_length=20, blank=True, null=True)
    bank_name = models.CharField(max_length=100, choices=BANK_CHOICES, blank=True, null=True)
    bank_account_name = models.CharField(max_length=255, blank=True, null=True)
    bank_account_number = models.CharField(max_length=20, blank=True, null=True)
    review_note = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Aid Request"
        verbose_name_plural = "Aid Requests"

    def __str__(self):
        return f"{self.title} - {self.user.user_name}"

