from django.urls import path, include
from rest_framework_nested.routers import DefaultRouter, NestedDefaultRouter
from .views import CampaignViewSet, CampaignUpdateViewSet, CampaignCommentViewSet

# Primary router for Campaign
router = DefaultRouter()
router.register(r'campaigns', CampaignViewSet, basename='campaign')

# Nested routers for updates and comments under campaigns
campaign_nested_router = NestedDefaultRouter(router, r'campaigns', lookup='campaign')
campaign_nested_router.register(r'updates', CampaignUpdateViewSet, basename='campaign-updates')
campaign_nested_router.register(r'comments', CampaignCommentViewSet, basename='campaign-comments')

# Final URL patterns
urlpatterns = [
    path('', include(router.urls)),
    path('', include(campaign_nested_router.urls)),
]
