from django.urls import path
from . views import (UserSignupView,PsychologistSignupView,VerifyOTPView,ResendOTPView)

urlpatterns = [
    path('user/signup/',UserSignupView.as_view(),name='user-signup'),
    path('psychologist/signup/',PsychologistSignupView.as_view(),name='psychologist-signup'),
    path('verify-otp/',VerifyOTPView.as_view(),name='verify-otp'),
    path('resend-otp/',ResendOTPView.as_view(),name='resend-otp'),
]