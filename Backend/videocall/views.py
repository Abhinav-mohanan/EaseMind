from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from . models import VideoCallSession
from .utils import generate_token04
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from appointments.models import Appointment
from notification.utils import create_notification
from datetime import timedelta
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class GetZegoTokenView(APIView):
    def get(self,request,appointment_id):
        appointment = get_object_or_404(Appointment,id=appointment_id)
        user = request.user
        if user.role == 'psychologist':
            if appointment.psychologist.user != user:
                return Response({'error':"Not authorized"},status=status.HTTP_403_FORBIDDEN)
            video_session,created = VideoCallSession.objects.get_or_create(appointment=appointment)
            if not video_session.video_start_time:
                video_session.video_start_time = timezone.now()
                video_session.save()
        else:
            if appointment.user != user:
                return Response({'error':"Not authorized"},status=status.HTTP_403_FORBIDDEN)
            try:
                video_session = appointment.video_session
                if not video_session.video_start_time:
                    return Response({"error":'Psychologist has not started the call yet'},status=status.HTTP_400_BAD_REQUEST)
            except ObjectDoesNotExist:
                return Response({"error":"Video session not initiated"},status=status.HTTP_400_BAD_REQUEST)
        
        app_id = int(settings.ZEGO_APP_ID)
        server_secret =settings.ZEGO_SERVER_SECRET
        user_id = str(user.id)
        effective_time_in_seconds = 60 * 60
        room_id = str(video_session.video_room_id)
        payload = ''
        token_info = generate_token04(app_id,user_id,server_secret,effective_time_in_seconds,payload)

        return Response({
            'token':token_info.token,
            'app_id':int(app_id),
            'room_id':room_id,
            'user_id':user_id,
            "user_name": f'{user.first_name} {user.last_name}'
        })

class StartVideoCallView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self,request,appointment_id):
        try:
            appointment = Appointment.objects.select_related('availability').get(id=appointment_id)
            now = timezone.now()

            appointment_date = appointment.availability.date

            appointment_start = datetime.combine(
                appointment_date,appointment.availability.start_time
            )
            appointment_end = datetime.combine(
                appointment_date,appointment.availability.end_time
            )

            appointment_start = timezone.make_aware(appointment_start)
            appointment_end = timezone.make_aware(appointment_end)
           

            early_join_time = appointment_start - timedelta(minutes=7)

            if appointment.status != 'booked':
                return Response({
                    'allowed':False,
                    'reason':'Appointment is not active'
                },status=status.HTTP_400_BAD_REQUEST)
            
            if now < early_join_time:
                return Response({
                    'allowed':False,
                    'reason':'Appointment has not started yet'
                },status=status.HTTP_400_BAD_REQUEST)
            
            if now > appointment_end:
                return Response({
                    'allowed':False,
                    'reason':'Appointment has ended'
                },status=status.HTTP_400_BAD_REQUEST)
            
            psychologist = appointment.psychologist.user
            if request.user == psychologist:
                user = appointment.user
                create_notification(user,
                                    f'Psychologist {psychologist.get_full_name()} has started the video call. You can join now.')
            return Response({'allowed':True},status=status.HTTP_200_OK)
        except Appointment.DoesNotExist:
            return Response({'allowed':False,'reason':'Appointment not found'},
                            status=status.HTTP_404_NOT_FOUND)
        except Exception:
            logger.error('Unexpected error while Start the video call',exc_info=True)
            return Response({'allowed':False,'reason':'Something went wrong. Please try again.'}
                            ,status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    