from django.contrib import admin
from django.urls import path,include
from django.conf.urls.static import static
from django.conf import settings
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView


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
    path('ticket/api/', include('ticket.api.urls')),
    path('heatmap/api/', include('heatmap.api.urls')),
    path('mission/api/', include('mission.api.urls')),
    path('workshop/api/', include('workshop.api.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    # Optional UI:
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
