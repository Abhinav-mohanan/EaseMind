from django.urls import path
from .views import WalletTransactionView


urlpatterns = [
    path('wallet/transactions/',WalletTransactionView.as_view(),name='wallet-transactions')
]