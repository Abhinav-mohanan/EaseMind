from celery import shared_task
from django.utils import timezone
from .models import Appointment,PsychologistAvailability
from datetime import timedelta,datetime
from notification.utils import create_notification

@shared_task(bind=True,autoretry_for=(Exception,),retry_kwargs={'max_retries': 3, 'countdown': 10})
def mark_past_appointments(self):
    now = timezone.now()

    appointments = Appointment.objects.filter(
        status='booked').select_related('availability')
    
    count = 0
    for appointment in appointments:
        end_datetime = datetime.combine(
            appointment.availability.date,
            appointment.availability.end_time
        )
        end_datetime = timezone.make_aware(end_datetime)

        threshold = end_datetime + timedelta(minutes=15)
        
        if now > threshold:
            appointment.status = 'not_attended'
            appointment.save(update_fields=['status'])
            count += 1

    return f'{count} appointments marked'


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


