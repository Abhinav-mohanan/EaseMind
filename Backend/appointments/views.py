from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from authentication_app.permissions import IsVerifiedAndUnblock
from authentication_app.models import PsychologistProfile
from .models import PsychologistAvailability
from .serializer import (PsychologistAvailabilitySerializer,PsychologistListSerializer)



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
        



