import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import ChatRoom,Message
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f"chat_{self.room_name}"

        await self.channel_layer.group_add(self.room_group_name,self.channel_name)
        await self.accept()
    
    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.room_group_name,self.channel_name)

    async def receive(self, text_data=None):
        if not text_data:
            return None
        
        data = json.loads(text_data)
        message = data.get("message")
        file_ref = data.get("file")
        filenames = data.get('filename')

        sender = self.scope['user']
        room = await self.get_room(self.room_name)
        message_content = await self.create_message(room,sender,message,file_ref,filenames)

        payload = {
            "id":message_content.id,
            "text":message_content.text,
            "sender":sender.id,
            "timestamp":message_content.timestamp.isoformat(),
            "file":message_content.file if message_content.file else None,
            'filenames':message_content.filenames
            
        }

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "event": "message",
                "message":payload
            },
        )
    async def chat_message(self,event):
        await self.send(text_data=json.dumps({
            "event":event.get("event","message"),
            "message":event['message'],
        }))
    
    
    @database_sync_to_async
    def get_room(self,room_id):
        return ChatRoom.objects.get(id=room_id)
    
    @database_sync_to_async
    def create_message(self,room,sender,text,file_ref,filenames):
        kwargs = {
            "room":room,
            "sender":sender,
            "text":text
        }
        if file_ref:
            kwargs['file'] = file_ref
            kwargs['filenames'] = filenames

        return Message.objects.create(**kwargs)