from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from .models import WalletTransaction,Wallet
from .serializer import WalletTransactionSerializer,WalletBalanceSerializer
# Create your views here.


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

