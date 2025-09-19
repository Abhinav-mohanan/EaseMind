from rest_framework import serializers
from .models import WalletTransaction,Wallet


class WalletTransactionSerializer(serializers.ModelSerializer):
    balance = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()

    class Meta:
        model = WalletTransaction
        fields = ['balance','name','transaction_type','description','amount']
    
    def get_balance(self,obj):
        return obj.wallet.balance
    
    def get_name(self,obj):
        return f'{obj.wallet.user.first_name} {obj.wallet.user.last_name}'


class WalletBalanceSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Wallet
        fields = ['balance','locked_balance']
        read_only_fields = fields