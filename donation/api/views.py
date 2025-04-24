import requests
import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from donation.models import Donation
from .serializers import DonationSerializer
import uuid
from django.http import HttpResponse
from rest_framework import generics
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404

class DonationListView(generics.ListAPIView):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
logger = logging.getLogger(__name__)
class InitiateDonation(APIView):
    def post(self, request):
        # Serialize the data from the request
        serializer = DonationSerializer(data=request.data)
        
        if serializer.is_valid():
            transaction_id = str(uuid.uuid4())  # Generate unique transaction ID
            amount = serializer.validated_data['donation_amount']
            cause = serializer.validated_data['donation_cause']
            donor_remarks = serializer.validated_data.get('donor_remarks', '')
            #donor_name = serializer.validated_data.get('donor_name', 'Anonymous')

            donor = request.user if request.user.is_authenticated else None
            donor_name = (
                donor.get_full_name() or donor.user_name
                if donor
                else serializer.validated_data.get('donor_name', 'Anonymous')
            )

            # Create a donation record
            donation = Donation.objects.create(
                donor=donor,
                donor_name=donor_name,
                donation_amount=amount,
                donation_cause=cause,
                donor_remarks=donor_remarks,
                transaction_id=transaction_id,
                status="Pending"
            )
            # Extract donor information
            donor = donation.donor
            donor_name = donor.get_full_name() if donor else donation.donor_name or "Anonymous"
            print(f"This is donor_name{donor_name}")
            print(f"This is donor.user_name{donor.user_name}")
            
            # Payment data for SSLCommerz
            payment_data = {
                'store_id': settings.SSLCOMMERZ_STORE_ID,
                'store_passwd': settings.SSLCOMMERZ_STORE_PASSWD,
                'total_amount': str(donation.donation_amount),  # Convert amount to string
                'currency': 'BDT',
                'tran_id': donation.transaction_id,
                'success_url': request.build_absolute_uri(f'/donation/api/success/?tran_id={transaction_id}'),
                'fail_url': request.build_absolute_uri('/donation/api/fail/'),
                'cancel_url': request.build_absolute_uri('/donation/api/cancel/'),
                'cus_name': donor_name,
                'cus_email': donor.email if donor else "anonymous@email.com",
                'cus_add1': donor.user_address if donor else "Bangladesh",
                'cus_city': donor.user_state if donor else "Unknown",
                'cus_phone': donor.user_phone if donor else "0100000000",
                'cus_country':'Bangladesh',
                'shipping_method': 'NO',
                'product_name': cause.title,
                'product_category': 'Donation',
                'product_profile': 'general'
            }
            
            # Log the payment data
            logger.info(f"Sending payment data to SSLCommerz: {payment_data}")

            # Make the request to SSLCommerz
            response = requests.post(
                'https://sandbox.sslcommerz.com/gwprocess/v4/api.php',
                data=payment_data
            )

            # Log the response from SSLCommerz
            logger.info(f"Response from SSLCommerz: {response.text}")
            
            try:
                res_data = response.json()  # Parse JSON response
                if res_data.get('status') == 'SUCCESS':
                    # Redirect to the payment page if successful
                    print(f'Here is the status : {donation.status}')
                    return Response({'payment_url': res_data['GatewayPageURL']})
                else:
                    # If status is not success, log the error and return a failure response
                    logger.error(f"Payment initialization failed. Response: {res_data}")
                    return Response({'error': 'Payment initialization failed'}, status=500)
            except Exception as e:
                # Log any error in parsing the response
                logger.error(f"Error parsing response: {str(e)}")
                return Response({'error': 'Invalid response from payment gateway'}, status=500)
        
        # If the serializer is not valid, return the errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt    
def payment_success(request):
    tran_id = request.GET.get('tran_id')
    print(tran_id)
    if not tran_id:
        return HttpResponse("Missing transaction ID", status=400)

    donation = get_object_or_404(Donation, transaction_id=tran_id)
    donation.status = "Success"
    donation.save()
    
    return HttpResponse(f"Payment Success! Transaction ID: {tran_id}")
@csrf_exempt
def payment_fail(request):
    tran_id = request.GET.get('tran_id')
    donation = get_object_or_404(Donation, transaction_id=tran_id)
    donation.status = "Failed"
    print(donation.status)
    donation.save()
    return HttpResponse("Payment Failed.")

@csrf_exempt
def payment_cancel(request):
    tran_id = request.GET.get('tran_id')
    donation = get_object_or_404(Donation, transaction_id=tran_id)
    donation.status = "Cancelled"
    donation.save()
    return HttpResponse("Payment Cancelled.")