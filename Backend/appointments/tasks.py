from celery import shared_task
from django.utils import timezone
from .models import Appointment,PsychologistAvailability
from datetime import timedelta
from notification.utils import create_notification

@shared_task(bind=True,autoretry_for=(Exception,),retry_kwargs={'max_retries': 3, 'countdown': 10})
def mark_past_appointments(self):
    now = timezone.now()

    appointment = Appointment.objects.filter(
        status='booked',
        availability__end_time__lt=now + timedelta(minutes=15)
    )

    updated_count = appointment.update(status='not_attended')
    return f'{updated_count} appointments marked'


@shared_task(bind=True,autoretry_for=(Exception,),retry_kwargs={'max_retries': 3, 'countdown': 10})
def unlock_expired_slots(self):
    now = timezone.now()

    PsychologistAvailability.objects.filter(
        is_booked=False,
        locked_until__lt=now
    ).update(locked_until=None)


@shared_task(bind=True,autoretry_for=(Exception,),retry_kwargs={'max_retries': 3, 'countdown': 10})
def send_appointment_reminder(self,appointment_id):
    appointment = Appointment.objects.get(id=appointment_id)
    create_notification(user=appointment.user,
                        message=f'Reminder: Appointment in 30 minutes with psychologist {appointment.psychologist.user.get_full_name()}')
    create_notification(user=appointment.psychologist,
                        message=f'Reminder: Appointment in 30 minutes with user {appointment.user.get_full_name()}')


