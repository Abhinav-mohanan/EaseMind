from rest_framework import serializers
from . models import EmailOTP,CustomUser,PsychologistProfile
from django.utils.crypto import get_random_string
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from .utils import send_otp_email
from rest_framework_simplejwt.tokens import RefreshToken

class SignupSerializer(serializers.ModelSerializer):
    # Write-only (not  returned in response)
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['first_name','last_name','email','phone_number','role','password','confirm_password']
    
    # Validate the data
    def validate(self,data):
        errors = {}
        password = data.get('password')
        confirm_password = data.get('confirm_password')
        email = data.get('email')
        phone_number = data.get('phone_number')

        if password != confirm_password:
            errors['password'] = 'Password do not match'
        if CustomUser.objects.filter(email=email).exists():
            errors['email'] = 'Email already exists'
        if password and len(password) < 6:
            errors['password'] = 'Password must be at least 6 characters'
        if phone_number and len(phone_number) < 10:
            errors['phone_number'] = 'Enter a valid Phone number'
        
        if errors:
            raise serializers.ValidationError(errors)
        
        return data
    

    # create the instance
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = CustomUser.objects.create_user(
            first_name = validated_data['first_name'],
            last_name = validated_data['last_name'],
            email = validated_data['email'],
            phone_number = validated_data['phone_number'],
            role = validated_data['role'],
        )
        user.set_password(validated_data['password'])
        user.save()

        # send OTP
        send_otp_email(user,purpose='email_verification')

        return user

# VerifyOTP
class VerifyOTPserializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

    def validate(self, data):
        email = data.get('email')
        otp = data.get('otp')

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError('User with this email does not exists')
        try:
            otp_obj = EmailOTP.objects.get(user=user)
        except EmailOTP.DoesNotExist:
            raise serializers.ValidationError("OTP Not found please request new one")
        
        if otp_obj.otp != otp:
            raise serializers.ValidationError("Invalid OTP")
        if otp_obj.is_expired():
            raise serializers.ValidationError("OTP is Expired")

        return data
    
    def save(self):
        email = self.validated_data['email']
        user = CustomUser.objects.get(email=email)
        user.is_email_verified = True             # Ensure that the email is verified
        user.save()

        otp_obj = EmailOTP.objects.get(user=user)
        otp_obj.delete()

        return user

class LoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['email','password']
    
    def validate(self,data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            try:
                user = CustomUser.objects.get(email=email)
            except CustomUser.DoesNotExist:
                raise serializers.ValidationError("Invalid email or password")
            
            if not user.check_password(password):
                raise serializers.ValidationError("Invalid email or password")
            if user.is_blocked:
                raise serializers.ValidationError("Account is blocked by Admin")
            if not user.is_email_verified and not user.role != 'admin':
                raise serializers.ValidationError("Please verify your email before logged in")
            
            data['user'] = user
        else:
            raise serializers.ValidationError("Email and Password are required")
        
        return data
        
    def get_token_for_users(self,user):
        refresh = RefreshToken.for_user(user)
        return {
            'refresh' : str(refresh),
            'access'  : str(refresh.access_token)
        }
        
