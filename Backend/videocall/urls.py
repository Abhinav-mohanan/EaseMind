from django.urls import path
from .views import GetZegoTokenView

urlpatterns = [
    path('get-zego-token/<int:appointment_id>/',GetZegoTokenView.as_view(),name='get-zego-token'),

]