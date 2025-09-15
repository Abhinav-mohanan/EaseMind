from rest_framework import serializers
from .models import Prescription,HealthTracking
from appointments.serializer import AppointmentListSerializer
from datetime import date,datetime


class PrescriptionCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = ['diagnosis','medicines','advice','follow_up_date','severity_level']

    def validate_follow_up_date(self,value):
        if value and value < date.today():
            raise serializers.ValidationError("Follow-up date cannot be in the past")
        return value

class PrescriptionSerializer(serializers.ModelSerializer):
    appointment = AppointmentListSerializer(read_only=True)

    class Meta:
        model = Prescription
        fields = ['id', 'appointment', 'diagnosis', 'medicines', 'advice', 'follow_up_date',
                  'severity_level', 'created_at',]
        read_only_fields= fields


class HealthTrackingSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    class Meta:
        model = HealthTracking
        fields = ['id','user','user_name','date','stress_level','emotionalstate','exercise',
                  'journaling','meditation','notes','sleep_hours','is_shared_with_psychologist']
        read_only_fields = ['id','user','user_name','date']

    def get_user_name(self,obj):
        return obj.user.get_full_name()


class HealthTrackingCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthTracking
        fields = ['stress_level','emotionalstate','exercise','journaling',
                  'meditation','notes','sleep_hours','is_shared_with_psychologist']
        
    def validate_stress_level(self,value):
        if not(0 <= value <= 10):
            raise serializers.ValidationError('Stress level must be between 0 and 10.')
        return value
        
    def validate_sleep_hours(self,value):
        if value is not None and value < 0:
            raise serializers.ValidationError('Sleep hours cannot be negative.')
        return value
        
    def validate_date(self,value):
        if value != date.today():
            raise serializers.ValidationError("Only track todys health")
        return value
        
    def validate(self,data):
        user = self.context['request'].user
        date = datetime.today()
        if not self.instance and HealthTracking.objects.filter(user=user, date=date).exists():
            raise serializers.ValidationError("Health tracking entry for today already exists") 
        return data
    
    