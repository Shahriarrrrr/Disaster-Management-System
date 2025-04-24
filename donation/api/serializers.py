from rest_framework import serializers
from donation.models import Donation

class DonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = ['donation_amount', 'donation_cause', 'donor_name', 'donor_remarks']