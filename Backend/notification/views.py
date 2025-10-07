from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Notification
from .serializer import NotificationSerializer
import logging
# Create your views here.

logger = logging.getLogger(__name__)

class NotificationListView(APIView):
    def get(self,request):
        try:
            user = request.user
            filter_type = request.query_params.get('filter','all')
            if filter_type == 'unread':
                notifications = Notification.objects.filter(user=user,is_read=False)
            else:
                notifications = Notification.objects.filter(user=user)
            serializer = NotificationSerializer(notifications,many=True)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f'error occured while fetching the notifications: {str(e)}')
            return Response({"error":'An error occured please try again after some times'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

class MarkAllReadView(APIView):
    def patch(self,request):
        try:      
            user = request.user
            Notification.objects.filter(user=user,is_read=False).update(is_read=True)
            return Response({'message':"All notification marked as read"},status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"error occured when the notification all mark as read : {str(e)}")
            return Response({'error':"An error occured please try again after some times"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class ClearAllNotificationsView(APIView):
    def delete(self,request):
        try:
            user = request.user
            Notification.objects.filter(user=user).delete()
            return Response({"message":"All notifications cleared"},status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f'error occured when delete the all notifications: {str(e)}')
            return Response({'error':"An error occured please try again after some times"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)