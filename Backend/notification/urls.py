from django.urls import path
from .views import NotificationListView,MarkAllReadView,ClearAllNotificationsView

urlpatterns = [
    path('notifications/',NotificationListView.as_view(),name='notification-list'),
    path('notifications/mark-read/',MarkAllReadView.as_view(),name='mark-all-read'),
    path('notifications/clear/',ClearAllNotificationsView.as_view(),name='clear-notifications'),

]