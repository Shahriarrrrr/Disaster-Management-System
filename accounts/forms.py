from django import forms
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from .models import CustomUser

class CustomUserCreationForm(forms.ModelForm):
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Confirm Password', widget=forms.PasswordInput)

    class Meta:
        model = CustomUser
        fields = ('email', 'user_name', 'user_gender', 'user_age', 'user_phone', 
                  'user_state', 'user_address', 'user_type','user_nid','user_profile_image')  # Add the relevant fields here

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user

class CustomUserChangeForm(forms.ModelForm):
    password = ReadOnlyPasswordHashField(label=("Password"),
        help_text=("Raw passwords are not stored, so there is no way to see "
                   "this user’s password, but you can change the password "
                   "using <a href=\"../password/\">this form</a>.")
    )

    class Meta:
        model = CustomUser
        fields = ('email', 'password', 'user_name', 'user_gender', 'user_age', 
                  'user_phone', 'user_state', 'user_address', 'user_type',
                  'is_active', 'is_staff', 'is_superuser','user_profile_image','user_nid')  # Add the relevant fields here

    def clean_password(self):
        return self.initial["password"]
