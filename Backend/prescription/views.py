from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from appointments.views import BaseAppointmentView
from appointments.models import Appointment
from appointments.serializer import AppointmentListSerializer
from authentication_app.permissions import IsPsychologist,IsUser
from .models import HealthTracking
from .serializer import (PrescriptionSerializer,PrescriptionCreateUpdateSerializer,
                         HealthTrackingCreateUpdateSerializer,HealthTrackingSerializer)
import logging

# Create your views here.

logger = logging.getLogger(__name__)

class PsychologistCompletedAppointmentsListView(BaseAppointmentView):
    role = 'psychologist'
    status_filter = 'completed'

class UserCompletedAppointmentsListView(BaseAppointmentView):
    role = 'user'
    status_filter = 'completed'

class PsychologistPrescriptionView(APIView):
    permission_classes = [IsPsychologist]

    def get_object(self,appointment_id,user):
        try:
            appointment = Appointment.objects.get(id=appointment_id,psychologist__user=user)
            if appointment.status != 'completed':
                raise ValueError('Prescription operations only allowed for completed appointments.')
            return appointment
        except Appointment.DoesNotExist:
            raise ValueError("Appointment not found")
        except ValueError as e:
            raise ValueError(str(e))
    
    def get(self,request,appointment_id):
        try:
            appointment = self.get_object(appointment_id,request.user)
            prescription = getattr(appointment,'prescription',None)
            if prescription:
                serializer = PrescriptionSerializer(prescription)
                return Response(serializer.data,status=status.HTTP_200_OK)
            appointment_data = AppointmentListSerializer(appointment).data
            return Response({
                'id':None,
                'appointment':appointment_data,
            },status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error":str(e)},status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error":str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self,request,appointment_id):
        user = request.user
        try:
            appointment = self.get_object(appointment_id,user)
            if hasattr(appointment,'prescription'):
                return Response({"error":"Prescription already exists"},status=status.HTTP_400_BAD_REQUEST)
            serializer = PrescriptionCreateUpdateSerializer(data=request.data)
            if serializer.is_valid():
                prescription = serializer.save(appointment=appointment)
                response_serializer = PrescriptionSerializer(prescription)
                return Response(response_serializer.data,status=status.HTTP_201_CREATED)
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        except ValueError as e:
            return Response({"error":str(e)},status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error":str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def patch(self,request,appointment_id):
        user = request.user
        try:
            appointment = self.get_object(appointment_id,user)
            prescription = getattr(appointment,'prescription',None)
            if not prescription:
                return Response({"error":"Prescription does not exist"},status=status.HTTP_400_BAD_REQUEST)
            serializer = PrescriptionCreateUpdateSerializer(prescription,data=request.data,partial=True)
            if serializer.is_valid():
                serializer.save()
                response_serializer = PrescriptionSerializer(prescription)
                return Response(response_serializer.data,status=status.HTTP_200_OK)
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        except ValueError as e:
            return Response({"error":str(e)},status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error":str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class UserPrescriptionView(APIView):
    permission_classes = [IsUser]

    def get(self, request, appointment_id):
        try:
            appointment = Appointment.objects.get(id=appointment_id, user=request.user)
            if appointment.status != 'completed':
                return Response({"error": "Prescription only available for completed appointments."}, status=status.HTTP_400_BAD_REQUEST)
            prescription = getattr(appointment, 'prescription', None)
            if prescription:
                serializer = PrescriptionSerializer(prescription)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response({"error": "No prescription available for this appointment."}, status=status.HTTP_404_NOT_FOUND)
        except Appointment.DoesNotExist:
            return Response({"error": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": "An error occurred while fetching prescription"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserHealthTrackingListCreateView(APIView):
    permission_classes = [IsUser]

    def get(self,request):
        user = request.user
        try:
            entries = HealthTracking.objects.filter(user=user).order_by('-date')
            paginator = PageNumberPagination()
            page = paginator.paginate_queryset(entries,request)
            serializer = HealthTrackingSerializer(page,many=True)
            return paginator.get_paginated_response(serializer.data)
        except Exception as e:
            return Response({"error":"An error occurred while fetching health tracking data"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self,request):
        data = request.data
        user = request.user
        try:
            serializer = HealthTrackingCreateUpdateSerializer(data=data,context={'request':request})
            if serializer.is_valid():
                serializer.save(user=user)
                entries = HealthTracking.objects.filter(user=user).order_by('-date')
                paginator = PageNumberPagination()
                page = paginator.paginate_queryset(entries,request)
                response_serializer = HealthTrackingSerializer(page,many=True)
                return paginator.get_paginated_response(response_serializer.data)
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f'error creating health tracker : {str(e)}')
            return Response({"error":"An error occurred while creating health tracking entry"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class UserHealthTrackingDetailView(APIView):
    permission_classes = [IsUser]

    def get_object(self, user, health_tracking_id):
        try:
            return HealthTracking.objects.get(id=health_tracking_id, user=user)
        except HealthTracking.DoesNotExist:
            raise ValueError("Health tracking entry not found")

    def get(self, request, health_tracking_id):
        try:
            entry = self.get_object(request.user, health_tracking_id)
            serializer = HealthTrackingSerializer(entry)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error fetching health tracking entry: {str(e)}")
            return Response({"error": "An error occurred while fetching health tracking entry"}, 
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request, health_tracking_id):
        try:
            entry = self.get_object(request.user, health_tracking_id)
            serializer = HealthTrackingCreateUpdateSerializer(
                entry,data=request.data, context={'request': request}, partial=True)
            if serializer.is_valid():
                serializer.save()
                response_serializer = HealthTrackingSerializer(entry)
                return Response(response_serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error updating health tracking entry: {str(e)}")
            return Response({"error": "An error occurred while updating health tracking entry"}, 
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class PsychologistHealthTrackingView(APIView):
    def get(self,request,user_id):
        user = request.user
        try:
            if not Appointment.objects.filter(user=user_id,psychologist__user=user,
                                          status__in =['completed','booked']).exists:
                return Response({"error":"No appointment found with this user"},status=status.HTTP_400_BAD_REQUEST)
            entries = HealthTracking.objects.filter(user=user_id,is_shared_with_psychologist=True)
            paginator = PageNumberPagination()
            page = paginator.paginate_queryset(entries,request)
            serializer = HealthTrackingSerializer(page,many=True)
            return paginator.get_paginated_response(serializer.data)
        except Exception as e:
            logger.error(f'Error while listing the health tracker of user for psychologist: {str(e)}')
            return Response({'error':"An error occured while fetching health tracking details"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
