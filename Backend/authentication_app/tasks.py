from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail

from django.utils import timezone
@shared_task
def heartbeat_task():
    print(f'celery beat working at {timezone.now()}')

@shared_task
def send_otp_email_task(email,subject,message):
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[email],
        fail_silently=False
    )
    return f'OTP email send to {email}'
