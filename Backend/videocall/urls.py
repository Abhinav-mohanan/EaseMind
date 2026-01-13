from django.urls import path
from .views import GetZegoTokenView,StartVideoCallView

urlpatterns = [
    path('get-zego-token/<int:appointment_id>/',GetZegoTokenView.as_view(),name='get-zego-token'),
    path('video-call/<int:appointment_id>/can-start/',StartVideoCallView.as_view(),name='video-call-can-start'),

]