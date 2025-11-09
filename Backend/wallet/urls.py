from django.urls import path
from .views import WalletTransactionView,WalletBalanceView,PayoutView,PendingPayoutView


urlpatterns = [
    path('wallet/transactions/',WalletTransactionView.as_view(),name='wallet-transactions'),
    path('wallet/balance/',WalletBalanceView.as_view(),name='wallet-balance'),
    path('wallet/payout/',PayoutView.as_view(),name='payout'),
    path('pending/payout/',PendingPayoutView.as_view(),name='pending-payout'),
]