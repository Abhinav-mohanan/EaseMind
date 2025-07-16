from django.db import models
from django.contrib.auth.models import AbstractUser,BaseUserManager
from cloudinary.models import CloudinaryField
from django.utils import timezone
from datetime import timedelta

# Create your models here.

# custom user manager (To email authenctication)
class CustomUserManager(BaseUserManager):
    def create_user(self,email,password=None,**extra_fields):
        if not email:
            raise ValueError('Email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email,**extra_fields)
        user.set_password(password)
        if not user.role:
            raise ValueError("Role must be set")
        user.save()
        return user
    
    def create_superuser(self,email,password=None,**extra_fields):
        extra_fields.setdefault('is_staff',True)
        extra_fields.setdefault('is_superuser',True)
        extra_fields.setdefault('role','admin')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Super user must have is_staff is True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Super user mush have is_superuser is True')
        return self.create_user(email,password,**extra_fields)


# custom user model
class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('user','User'),
        ('psychologist','Psychologist')
    )

    GENDER_CHOICES = (
        ('male','Male'),
        ('female','Female'),
        ('other','Other')
    )
    profile_picture = CloudinaryField('profile_image',null=True,blank=True)
    phone_number = models.CharField(max_length=15,null=True,blank=True)
    email = models.EmailField(unique=True)
    role = models.CharField(choices=ROLE_CHOICES,max_length=20)
    gender = models.CharField(max_length=15,choices=GENDER_CHOICES,null=True,blank=True)
    date_of_birth = models.DateField(null=True,blank=True)
    is_email_verified = models.BooleanField(default=False)
    is_blocked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    username = None

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['role']

    objects = CustomUserManager()

    def __str__(self):
        return self.email
    

class PsychologistProfile(models.Model):
    VERIFICATION_STATUS = (
        ('pending','Pending'),
        ('verified','Verified'),
        ('rejected','Rejected'),
    )
    user = models.OneToOneField(CustomUser,on_delete=models.CASCADE,related_name='psychologist_profile')
    license_no = models.CharField(max_length=50)
    specialization = models.CharField(max_length=50)
    experience_years = models.IntegerField(default=0)

    bio = models.TextField(null=True,blank=True)
    education = models.CharField(max_length=100,null=True,blank=True)
    license_certificate = CloudinaryField('license_certificate',null=True,blank=True)
    experience_certificate = CloudinaryField('experience_certificate',null=True,blank=True)
    education_certificate = CloudinaryField('education_certificate',null=True,blank=True)
    is_verified = models.CharField(max_length=50,choices=VERIFICATION_STATUS,default='pending')

    def __str__(self):
        return f'{self.user.first_name} Psychologist profile'
    
# Email Model
class EmailOTP(models.Model):
    user = models.OneToOneField(CustomUser,on_delete=models.CASCADE)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return timezone.now() > self.created_at + timedelta(minutes=5)
    
    def __str__(self):
        return f'{self.user.email} - {self.otp}'