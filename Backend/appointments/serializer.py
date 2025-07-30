from rest_framework import serializers
from datetime import datetime,timedelta
from .models import PsychologistAvailability


class PsychologistAvailabilitySerializer(serializers.ModelSerializer):
    end_time = serializers.SerializerMethodField()

    class Meta:
        model = PsychologistAvailability
        fields = ['id','psychologist','date','start_time','end_time','payment_amount','is_booked']
        read_only_fields = ['psychologist','end_time','is_booked']

    def get_end_time(self,obj):
        return obj.get_end_time()
    
    def validate(self, data):
        instance = getattr(self,'instance')
        start_time = data.get('start_time') or (instance.start_time if instance else None)
        date = data.get('date') or (instance.date if instance else None)
        start_datetime = datetime.combine(date,start_time)
        end_time = (start_datetime + timedelta(minutes=30)).time()
        request = self.context.get('request')
        psychologist = request.user.psychologist_profile

        overlapping_slots = PsychologistAvailability.objects.filter(
            psychologist=psychologist,
            date=date,
            start_time__lt=end_time,
            end_time__gt=start_time
        )
        if instance:
            overlapping_slots = overlapping_slots.exclude(id=instance.id)

        if overlapping_slots.exists():
            raise serializers.ValidationError("This time slot overlaps with an existing slot")

        return data
    
    def create(self, validated_data):
        request = self.context.get('request')
        psychologist = request.user.psychologist_profile
        return  PsychologistAvailability.objects.create(psychologist=psychologist,**validated_data)
    