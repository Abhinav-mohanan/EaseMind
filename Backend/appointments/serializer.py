from rest_framework import serializers
from datetime import datetime,timedelta
from .models import PsychologistAvailability,Appointment
from authentication_app.models import PsychologistProfile
from django.utils import timezone
from django.db import transaction
from decimal import Decimal
import logging
from wallet.models import Wallet,WalletTransaction
from django.utils.dateformat import format
from appointments.services import cancel_appointment_service


logger = logging.getLogger(__name__)


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
            raise serializers.ValidationError(f"This time slot overlaps with an existing slot on {date}")

        return data
    
    def create(self, validated_data):
        request = self.context.get('request')
        psychologist = request.user.psychologist_profile
        return  PsychologistAvailability.objects.create(psychologist=psychologist,**validated_data)


class PsychologistListSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    profile_pic = serializers.URLField(source='user.profile_picture.url',allow_null=True)

    class Meta:
        model = PsychologistProfile
        fields = ['id','name','specialization','experience_years','profile_pic']
    
    def get_name(self,obj):
        return f'{obj.user.first_name} {obj.user.last_name}'


class SlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = PsychologistAvailability
        fields = ['id','date','start_time','end_time','is_booked','payment_amount','locked_until']


class PsychologistDetailSerializer(serializers.Serializer):
    psychologist = serializers.SerializerMethodField()
    slots = SlotSerializer(many=True)

    def get_psychologist(self,obj):
        psychologist = obj['psychologist']
        user = psychologist.user

        try:
            profile_picture = user.profile_picture.url
        except:
            profile_picture = None
        
        return{
            'name':f'{user.first_name} {user.last_name}',
            'email':user.email,
            'phone_number':user.phone_number,
            'id':psychologist.id,
            'bio':psychologist.bio,
            'education':psychologist.education,
            'license_no':psychologist.license_no,
            'specialization':psychologist.specialization,
            'experience_years':psychologist.experience_years,
            'profile_picture':profile_picture,

        }


class AppointmentWriterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = "__all__"
     
    def create(self, validated_data):
        return Appointment.objects.create(**validated_data)


class AppointmentListSerializer(serializers.ModelSerializer):
    psychologist_name = serializers.SerializerMethodField()
    user_name = serializers.SerializerMethodField()
    payment_amount = serializers.CharField(source='availability.payment_amount',read_only=True)
    slot_date = serializers.DateField(source='availability.date',read_only=True)
    slot_time = serializers.TimeField(source='availability.start_time',read_only=True)
    user_id = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Appointment
        fields = ['id','psychologist_name','user_name','slot_date','payment_amount','slot_time','status','user_id']
    
    def get_psychologist_name(self,obj):
        user = obj.psychologist.user
        return f'{user.first_name} {user.last_name}'
    
    def get_user_name(self,obj):
        return f'{obj.user.first_name} {obj.user.last_name}'
    
    def get_user_id(self,obj):
        return obj.user.id


class AppointmentSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    user_profile_pic = serializers.SerializerMethodField()
    user_email = serializers.EmailField(source='user.email',read_only=True)
    user_phone_number = serializers.CharField(source='user.phone_number',read_only=True)
    psychologist_name = serializers.SerializerMethodField()
    psychologist_profile_pic = serializers.SerializerMethodField()
    psychologist_phone = serializers.CharField(source='psychologist.user.phone_number',read_only=True)
    psychologist_email = serializers.CharField(source='psychologist.user.email',read_only=True)
    specialization = serializers.CharField(source='psychologist.specialization')
    slot_time = serializers.TimeField(source='availability.start_time',read_only=True)
    slot_date = serializers.DateField(source='availability.date',read_only=True)
    payment_amount = serializers.CharField(source='availability.payment_amount',read_only=True)

    class Meta:
        model = Appointment
        fields = ['id','psychologist_name','user_name','slot_date','slot_time','payment_amount',
                  'specialization','user_email','user_phone_number','status','psychologist_profile_pic',
                  'user_profile_pic','psychologist_phone','psychologist_email']
    
    def get_psychologist_name(self,obj):
        user = obj.psychologist.user
        return f'{user.first_name} {user.last_name}'
    
    def get_user_name(self,obj):
        return f'{obj.user.first_name} {obj.user.last_name}'
    
    def get_psychologist_profile_pic(self,obj):
        user = obj.psychologist.user
        return user.profile_picture.url if user.profile_picture else None
           
    def get_user_profile_pic(self,obj):    
        return obj.user.profile_picture.url if obj.user.profile_picture else None
        

class AppointmentCancelSerializer(serializers.Serializer):
    description = serializers.CharField(max_length=255,required=True)

    def validate(self, data):
        request = self.context['request']
        user = request.user
        role = self.context['role']
        appointment_id = self.context['appointment_id']
        now = timezone.now() 

        try:
            if role == 'user':
                self.appointment = Appointment.objects.select_related(
                    'availability','user').get(id=appointment_id,user=user)
            else:
                self.appointment = Appointment.objects.select_related(
                    'availability','psychologist').get(id=appointment_id,psychologist__user=user)
        except Appointment.DoesNotExist:
            raise serializers.ValidationError("Appointment not found")
        
        if self.appointment.status != 'booked':
            raise serializers.ValidationError("Cannot cancel this appointment")
        
        appointment_datetime = timezone.make_aware(
            datetime.combine(self.appointment.availability.date, self.appointment.availability.start_time)
        )

        if appointment_datetime < now:
            raise serializers.ValidationError("Cannot cancel past appointment")
        
        return data
    
    
    def cancel_appointment(self):
        try:
            return cancel_appointment_service(
                appointment=self.appointment,
                cancelled_by=self.context['role'],
                description=self.validated_data['description'],
                requested_user=self.context['request'].user,
                force_refund=False
            )
        except Exception as e:
            logger.error(f'error cancelled appointment {self.appointment.id} description:{str(e)}')
            raise serializers.ValidationError("An error occur while cancelling the appointment")
        

class AppointmentCompleteSerializer(serializers.Serializer):
    def validate(self, data):
        appointment_id = self.context.get('appointment_id')
        request = self.context.get('request')
        user = request.user
        now = timezone.now()
        try:
            self.appointment = Appointment.objects.select_related(''
            'availability','psychologist').get(id=appointment_id,psychologist__user=user)
            if self.appointment.status != 'booked':
                raise serializers.ValidationError("Only booked appointments can be marked as completed")
            appointment_datetime = timezone.make_aware(
                datetime.combine(self.appointment.availability.date,self.appointment.availability.end_time)
            )
            # if now < appointment_datetime:
            #     raise serializers.ValidationError("Only mark complete after the end time")
        except Appointment.DoesNotExist:
            raise serializers.ValidationError("Appointment does not exist")
        return data
    
    def complete_appointment(self):
        try:
            with transaction.atomic():
                self.appointment.status = 'completed'
                self.appointment.save()
                
                transactions = WalletTransaction.objects.filter(appointment=self.appointment,
                                                            transaction_type='credit',status='pending')
                for txn in transactions:
                    wallet = txn.wallet
                    wallet.release_locked(txn.amount,txn)
            return self.appointment
        except Exception as e:
            logger.error(f"error at appointment cancelation:{str(e)}")
            raise serializers.ValidationError("An error occurred while completing the appointment")
        
