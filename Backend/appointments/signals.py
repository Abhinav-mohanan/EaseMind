from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django_celery_beat.models import CrontabSchedule,PeriodicTask

@receiver(post_migrate)
def setup_periodic_tasks(sender, **kwargs):
    crontab_5min, _ = CrontabSchedule.objects.get_or_create(
        minute='*/5',
        hour='*',
        day_of_week='*',
        day_of_month='*',
        month_of_year='*',
    )

    crontab_2min, _ = CrontabSchedule.objects.get_or_create(
        minute='*/2',
        hour='*',
        day_of_week='*',
        day_of_month='*',
        month_of_year='*',
    )

    PeriodicTask.objects.get_or_create(
        name='mark_past_appointments',
        defaults={
            'task': 'appointments.tasks.mark_past_appointments',
            'crontab': crontab_5min,
        }
    )

    PeriodicTask.objects.get_or_create(
        name='unlock_expired_slots',
        defaults={
            'task': 'appointments.tasks.unlock_expired_slots',
            'crontab': crontab_2min,
        }
    )


 