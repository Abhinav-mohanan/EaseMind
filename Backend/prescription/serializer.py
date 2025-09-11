from rest_framework import serializers
from .models import Prescription
from appointments.serializer import AppointmentListSerializer
from datetime import date

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


    