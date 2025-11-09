from rest_framework import serializers
from .models import WalletTransaction,Wallet,Payout
from authentication_app.models import PsychologistProfile


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


class PsychologistDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PsychologistProfile
        fields = ['bank_account_no','ifsc_code']

class WalletBalanceSerializer(serializers.ModelSerializer):
    bank_details = serializers.SerializerMethodField()
    class Meta:
        model = Wallet
        fields = ['balance','locked_balance','bank_details']
        read_only_fields = fields
    
    def get_bank_details(self,obj):
        try:
            profile = obj.user.psychologist_profile
            return PsychologistDetailsSerializer(profile).data
        except PsychologistProfile.DoesNotExist:
            return None
    

class PayoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payout
        fields = ['id','amount','status','requested_at','processed_at','remarks','bank_account_no','ifsc_code']
        read_only_fields = ['status','requested_at','processed_at']
    
    def validate(self,data):
        user = self.context['request'].user
        amount = data.get('amount',0)
        bank_account_no = data.get('bank_account_no')

        if amount <= 0:
            raise serializers.ValidationError("Invalid payout amount")
        if Payout.objects.filter(psychologist=user,status='pending').exists():
            raise serializers.ValidationError("You already have a pending payout request. Please wait for it to be processed.")
        if bank_account_no:
            account = bank_account_no.strip()
            if not account.isdigit():
                raise serializers.ValidationError("Bank account number must contain only digits")
            if not (9 <= len(account) <= 18):
                raise serializers.ValidationError("Please enter a valid account number")
        try:
            wallet = Wallet.objects.get(user=user)
        except Wallet.DoesNotExist:
            raise serializers.ValidationError("wallet not found")
        if wallet.balance < amount:
            raise serializers.ValidationError("Insufficient balance")
        return data
    
    def create(self, validated_data):
        user = self.context['request'].user
        return Payout.objects.create(psychologist=user,**validated_data)
