from .models import Notification
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import logging 

logger = logging.getLogger(__name__)

def create_notification(user,message,notification_type='INFO'):
    try:
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
            }
        )
        return notification
    except Exception as e:
        logger.error(f'error creating notification: {str(e)}')
        return None 