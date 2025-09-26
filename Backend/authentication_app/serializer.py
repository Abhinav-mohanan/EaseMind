from rest_framework import serializers
from . models import EmailOTP,CustomUser,PsychologistProfile
from django.utils.crypto import get_random_string
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from .utils import send_otp_email
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import timedelta,datetime,date

class SignupSerializer(serializers.ModelSerializer):
    # Write-only (not  returned in response)
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['first_name','last_name','email','phone_number','role','password','confirm_password']
    
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

        if user.role == 'psychologist':
            PsychologistProfile.objects.create(user=user)
        # send OTP
        send_otp_email(user,purpose='email_verification')

        return user

# VerifyOTP[email_validation/reset_password]
class VerifyOTPserializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
    purpose = serializers.CharField(default='email_verification') # default for signup

    def validate(self, data):
        email = data.get('email')
        otp = data.get('otp')
        purpose = data.get('purpose')

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError('User with this email does not exists')
        try:
            otp_obj = EmailOTP.objects.get(user=user,purpose=purpose)
        except EmailOTP.DoesNotExist:
            raise serializers.ValidationError("OTP Not found please request new one")
        
        if otp_obj.otp != otp:
            raise serializers.ValidationError("Invalid OTP")
        if otp_obj.is_expired():
            raise serializers.ValidationError("OTP is Expired")

        data['user'] = user
        data['otp_obj'] = otp_obj
        return data
    
    def save(self):
        user = self.validated_data['user']
        purpose = self.validated_data['purpose']
        otp_obj = self.validated_data['otp_obj']

        if purpose == 'email_verification':
            user.is_email_verified = True   
        elif purpose == 'password_reset':
            pass
        user.save()
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
            
            if not user.check_password(password):   #check the password is correct
                raise serializers.ValidationError("Invalid email or password")
            if user.is_blocked:
                raise serializers.ValidationError("Account is blocked by Admin")
                        
            data['user'] = user
        else:
            raise serializers.ValidationError("Email and Password are required")
        
        return data
        
    def get_token_for_users(self,user):
        refresh = RefreshToken.for_user(user)      # create token
        return {
            'refresh' : str(refresh),
            'access'  : str(refresh.access_token)
        }

class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    role = serializers.CharField()

    def validate(self,data):
        email = data['email']
        role = data['role']
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("No user is registered with this email")
        if user.role != role:
            raise serializers.ValidationError(f'User is not {role} Please select valid Role')
        data['user'] = user
        return data
    
    def save(self):
        user = self.validated_data['user']
        send_otp_email(user,purpose='password_reset')   # send otp
        return user

class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        password = data.get('password')
        confirm_password = data.get('confirm_password')
        email = data.get('email')
        if password != confirm_password:
            raise serializers.ValidationError("Passwords do not match")
        if len(password) < 6:
            raise serializers.ValidationError("Password must be at least 6 characters")
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exists")
        data['user'] = user
        return data
    
    def save(self):
        user = self.validated_data['user']
        password = self.validated_data['password']
        user.set_password(password)        
        user.save()
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id','email','first_name','last_name','role','profile_picture',
                  'phone_number','gender','date_of_birth']
    
    def get_profile_picture(self,obj):
        if obj.profile_picture:
            return obj.profile_picture.url
        return None

class UserProfileWriterSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'profile_picture', 'phone_number', 'gender', 'date_of_birth']
    
    def validate(self, data):
        phone_number = data.get('phone_number')
        date_of_birth = data.get('date_of_birth')
        
        # Phone number: must be 10 digits
        if phone_number:
            if not phone_number.isdigit() or len(phone_number) != 10:
                raise serializers.ValidationError('Enter a valid 10-digit phone number')
        
        # DOB must be in the past and user must be at least 10 years old
        if date_of_birth:
            today = date.today()
            if date_of_birth > today:
                raise serializers.ValidationError("Date of birth cannot be in the future")
            
            age = today.year - date_of_birth.year -(
                (today.month,today.day) < (date_of_birth.month,date_of_birth.day))
            if age < 10:
                raise serializers.ValidationError('User must be at least 10 years old')
        return data
    
    def update(self,instance,validated_data):
        for attr,value in validated_data.items():
            if attr == 'profile_picture':
                if value is not None:
                    setattr(instance,attr,value)
            else:
                setattr(instance,attr,value)
        instance.save()
        return instance

class PsychologistProfileSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer()
    license_certificate = serializers.SerializerMethodField()
    experience_certificate = serializers.SerializerMethodField()
    education_certificate = serializers.SerializerMethodField()

    class Meta:
        model = PsychologistProfile
        fields = '__all__'
    
    def get_license_certificate(self,obj):
        if obj.license_certificate:
            return obj.license_certificate.url
        return None
    
    def get_experience_certificate(self,obj):
        if obj.experience_certificate:
            return obj.experience_certificate.url
        return None
    
    def get_education_certificate(self,obj):
        if obj.education_certificate:
            return obj.education_certificate.url
        return None

class PsychologistProfileWriterSerializer(serializers.ModelSerializer):
    class Meta:
        model = PsychologistProfile
        fields = [
            'bio',
            'education',
            'license_no',
            'specialization',
            'experience_years',
            'license_certificate',
            'education_certificate',
            'experience_certificate',
        ]
    
    def update(self, instance, validated_data):
        for attr,value in validated_data.items():
            if attr in ['license_certificate','experience_certificate','education_certificate']:
                if value is not None:
                    setattr(instance,attr,value)
            else:
                setattr(instance,attr,value)
        required_fields = [
            instance.license_no,
            instance.license_certificate,
            instance.education_certificate
        ]
        if all(required_fields):
            instance.is_submitted = True
        instance.save()
        return instance

        
        
