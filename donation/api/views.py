import requests
from django.db import transaction
import logging
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from donation.models import Donation,Funds,FundTransaction
from accounts.models import CustomUser
from .serializers import DonationSerializer, FundsSerializer, FundTransactionSerializer
import uuid
from django.http import HttpResponse
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404

class FundsView(generics.ListAPIView):
    queryset = Funds.objects.all()
    serializer_class = FundsSerializer

class FundTransactionView(generics.ListAPIView):
    serializer_class = FundTransactionSerializer

    def get_queryset(self):
        fund_id = self.request.query_params.get('fund_id')
        queryset = FundTransaction.objects.all()
        if fund_id:
            queryset = queryset.filter(fund__id=fund_id)
        return queryset


class DonationListView(generics.ListAPIView):
    serializer_class = DonationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Donation.objects.filter(donor = self.request.user)



logger = logging.getLogger(__name__)
class InitiateDonation(APIView):
    def post(self, request):
        serializer = DonationSerializer(data=request.data)
        
        if serializer.is_valid():
            transaction_id = str(uuid.uuid4())  # Generate unique transaction ID
            amount = serializer.validated_data['donation_amount']
            cause = serializer.validated_data['donation_cause']
            donor_remarks = serializer.validated_data.get('donor_remarks', '')
            donor = request.user if request.user.is_authenticated else None
            donor_name = self.get_donor_name(donor, serializer)

            # Create a donation record
            donation = self.create_donation(donor, donor_name, amount, cause, donor_remarks, transaction_id)

            # Prepare payment data for SSLCommerz
            payment_data = self.prepare_payment_data(request, donation, donor)

            # Log and send payment request
            logger.info(f"Sending payment data to SSLCommerz: {payment_data}")
            response = self.send_payment_request(payment_data)

            # Handle response
            return self.handle_payment_response(response, donation)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get_donor_name(self, donor, serializer):
        return (
            donor.get_full_name() or donor.user_name if donor else serializer.validated_data.get('donor_name', 'Anonymous')
        )

    def create_donation(self, donor, donor_name, amount, cause, donor_remarks, transaction_id):
        return Donation.objects.create(
            donor=donor,
            donor_name=donor_name,
            donation_amount=amount,
            donation_cause=cause,
            donor_remarks=donor_remarks,
            transaction_id=transaction_id,
            status="Pending"
        )

    def prepare_payment_data(self, request, donation, donor):
        return {
            'store_id': settings.SSLCOMMERZ_STORE_ID,
            'store_passwd': settings.SSLCOMMERZ_STORE_PASSWD,
            'total_amount': str(donation.donation_amount),
            'currency': 'BDT',
            'tran_id': donation.transaction_id,
            #'success_url': request.build_absolute_uri(f'/donation/api/payment/success/?tran_id={donation.transaction_id}'),
            'success_url': request.build_absolute_uri(f'/donation/api/payment/success/?tran_id={donation.transaction_id}'),
            'fail_url': request.build_absolute_uri('/donation/api/payment/fail/'),
            'cancel_url': request.build_absolute_uri('/donation/api/payment/cancel/'),
            'cus_name': donor.get_full_name() if donor else "Anonymous",
            'cus_email': donor.email if donor else "anonymous@email.com",
            'cus_add1': donor.user_address if donor else "Bangladesh",
            'cus_city': donor.user_state if donor else "Unknown",
            'cus_phone': donor.user_phone if donor else "0100000000",
            'cus_country': 'Bangladesh',
            'shipping_method': 'NO',
            'product_name': donation.donation_cause.title,
            'product_category': 'Donation',
            'product_profile': 'general'
        }

    def send_payment_request(self, payment_data):
        try:
            response = requests.post(
                'https://sandbox.sslcommerz.com/gwprocess/v4/api.php',
                data=payment_data
            )
            return response
        except requests.RequestException as e:
            logger.error(f"Error making payment request: {str(e)}")
            return None

    def handle_payment_response(self, response, donation):
        if response and response.status_code == 200:
            try:
                res_data = response.json()
                if res_data.get('status') == 'SUCCESS':
                    return Response({'payment_url': res_data['GatewayPageURL']})
                else:
                    logger.error(f"Payment initialization failed. Response: {res_data}")
                    return Response({'error': 'Payment initialization failed'}, status=500)
            except Exception as e:
                logger.error(f"Error parsing response: {str(e)}")
                return Response({'error': 'Invalid response from payment gateway'}, status=500)
        else:
            return Response({'error': 'Payment gateway request failed'}, status=500)        
