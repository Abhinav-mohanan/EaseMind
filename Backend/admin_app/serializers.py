from rest_framework import serializers
from wallet.models import WalletTransaction
from authentication_app.models import CustomUser

class AdminUsersSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    class Meta:
        model = CustomUser
        fields = ['id','name','email','phone_number','is_blocked']
    
    def get_name(self,obj):
        return obj.get_full_name()    


class RevenueTransactionSerializer(serializers.ModelSerializer):
    appointment_date = serializers.SerializerMethodField()
    appointment_time = serializers.SerializerMethodField()
    appointment_amount = serializers.SerializerMethodField()
    client = serializers.SerializerMethodField()
    psychologist = serializers.SerializerMethodField()

    class Meta:
        model = WalletTransaction
        fields = [
            'id',
            'amount',                
            'appointment_amount',     
            'created_at',
            'appointment_date',
            'appointment_time',
            'client',
            'psychologist',
        ]

    def get_appointment_date(self, obj):
        if obj.appointment:
            return obj.appointment.availability.date
        return None

    def get_appointment_time(self, obj):
        if obj.appointment:
            a = obj.appointment.availability
            start = a.start_time.strftime('%I:%M %P')
            end = a.end_time.strftime('%I:%M %P')
            return f"{start} :- {end}"
        return None

    def get_appointment_amount(self, obj):
        if obj.appointment and hasattr(obj.appointment, 'payment'):
            payment = obj.appointment.payment.first()
            return payment.amount if payment else None
        return None

    def get_client(self, obj):
        if obj.appointment:
            return obj.appointment.user.get_full_name()
        return None

    def get_psychologist(self, obj):
        if obj.appointment:
            return obj.appointment.psychologist.user.get_full_name()
        return None
