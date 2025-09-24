from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail

@shared_task
def send_otp_email_task(email,subject,message):
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[email],
        fail_silently=False
    )
    print(f"Otp send successfully")
    return f'OTP email send to {email}'
