from django.db import models
from django.contrib.auth.models import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

# Custom User Manager
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)  # Use _db instead of db
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

# Custom User model
class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    
    STATE_CHOICE = (
        ('Barisal', 'Barisal'),
        ('Chattogram', 'Chattogram'),
        ('Dhaka', 'Dhaka'),
        ('Khulna', 'Khulna'),
        ('Mymensingh', 'Mymensingh'),
        ('Rajshahi', 'Rajshahi'),
        ('Rangpur', 'Rangpur'),
        ('Sylhet', 'Sylhet'),
    )

    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]

    TIER_CHOICES = [
        ('SUPPORTER', 'Supporter'),
        ('ROOKIE', 'Rookie'),
        ('CHAMPION', 'Champion'),
        ('VISIONARY', 'Visionary'),
        ('LEGEND', 'Legend'),
    ]

    user_type = models.CharField(max_length=10, choices=[('regular', 'Regular'), ('volunteer', 'Volunteer')], default='regular')
    user_name = models.CharField(max_length=100)
    user_gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    user_age = models.PositiveIntegerField(null=True, blank=True)
    user_phone = models.CharField(max_length=15, unique=True)  # Phone number uniqueness
    user_state = models.CharField(choices=STATE_CHOICE, max_length=100)
    user_address = models.TextField()
    user_profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    user_nid = models.ImageField(upload_to='nid/', null=True, blank=True)
    user_awards = models.CharField(max_length=10, choices=TIER_CHOICES, default='SUPPORTER')
    user_total_donate = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    user_last_donated_at = models.DateTimeField(null=True, blank=True)

    # Authentication fields
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['user_name']  # Fields required for createsuperuser command

    is_active = models.BooleanField(default=True)  # Field to deactivate users
    is_staff = models.BooleanField(default=False)  # Field for admin access
    is_superuser = models.BooleanField(default=False)  # Flag for superuser permissions

    objects = CustomUserManager()  # The custom manager to handle user creation

    def __str__(self):
        return f"{self.email} ({self.user_type})"

#Needs to be used when foreign key is passed    
#user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)