from django.utils.crypto import get_random_string
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils import timezone
from django.conf import settings
from . models import EmailOTP 
from .tasks import send_otp_email_task
import logging

logger = logging.getLogger(__name__)

def send_otp_email(user, purpose='email_verification'):
    otp = get_random_string(length=6, allowed_chars='1234567890')

    EmailOTP.objects.update_or_create(
        user=user,
        purpose=purpose,
        defaults={
            'otp': otp,
            'created_at': timezone.now()
        }
    )

    purpose_labels = {
        'email_verification': 'Signup Email Verification',
        'password_reset': 'Password Reset',
    }

    readable_purpose = purpose_labels.get(
        purpose,
        purpose.replace('_', ' ').title()
    )

    subject = f'OTP for {readable_purpose}'
    name = f'{user.first_name} {user.last_name}'

    message = f"""
        Hi {name},

        Your OTP for {readable_purpose} is: {otp}

        This OTP is valid for only 5 minutes.

        Thank you,
        EaseMind Team
        """

    send_otp_email_task.delay(user.email, subject, message)


# set jwt token in to http only cookie
def set_token_cookies(response,access,refresh):
    config = settings.JWT_COOKIE_SETTINGS
    response.set_cookie(
        'access_token',
        access,
        max_age=config['ACCESS_MAX_AGE'],
        httponly=config['HTTPONLY'],
        secure=config['SECURE'],
        samesite=config['SAMESITE'],
        path='/'
    )
    response.set_cookie(
        'refresh_token',
        refresh,
        max_age=config['REFRESH_MAX_AGE'],
        httponly=config['HTTPONLY'],
        secure=config['SECURE'],
        samesite=config['SAMESITE'],
        path='/'
    )
   
    logger.info('access and refresh token can set http only successfully')
    return response

class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get('access_token')
        if access_token:
            validated_token = self.get_validated_token(access_token)
            return self.get_user(validated_token), validated_token
        return None
