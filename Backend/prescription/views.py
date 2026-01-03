from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import NotFound, ValidationError
from appointments.views import BaseAppointmentView
from appointments.models import Appointment
from appointments.serializer import AppointmentListSerializer
from authentication_app.permissions import IsVerifiedAndUnblock,IsUser
from .models import HealthTracking
from .serializer import (PrescriptionSerializer,PrescriptionCreateUpdateSerializer,
                         HealthTrackingCreateUpdateSerializer,HealthTrackingSerializer)
from notification.utils import create_notification
from django.template.loader import render_to_string
from django.http import HttpResponse
from django.db import transaction
from xhtml2pdf import pisa
from io import BytesIO
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
    permission_classes = [IsVerifiedAndUnblock]

    def get_object(self,appointment_id,user):
        appointment = Appointment.objects.filter(
            id=appointment_id,
            psychologist__user=user
        ).first()

        if not appointment:
            raise NotFound("Appointment not found")
        if appointment.status !='completed':
            raise ValidationError("Prescription operations allowed only for completed appointments.")
        return appointment
    

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
        except Exception as e:
            logger.error(f"GET Prescription failed :{str(e)}")
            return Response({"error":str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self,request,appointment_id):
        user = request.user
        try:
            appointment = self.get_object(appointment_id,user)
            if hasattr(appointment,'prescription'):
                return Response({"error":"Prescription already exists"},
                                status=status.HTTP_400_BAD_REQUEST)
            serializer = PrescriptionCreateUpdateSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            with transaction.atomic():
                prescription = serializer.save(appointment=appointment)
            create_notification(
                user=appointment.user,
                message=f"Your Prescription for the appointment on {appointment.availability.date} is now availabe."
            )
            response_serializer = PrescriptionSerializer(prescription)
            return Response(response_serializer.data,status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"POST prescription failed: {str(e)}")
            return Response({"error":str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def patch(self,request,appointment_id):
        user = request.user
        try:
            appointment = self.get_object(appointment_id,user)
            prescription = getattr(appointment,'prescription',None)
            if not prescription:
                return Response({"error":"Prescription does not exist"},
                                status=status.HTTP_400_BAD_REQUEST)
            serializer = PrescriptionCreateUpdateSerializer(
                prescription,
                data=request.data,
                partial=True)
            serializer.is_valid(raise_exception=True)
            with transaction.atomic():
                serializer.save()

            create_notification(
                user=appointment.user,
                message=f"Your prescription for the appointment on {appointment.availability.date} has been updated."
            )
            
            response_serializer = PrescriptionSerializer(prescription)
            return Response(response_serializer.data,status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f'PATCH prescription failed:-{str(e)}')
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
            return Response({"message": "No prescription available for this appointment.",'type':'info'}, status=status.HTTP_200_OK)
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
    permission_classes = [IsVerifiedAndUnblock]
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
                

class DownloadPrescription(APIView):
    def get(self,request,appointment_id):
        try:
            appointment = Appointment.objects.get(id=appointment_id)
            prescription = appointment.prescription

            html = render_to_string('prescription/prescription_template.html',{
                "appointment":appointment,
                "prescription":prescription,
            })
            result = BytesIO()
            pdf = pisa.CreatePDF(html,dest=result)
            if not pdf.err:
                result.seek(0)
                respose = HttpResponse(
                    result.read(),
                    content_type='application/pdf'
                )
                respose['Content-Disposition'] =f'attachment; filename="prescription_{appointment_id}.pdf'
                return respose
            else:
                return Response({'error':'Failed to generate PDF'})
        except Exception as e:
            logger.error(
                "Unexpected error while download prescription pdf ",
                exc_info=True
            )
            return Response({'error':'An error occur please try again later'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)