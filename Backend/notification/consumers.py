import json
from channels.generic.websocket import AsyncWebsocketConsumer


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        if not self.user.is_authenticated:
            await self.close()
            return
        self.group_name = f'user_{self.user.id}'
        await self.channel_layer.group_add(self.group_name,self.channel_name)
        await self.accept()
    
    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.group_name,self.channel_name)
    

    async def send_notification(self,event):
        await self.send(text_data=json.dumps({
            'id':event['id'],
            'message':event['message'],
            'is_read':event['is_read'],
            'notification_type':event['notification_type'],
        }))
