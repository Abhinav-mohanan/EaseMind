from django.db import models
from authentication_app.models import CustomUser

# Create your models here.

class ChatRoom(models.Model):
    user = models.ForeignKey(CustomUser,on_delete=models.CASCADE,related_name='user_rooms')
    psychologist = models.ForeignKey(CustomUser,on_delete=models.CASCADE,related_name='psychologist_rooms')

    def __str__(self):
        return f'Conversation between {self.user.email} and {self.psychologist.email}'

class Message(models.Model):
    room = models.ForeignKey(ChatRoom,on_delete=models.CASCADE,related_name='messages')
    sender = models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'message from {self.sender.email} at {self.timestamp}'

