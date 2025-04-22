from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser
from .forms import CustomUserCreationForm, CustomUserChangeForm

class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser

    list_display = ('email', 'user_name', 'user_type', 'user_state', 'is_staff', 'is_active')
    list_filter = ('user_type', 'user_state', 'is_staff', 'is_active')
    search_fields = ('email', 'user_name', 'user_phone')
    ordering = ('email',)

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {
            'fields': (
                'user_name', 'user_gender', 'user_age', 'user_phone',
                'user_state', 'user_address', 'user_type','user_profile_image','user_nid'
            )
        }),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email', 'password1', 'password2',
                'user_name', 'user_gender', 'user_age', 'user_phone',
                'user_state', 'user_address', 'user_type','user_profile_image','user_nid',
                'is_active', 'is_staff'
            ),
        }),
    )

admin.site.register(CustomUser, CustomUserAdmin)
