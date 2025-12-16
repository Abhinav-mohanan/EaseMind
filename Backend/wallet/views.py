from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from .models import WalletTransaction,Wallet,Payout
from .serializer import WalletTransactionSerializer,WalletBalanceSerializer,PayoutSerializer
from authentication_app.permissions import IsVerifiedAndUnblock,IsAdmin
from authentication_app.models import CustomUser
from notification.utils import create_notification
from django.db import transaction
from django.utils import timezone
import logging
# Create your views here.

logger = logging.getLogger(__name__)

class WalletBalanceView(APIView):
    def get(self,request):
        user = request.user
        wallet,_ = Wallet.objects.get_or_create(user=user)
        serializer = WalletBalanceSerializer(wallet)
        return Response(serializer.data,status=status.HTTP_200_OK)


class WalletTransactionView(APIView):
    def get(self,request):
        user = request.user
        transaction_type = request.query_params.get('transaction_type')
        wallettransactions = (WalletTransaction.objects.filter(wallet__user=user).select_related(
            'wallet',
        ).order_by('-created_at'))
        if transaction_type:
            wallettransactions = wallettransactions.filter(transaction_type=transaction_type)
        paginator = PageNumberPagination()
        page = paginator.paginate_queryset(wallettransactions,request)
        serializer = WalletTransactionSerializer(page,many=True)
        return paginator.get_paginated_response(serializer.data)


class PayoutView(APIView):
    permission_classes = [IsVerifiedAndUnblock]
    def post(self,request):
        serializer = PayoutSerializer(data=request.data,context={'request':request})
        if serializer.is_valid():
            serializer.save()
            admin_user = CustomUser.objects.filter(is_superuser=True).first()
            create_notification(
                user=admin_user,
                message=f'You have a new payout request by {request.user.get_full_name()}'
            )
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class PendingPayoutView(APIView):
    def get(self,request):
        user = request.user
        pending = Payout.objects.filter(psychologist=user,status='pending').exists()
        return Response({'has_pending':pending},status=status.HTTP_200_OK)

class AllPendingPayoutView(APIView):
    permission_classes = [IsAdmin]

    def get(self,request):
        status_filter = request.query_params.get('status','pending')
        payouts = Payout.objects.filter(status=status_filter).order_by('requested_at')
        paginator = PageNumberPagination()
        page = paginator.paginate_queryset(payouts,request)
        serializer = PayoutSerializer(page,many=True)
        return paginator.get_paginated_response(serializer.data)
    
    def post(self,request,payout_id):
        try:
            payout = Payout.objects.get(id=payout_id)

            status_choice = request.data.get('status')
            remarks = request.data.get('remarks')

            if status_choice not in ['rejected','approved']:
                return Response({"error":"Invalid status option"},
                                status=status.HTTP_400_BAD_REQUEST)
            
            wallet = payout.psychologist.wallet

            if status_choice == 'approved' and wallet.balance < payout.amount:
                return Response({'error':"Insufficient balance in wallet"},
                                status=status.HTTP_400_BAD_REQUEST)

            with transaction.atomic():                
                payout.status = status_choice
                payout.processed_at = timezone.now()

                if remarks:
                    payout.remarks = remarks
                
                if status_choice == 'approved':
                    tx = wallet.debit(
                        payout.amount,
                        description="Payout approved (Amount credited to your bank account)"
                    )
                    if not tx:
                        return Response({"error":"Unable to debit wallet"},
                                        status=status.HTTP_400_BAD_REQUEST)
                payout.save()

                if status_choice == 'approved':
                    message = (
                        f'Your payout request of ₹{payout.amount} has been approved '
                        f'and will be processed to your bank account shortly.'
                    )
                    notification_type = 'SUCCESS'
                else:
                    rejection_reason = remarks or "No remarks provided"
                    message = (
                        f"Your payout request of ₹{payout.amount} has been rejected. "
                        f"Reason: {rejection_reason}"
                    )
                    notification_type='ERROR'

                create_notification(
                    user=payout.psychologist,
                    message=message,
                    notification_type=notification_type
                )

            return Response({"message":f"Payout {status_choice} successfully"},
                            status=status.HTTP_200_OK)
        except Payout.DoesNotExist:
            return Response({'error':"payout does not exisist"},status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"POST admin payout failed :- {str(e)}")
            return Response({"error":"some error occure try again after some time"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
               
