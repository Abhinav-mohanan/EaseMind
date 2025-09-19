from django.urls import path
from .views import WalletTransactionView,WalletBalanceView


urlpatterns = [
    path('wallet/transactions/',WalletTransactionView.as_view(),name='wallet-transactions'),
    path('wallet/balance/',WalletBalanceView.as_view(),name='wallet-balance'),
]