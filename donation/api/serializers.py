from rest_framework import serializers
from donation.models import Donation,Funds,FundTransaction

class DonationSerializer(serializers.ModelSerializer):
    donation_cause_display = serializers.StringRelatedField(source='donation_cause', read_only=True)
    custom_phone = serializers.CharField(write_only=True, required=False, allow_blank=True)
    class Meta:
        model = Donation
        fields = ['donation_amount', 'donation_cause', 'donor_name', 'donor_remarks','donated_at','donation_cause_display','status', 'custom_phone']


class FundsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Funds
        fields = "__all__"

class FundTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FundTransaction
        fields = "__all__"