from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import AccessToken
from cloudinary.uploader import upload as cloudinary_upload
from .models import ChatRoom
from .serializers import ConversationSerializer,MessageSerializer
from appointments.models import Appointment
from django.core.exceptions import ObjectDoesNotExist
from datetime import timedelta
import logging

logger = logging.getLogger(__name__)

class ConversationCreateView(APIView):
    def post(self,request):
        user = request.user
        appointment_id = request.data.get('appointment_id')
        try:
            if user.role == 'user':
                appointment = Appointment.objects.get(id=appointment_id,user=user)
                counterpart = appointment.psychologist.user
            else:
                appointment = Appointment.objects.get(id=appointment_id,psychologist=user.psychologist_profile)
                counterpart = appointment.user
            room,created = ChatRoom.objects.get_or_create(
                user=user if user.role == 'user' else counterpart,
                psychologist=counterpart if user.role == 'user' else user
            )
            return Response({'message':'Room created successfully','room_id':room.id},status=status.HTTP_200_OK)
        except Appointment.DoesNotExist:
            return Response({"Appointment does not found"},status=status.HTTP_404_NOT_FOUND)
        except Exception:
            logger.error(
                'Unexpected error while creating conversation room',
                exc_info=True
            )
            return Response({'error':"An unexpected error occurred. Please try again later"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class WebsocketTokenView(APIView):
    def get(self,request):
        user = request.user
        access_token = AccessToken.for_user(user)
        access_token.set_exp(lifetime=timedelta(hours=24))
        return Response({"token":str(access_token),"user":user.id})

class ConversationListView(APIView):
    def get(self,request):
        user = request.user
        if user.role == 'user':
            conversation = ChatRoom.objects.filter(user=user)
        else:
            conversation = ChatRoom.objects.filter(psychologist=user)
        serializer = ConversationSerializer(conversation,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    

class MessageListView(APIView):
    def get(self,request,conversation_id):
        user = request.user
        try:
            conversation = ChatRoom.objects.get(id=conversation_id)
            if user not in [conversation.user,conversation.psychologist]:
                return Response({"error":"Unauthorized access"},status=status.HTTP_403_FORBIDDEN)
            message = conversation.messages.order_by('timestamp')
            serilaizer = MessageSerializer(message,many=True)
            return Response(serilaizer.data,status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response({"error":"Conversation does not foun"},status=status.HTTP_404_NOT_FOUND)

class UploadFileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self,request,*args,**kwargs):
        file_obj = request.FILES.get('file')

        if not file_obj:
            return Response({"error":"No file provided"},
                            status=status.HTTP_400_BAD_REQUEST)
        
        try:
            file_name = file_obj.name
            result = cloudinary_upload(file_obj,resource_type='raw')
            file_url = result.get('secure_url')
            if not file_url:
                return Response({"error":"File upload failed"},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response({
                'file_url':file_url,
                'file_name':file_name,
            },status=status.HTTP_201_CREATED,)
        except Exception:
            logger.error(
                'Unexpected error while uploading file',
                exc_info=True
            )
            return Response({"error":"An unexpected error occurred while uploading the file. Please try again later."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
