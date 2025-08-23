from rest_framework import serializers
from .models import Message,ChatRoom


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id','sender','text','timestamp']


class ConversationSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    psychologist = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = ['id','user','psychologist']
    
    def get_user(self,obj):
        if obj.user:
            return f'{obj.user.first_name} {obj.user.last_name}'
        return None
    
    def get_psychologist(self,obj):
        if obj.psychologist:
            return f'{obj.psychologist.first_name} {obj.psychologist.last_name}'
        return None
    

    
    