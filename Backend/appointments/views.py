from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from authentication_app.permissions import IsVerifiedAndUnblock,IsUser,IsAdmin
from authentication_app.models import PsychologistProfile
from wallet.models import Wallet
from .models import PsychologistAvailability,Appointment,Payment
from .serializer import (PsychologistAvailabilitySerializer,PsychologistListSerializer,AppointmentListSerializer,
                         PsychologistDetailSerializer,AppointmentWriterSerializer,AppointmentSerializer,
                         AppointmentCancelSerializer,AppointmentCompleteSerializer)
from rest_framework import serializers
from datetime import date,datetime
from django.conf import settings
from django.utils import timezone
from django.db import transaction
from datetime import timedelta
from decimal import Decimal
import razorpay
import logging


logger = logging.getLogger(__name__)


class PsychologistAvailabilityView(APIView):
    permission_classes = [IsVerifiedAndUnblock]

    def get(self,request):
        date = request.query_params.get('date')
        is_booked = request.query_params.get('is_booked')
        psychologist = request.user.psychologist_profile
        slots = PsychologistAvailability.objects.filter(psychologist=psychologist).order_by('date')
        if date:
            slots = slots.filter(date=date)
        if is_booked is not None:
            slots = slots.filter(is_booked=is_booked.lower() == 'true')
        paginator = PageNumberPagination()
        page = paginator.paginate_queryset(slots,request)
        serializer = PsychologistAvailabilitySerializer(page,many=True,context={'request':request})
        return paginator.get_paginated_response(serializer.data)
    
    def post(self,request):
        serializer = PsychologistAvailabilitySerializer(data=request.data,context={'request':request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self,request,slot_id):
        psychologist = request.user.psychologist_profile
        try:
            slot = PsychologistAvailability.objects.get(id=slot_id,psychologist=psychologist)
        except PsychologistAvailability.DoesNotExist:
            return Response({"error":"Slot not found"},status=status.HTTP_404_NOT_FOUND)
        
        if slot.is_booked:
            return Response({"error":"Cannot edit a booked slot"},status=status.HTTP_400_BAD_REQUEST)
        serializer = PsychologistAvailabilitySerializer(slot,data=request.data,partial=True,context={'request':request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    

    def delete(self,request,slot_id):
        psychologist = request.user.psychologist_profile
        try:
            slot = PsychologistAvailability.objects.get(id=slot_id,psychologist=psychologist)
            slot.delete()
            return Response({"message":"Slot deleted successfully"},status=status.HTTP_200_OK)
        except PsychologistAvailability.DoesNotExist:
            return Response({"error":"Slot not found"},status=status.HTTP_404_NOT_FOUND)


class PsychologitListView(APIView):
    def get(self,request):
        psychologit = PsychologistProfile.objects.filter(user__role='psychologist',is_verified='verified').select_related('user')
        paginator = PageNumberPagination()
        page = paginator.paginate_queryset(psychologit,request)
        serializer = PsychologistListSerializer(page,many=True)
        return paginator.get_paginated_response(serializer.data)
    

class LockSlotView(APIView):
    def post(self,request):
        slot_id = request.data.get('slot_id')
        try:
            slot = PsychologistAvailability.objects.get(id=slot_id)
            
            if slot.is_booked:
                return Response({"error":"Slot already booked"},status=status.HTTP_400_BAD_REQUEST)
            if slot.locked_until and slot.locked_until >timezone.now():
                return Response({'error':"slot is temporarily locked please try agian after some time"},
                                status=status.HTTP_400_BAD_REQUEST)
            slot.locked_until = timezone.now() + timedelta(minutes=7)
            slot.save()
            return Response({'locked_unitl':slot.locked_until})
        except PsychologistAvailability.DoesNotExist:
            return Response({"error":"Slot not found"},status=status.HTTP_404_NOT_FOUND)
        

class PsychologistDetailsView(APIView):
    permission_classes = [IsUser]
    def get(self,request,psychologist_id):
        date_filter = request.query_params.get('date_filter')
        custom_date = request.query_params.get('custom_date')
        today = datetime.today().date()
        tomorrow = today + timedelta(days=1)
        try:
            psychologist = PsychologistProfile.objects.get(id=psychologist_id,user__role='psychologist')
            slots_qs = PsychologistAvailability.objects.filter(psychologist=psychologist,is_booked=False)
            date_filters = {
                'today':{'date':today},
                'tomorrow':{'date':tomorrow},
                'all':{'date__gte':today},
                'custom':{'date':custom_date if custom_date else {'date__gte':today}}
            }
            slots = slots_qs.filter(**date_filters.get(date_filter,{'date__gte':today}))
            serializer = PsychologistDetailSerializer({'psychologist':psychologist,'slots':slots})
            return Response(serializer.data)
        except PsychologistProfile.DoesNotExist:
            return Response({"error":"Psychologist not found"},status=status.HTTP_404_NOT_FOUND)


client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID,settings.RAZORPAY_KEY_SECRET))
class CreateOrderView(APIView):
    def post(self,request):
        amount = request.data.get('amount')
        razorpay_order = client.order.create({
            "amount":int(amount),
            "currency":"INR",
            "payment_capture":1
        })
        user = request.user
        name = f'{user.first_name} {user.last_name}'
        phone_number = user.phone_number
        email =user.email
        return Response(
            {
                'order_id':razorpay_order['id'],
                'razorpay_key':settings.RAZORPAY_KEY_ID,
                'amount':amount,
                'name':name,
                'phone_number':phone_number,
                'email':email,
            }
        )


class BookSlotView(APIView):
    def post(self,request):
        payment_id = request.data.get('razorpay_payment_id')
        order_id = request.data.get('razorpay_order_id')
        signature = request.data.get('razorpay_signature')
        slot_id = request.data.get('slot_id')

        params_dict = {
            'razorpay_order_id':order_id,
            'razorpay_payment_id':payment_id,
            'razorpay_signature':signature
        }
        try:
            client.utility.verify_payment_signature(params_dict)
            with transaction.atomic():
                slot = PsychologistAvailability.objects.get(id=slot_id)
                if slot.is_booked:
                    return Response({"error":"Slot is booked"},status=status.HTTP_400_BAD_REQUEST)
                slot.is_booked = True
                slot.locked_until = None
                slot.save()

                appointment_data = {
                    'user':request.user.id,
                    'psychologist':slot.psychologist.id,
                    'availability':slot.id,
                    'status':'booked'
                }
                serializer = AppointmentWriterSerializer(data=appointment_data)
                serializer.is_valid(raise_exception=True)
                appointment = serializer.save()

                total_amount = slot.payment_amount
                admin_commission = total_amount * Decimal('0.20')
                psychologist_amount = total_amount - admin_commission

                Payment.objects.create(
                    appointment=appointment,
                    razorpay_order_id=order_id,
                    razorpay_payment_id=payment_id,
                    amount=total_amount,
                    commission_amount=admin_commission,
                    psychologist_share=psychologist_amount,
                    status = 'success'
                )
                admin_wallet,_ = Wallet.objects.get_or_create(is_admin_wallet=True)
                admin_wallet.credit_locked(amount=admin_commission,
                                    description=f'Locked amount {admin_commission} for appointment: {appointment.id}',
                                    appointment=appointment)
                psychologist_user = appointment.psychologist.user
                psychologist_wallet,_ = Wallet.objects.get_or_create(user=psychologist_user)
                psychologist_wallet.credit_locked(
                    amount=psychologist_amount,
                    description=f'Locked amount {psychologist_amount} for Appointment :{appointment.id}',
                    appointment=appointment
                )
                return Response({'message':"Payment completed.slot booked successfully"},status=status.HTTP_200_OK)
                
        except razorpay.errors.SignatureVerificationError as e:
            return Response({"error":"Payment verification failed",},status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f'error occure when book the slot:{str(e)}')
            return Response({"error":"An error occured please try again after some time"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class BaseAppointmentView(APIView):
    role = None
    status_filter = None
    def get(self,request):
        user = request.user
        status_filter = self.status_filter or request.query_params.get('status','booked')
        if self.role == 'psychologist':
            appointments = Appointment.objects.filter(psychologist__user=user).select_related(
                'user','psychologist__user','availability'
            ).order_by('-availability__date')
        elif self.role == 'admin':
            appointments = Appointment.objects.all().order_by('-availability__date')
        else:
            appointments = Appointment.objects.filter(user=user).select_related(
                'user','psychologist__user','availability'
            ).order_by('-availability__date')
        if status_filter:
            appointments = appointments.filter(status=status_filter)
        paginator = PageNumberPagination()
        page = paginator.paginate_queryset(appointments,request)
        serializer = AppointmentListSerializer(page,many=True)
        return paginator.get_paginated_response(serializer.data)



class PsychologitAppointmentView(BaseAppointmentView):
    permission_classes = [IsVerifiedAndUnblock]
    role = 'psychologist'



class UserAppointmentView(BaseAppointmentView):
    permission_classes = [IsUser]
    role = 'user'

class AdminAppointmentView(BaseAppointmentView):
    permission_classes = [IsAdmin]
    role = 'admin'


class BaseAppointmentDetailView(APIView):
    role = None
    def get(self,request,appointment_id):
        user = request.user
        try:
            if self.role == 'user':
                appointment = Appointment.objects.select_related(
                    'user','psychologist__user','availability').get(id=appointment_id,user=user)
            else:
                appointment = Appointment.objects.select_related(
                    'user','psychologist__user','availability').get(id=appointment_id,psychologist__user=user)
            serializer = AppointmentSerializer(appointment)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except Appointment.DoesNotExist:
            return Response({"error":"Appointment Not found"},status=status.HTTP_404_NOT_FOUND)
    
    def patch(self,request,appointment_id):
        action = request.data.get('action')
        if action == 'cancel':
            serializer = AppointmentCancelSerializer(
                data = request.data,
                context={'request':request,'role':self.role,'appointment_id':appointment_id}
            )

            if not serializer.is_valid():
                return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
            
            try:
                appointment = serializer.cancel_appointment()
                response_serializer = AppointmentSerializer(appointment)
                return Response({"message":"Appointment cancelled successfully",'appointment':response_serializer.data},
                                status=status.HTTP_200_OK)
            except Exception as e:
                logger.error(f"failed to cancel the appointment reasong {str(e)}")
                return Response({"error":"An error occurred while canceling the appointment"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        elif action == 'complete':
            serializer = AppointmentCompleteSerializer(
                data = request.data,
                context ={'request':request,'appointment_id':appointment_id}
            )
            if not serializer.is_valid():
                return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
            try:
                appointment = serializer.complete_appointment()
                response_serializer = AppointmentSerializer(appointment)
                return Response({"message":"Appointment completed successfully",'appointment':response_serializer.data},
                                status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"error":"An error occured while complete the appointment"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)   
        return Response({"error":"Invalid action use cancel or complete"},status=status.HTTP_400_BAD_REQUEST)                             


class UserAppointmentDetails(BaseAppointmentDetailView):
    permission_classes = [IsUser]
    role = 'user'


class PsychologistAppointmentDetails(BaseAppointmentDetailView):
    permission_classes = [IsVerifiedAndUnblock]
    role = 'psychologist'