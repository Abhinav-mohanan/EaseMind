from django.urls import path
from .views import (ConversationCreateView,ConversationListView,MessageListView,
                    WebsocketTokenView,UploadFileView)

urlpatterns = [
    path('chat/conversation/create/',ConversationCreateView.as_view(),name='create-conversation'),
    path('chat/conversations/',ConversationListView.as_view(),name='conversation-list'),
    path('chat/messages/<int:conversation_id>/',MessageListView.as_view(),name='message-list'),
    path('chat/ws-token/',WebsocketTokenView.as_view(),name='websocket-token'),
    path('chat/upload/',UploadFileView.as_view(),name='upload-file'),
    
]