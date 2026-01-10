from .models import Notification
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.utils import timezone
import logging 

logger = logging.getLogger(__name__)

def create_notification(user,message,conversation_id=None,notification_type='INFO'):
    try:
        if notification_type =='CHAT' and conversation_id:
            notification,created = Notification.objects.update_or_create(
                user=user,
                notification_type='CHAT',
                is_read=False,
                conversation_id=conversation_id,
                defaults={
                    'message':message,
                    'created_at':timezone.now()
                }
            )
        else:
            notification = Notification.objects.create(
                user=user,
                message=message,
                notification_type=notification_type
            )
        
        channel_layer = get_channel_layer()
        group_name = f'user_{user.id}'
        async_to_sync(channel_layer.group_send)(
            group_name,{
                'type':'send_notification',
                'message':message,
                'notification_type':notification_type,
                'is_read':notification.is_read,
                'id':notification.id,
                'conversation_id':conversation_id
            }
        )
    except Exception:
        logger.error(f'error creating notification',exc_info=True)
        return None 