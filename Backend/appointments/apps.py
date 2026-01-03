from django.apps import AppConfig


class AppointmentsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'appointments'

    def ready(self):
        from django_celery_beat.models import CrontabSchedule,PeriodicTask

        crontab,_ = CrontabSchedule.objects.get_or_create(
            minute='*/5',
            hour="*",
            day_of_week="*",
            day_of_month='*',
            month_of_year='*'
        )

        crontab2,_ = CrontabSchedule.objects.get_or_create(
            minute='*/2',
            hour="*",
            day_of_week="*",
            day_of_month='*',
            month_of_year='*'
        )

        PeriodicTask.objects.get_or_create(
            name='mark_past_appointments',
            task='appointments.tasks.mark_past_appointments',
            crontab=crontab,
        )
        PeriodicTask.objects.get_or_create(
            name='unlock_expired_slots',
            task='appointments.tasks.unlock_expired_slots',
            crontab=crontab2,
        )
