from django.contrib import admin
from django.urls import path,include
from django.conf.urls.static import static
from django.conf import settings
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('account/api/', include('accounts.api.urls')),
    path('api/', include('campaign.api.urls')),
    path('donation/api/', include('donation.api.urls')),
    path('volunteer/api/', include('volunteer.api.urls')),
    path('program/api/', include('program.api.urls')),
    path('shelter/api/', include('shelter.api.urls')),
    path('aid/api/', include('aid.api.urls')),
    path('emergency/api/', include('emergencyRequest.api.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
