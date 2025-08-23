from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import AccessToken
from .models import ChatRoom
from .serializers import ConversationSerializer,MessageSerializer
from appointments.models import Appointment
from django.core.exceptions import ObjectDoesNotExist
from datetime import timedelta


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

class WebsocketTokenView(APIView):
    def get(self,request):
        user = request.user
        access_token = AccessToken.for_user(user)
        access_token.set_exp(lifetime=timedelta(minutes=5))
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