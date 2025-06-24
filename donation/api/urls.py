from django.urls import path
from . import views

urlpatterns = [
    # URLs for donations
    path('donation/', views.DonationListView.as_view(), name='donation-list'),
    path('donation/initiate/', views.InitiateDonation.as_view(), name='initiate-donation'),
    
    # URLs for funds and transactions
    path('funds/', views.FundsView.as_view(), name='funds-list'),
    path('fund-transactions/', views.FundTransactionView.as_view(), name='fund-transaction-list'),
    
    # SSLCommerz payment response URLs
    path('payment/success/', views.payment_success, name='payment-success'),
    path('payment/fail/', views.payment_fail, name='payment-fail'),
    path('payment/cancel/', views.payment_cancel, name='payment-cancel'),

    # Public donor profile (lightweight, public-safe)
    path('public-donors/<int:pk>/', views.PublicDonorProfileView.as_view(), name='public-donor-profile'),
]
