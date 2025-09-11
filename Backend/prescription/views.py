from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from appointments.views import BaseAppointmentView
from appointments.models import Appointment
from appointments.serializer import AppointmentListSerializer
from authentication_app.permissions import IsPsychologist,IsUser
from .serializer import PrescriptionSerializer,PrescriptionCreateUpdateSerializer

# Create your views here.

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