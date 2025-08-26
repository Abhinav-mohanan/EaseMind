from django.db import models
import uuid
from appointments.models import Appointment

# Create your models here.

class VideoCallSession(models.Model):
    appointment = models.OneToOneField(Appointment,on_delete=models.CASCADE,related_name='video_session')
    video_room_id = models.UUIDField(default=uuid.uuid4,editable=False,unique=True)
    video_start_time = models.DateTimeField(blank=True,null=True)
    video_end_time = models.DateTimeField(blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'VideoSession for appointment {self.appointment.id}'
    