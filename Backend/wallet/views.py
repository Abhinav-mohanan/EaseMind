from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from .models import WalletTransaction
from .serializer import WalletTransactionSerializer
# Create your views here.



class WalletTransactionView(APIView):
    def get(self,request):
        transaction_type = request.query_params.get('transaction_type')
        wallettransactions = WalletTransaction.objects.filter().select_related(
            'wallet'
        ).order_by('created_at')
        if transaction_type:
            wallettransactions = wallettransactions.filter(transaction_type=transaction_type)
        paginator = PageNumberPagination()
        page = paginator.paginate_queryset(wallettransactions,request)
        serializer = WalletTransactionSerializer(page,many=True)
        return paginator.get_paginated_response(serializer.data)

