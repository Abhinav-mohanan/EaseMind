from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from . models import VideoCallSession
from appointments.models import Appointment
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from .utils import generate_token04


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