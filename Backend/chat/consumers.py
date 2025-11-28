import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import ChatRoom,Message
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async
from django.core.cache import cache

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f"chat_{self.room_name}"

        self.user = self.scope['user']
        cache.set(f'user_online_{self.user.id}',True,timeout=None)


        await self.channel_layer.group_add(self.room_group_name,self.channel_name)
        await self.accept()

        participant_ids = await self.get_participant_ids(self.room_name)
        statuses = {}
        for pid in participant_ids:
            statuses[pid] = 'online' if cache.get(f'user_online_{pid}') else 'offline'
        
        await self.send(text_data=json.dumps({
            "event":"initial_statuses",
            "statuses":statuses
        }))

        await self.channel_layer.group_send(
            self.room_group_name,{
                "type":'user_status',
                "user_id":self.user.id,
                "status":"online"
            }
        )
    
    async def disconnect(self, code):
        user = self.scope['user']
        cache.delete(f'user_online_{user.id}')

        await self.channel_layer.group_send(
            self.room_group_name,{
                "type":"user_status",
                "user_id":user.id,
                "status":"offline"
            }
        )
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
    
    @database_sync_to_async
    def get_participant_ids(self, room_id):
        room = ChatRoom.objects.select_related('user', 'psychologist').get(id=room_id)
        return [room.user.id, room.psychologist.id]
    
    async def user_status(self,event):
        await self.send(text_data=json.dumps({
            "event":"status",
            "user":event["user_id"],
            "status":event["status"]
        }))