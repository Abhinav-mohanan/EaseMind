import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import ChatRoom,Message
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async
from django.core.cache import cache
from notification.utils import create_notification
from asgiref.sync import sync_to_async
import logging

logger = logging.getLogger(__name__)

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            self.room_name = self.scope['url_route']['kwargs']['room_id']
            self.room_group_name = f"chat_{self.room_name}"

            self.user = self.scope['user']
            cache.set(f'user_online_{self.user.id}',True,timeout=None)


            await self.channel_layer.group_add(self.room_group_name,self.channel_name)
            await self.accept()

            await self.mark_messages_read(self.room_name,self.user)

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
        except Exception:
            logging.error(f'Error in connect for user {self.user.id}',exc_info=True)
            await self.close()

    async def disconnect(self, code):
        try:
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
        except Exception as e:
            logger.error(f'Error in disconnect:{str(e)}')

    async def receive(self, text_data=None):
        if not text_data:
            return None
        try:
            data = json.loads(text_data)
            message = data.get("message")
            file_ref = data.get("file")
            filenames = data.get('filename')

            sender = self.scope['user']
            room = await self.get_room(self.room_name)
            message_content = await self.create_message(room,sender,message,file_ref,filenames)

            participant_ids = await self.get_participant_ids(self.room_name)
            receiver_id = next(pid for pid in participant_ids if pid != sender.id)

            receiver = await database_sync_to_async(User.objects.get)(id=receiver_id)

            await sync_to_async(create_notification)(
                user=receiver,
                message=f'New message from {sender.get_full_name()}',
                notification_type='CHAT',
                room_id=self.room_name
            )

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
        except Exception as e:
            logger.error(f'Error receiveing message in room {self.room_name} :- {str(e)}')

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
    
    @database_sync_to_async
    def mark_messages_read(self,room,user):
        Message.objects.filter(
            room=room,
            is_read=False
        ).exclude(sender=user).update(is_read=True)