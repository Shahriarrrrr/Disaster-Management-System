# from django.urls import path,include
# from rest_framework.routers import DefaultRouter
# from .views import InitiateDonation, payment_success, payment_fail, payment_cancel

# # Create a router and register the views
# router = DefaultRouter()
# router.register(r'donate/initiate', InitiateDonation, basename='donate-initiate')

# urlpatterns = [
#     # Include the router-generated paths
#     path('', include(router.urls)),  # Include router-generated paths

#     path('success/', payment_success, name='donate-success'),
#     path('fail/', payment_fail, name='donate-fail'),
#     path('cancel/', payment_cancel, name='donate-cancel'),
# ]

from django.urls import path
from .views import DonationListView, InitiateDonation, payment_success, payment_fail, payment_cancel

urlpatterns = [
    # View all donations (GET request)
    path('donations/', DonationListView.as_view(), name='donation-list'),
    
    # Make a donation (POST request)
    path('donate/initiate/', InitiateDonation.as_view(), name='donate-initiate'),
    # Payment callback URLs
    path('success/', payment_success, name='donate-success'),
    path('fail/', payment_fail, name='donate-fail'),
    path('cancel/', payment_cancel, name='donate-cancel'),
]