from rest_framework import serializers
from donation.models import Donation,Funds,FundTransaction

class DonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = ['donation_amount', 'donation_cause', 'donor_name', 'donor_remarks']


class FundsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Funds
        fields = "__all__"

class FundTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FundTransaction
        fields = "__all__"