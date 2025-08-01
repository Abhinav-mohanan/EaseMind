from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from authentication_app.permissions import IsVerifiedAndUnblock,IsUser
from authentication_app.models import PsychologistProfile
from .models import PsychologistAvailability
from .serializer import (PsychologistAvailabilitySerializer,PsychologistListSerializer,
                         PsychologistDetailSerializer,AppointmentWriterSerializer)
from datetime import date,datetime
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
import razorpay



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
            if slot.locked_until and slot.locked_until > timezone.now():
                slot.locked_until = None
                slot.save()
            if slot.locked_until:
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
        today = datetime.today().date()
        try:
            psychologist = PsychologistProfile.objects.get(id=psychologist_id,user__role='psychologist')
            slots = PsychologistAvailability.objects.filter(psychologist=psychologist,is_booked=False,
                                                            date__gte=today).order_by('date','start_time')
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
            slot = PsychologistAvailability.objects.get(id=slot_id)
            if not slot.is_booked:
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
            if serializer.is_valid():
                serializer.save()
                return Response({'message':"Payment completed.slot booked successfully"},status=status.HTTP_200_OK)
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({"error":"Payment verification failed"},status=status.HTTP_400_BAD_REQUEST)