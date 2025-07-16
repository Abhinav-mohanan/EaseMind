from django.utils.crypto import get_random_string
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from . models import EmailOTP 

def send_otp_email(user,purpose='email_verification'):
    otp = get_random_string(length=6,allowed_chars='1234567890')
    
    EmailOTP.objects.get_or_create(
        user = user,
        defaults={
            'otp':otp,
            'created_at':timezone.now()
        }
    )
    
    subject = f'OTP for {purpose.replace('_',' ')} is {otp}'
    name = f'{user.first_name} {user.last_name}'
    message = f"""
    Hai {name},
    
    Your OTP for {purpose.replace('_',' ')} is:{otp}

    This OTP is valid for only a Five minutes

    Thank you,
    EaseMind Team
    """
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[user.email],
        fail_silently=False
    )