@csrf_exempt
def payment_success(request):
    tran_id = request.GET.get('tran_id')
    
    if not tran_id:
        return HttpResponse("Missing transaction ID", status=400)

    try:
        with transaction.atomic():
            donation = Donation.objects.select_for_update().get(transaction_id=tran_id)

            # Early exit if already processed
            if donation.status == "Success":
                return HttpResponse(f"Payment already processed for transaction ID: {tran_id}")

            # Now continue with marking as success and applying updates
            donation.status = "Success"
            donation.save()

            user = donation.donor
            if user:
                user.user_total_donate += donation.donation_amount
                user.user_last_donated_at = timezone.now()
                user.save()

            fund, _ = Funds.objects.select_for_update().get_or_create(
                fund_cause=donation.donation_cause
            )

            fund.total_amount += donation.donation_amount
            fund.save()

            # Ensure no duplicate FundTransaction
            if not FundTransaction.objects.filter(
                amount=donation.donation_amount,
                fund=fund,
                description=f"Donation for {donation.donation_cause.title}",
            ).exists():
                FundTransaction.objects.create(
                    transaction_type='donation',
                    amount=donation.donation_amount,
                    fund=fund,
                    description=f"Donation for {donation.donation_cause.title}",
                )

        return HttpResponse(f"Payment Success! Transaction ID: {tran_id}")

    except Donation.DoesNotExist:
        return HttpResponse(f"Donation with transaction ID {tran_id} not found", status=404)

    except Exception as e:
        print(f"Error processing payment: {e}")
        return HttpResponse("An error occurred while processing your payment", status=500)

@csrf_exempt
def payment_fail(request):
    tran_id = request.GET.get('tran_id')

    if not tran_id:
        return HttpResponse("Missing transaction ID", status=400)

    try:
        # Start a transaction block
        with transaction.atomic():
            donation = Donation.objects.select_for_update().get(transaction_id=tran_id)

            # Early exit if the donation status is already "Failed"
            if donation.status == "Failed":
                return HttpResponse(f"Payment already marked as failed for transaction ID: {tran_id}")

            # Mark the donation status as "Failed"
            donation.status = "Failed"
            donation.save()

            # Optionally, you can also perform some rollback logic if needed.
            # For example, refund the user, update any related fund transactions, etc.

            return HttpResponse(f"Payment Failed. Transaction ID: {tran_id}")

    except Donation.DoesNotExist:
        return HttpResponse(f"Donation with transaction ID {tran_id} not found", status=404)

    except Exception as e:
        print(f"Error processing payment failure: {e}")
        return HttpResponse("An error occurred while processing your payment", status=500)

@csrf_exempt
def payment_cancel(request):
    tran_id = request.GET.get('tran_id')

    if not tran_id:
        return HttpResponse("Missing transaction ID", status=400)

    try:
        # Start a transaction block
        with transaction.atomic():
            donation = Donation.objects.select_for_update().get(transaction_id=tran_id)

            # Early exit if the donation status is already "Cancelled"
            if donation.status == "Cancelled":
                return HttpResponse(f"Payment already cancelled for transaction ID: {tran_id}")

            # Mark the donation status as "Cancelled"
            donation.status = "Cancelled"
            donation.save()

            # Optionally, you can perform rollback actions here too.
            # For example, refunding the user or updating any related fund transactions.

            return HttpResponse(f"Payment Cancelled. Transaction ID: {tran_id}")

    except Donation.DoesNotExist:
        return HttpResponse(f"Donation with transaction ID {tran_id} not found", status=404)

    except Exception as e:
        print(f"Error processing payment cancellation: {e}")
        return HttpResponse("An error occurred while processing your payment", status=500)