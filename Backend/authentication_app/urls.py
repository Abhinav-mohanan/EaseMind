from django.urls import path
from . views import (UserSignupView,PsychologistSignupView,VerifyOTPView,ResendOTPView,UserLoginView,
                     PsychologistLoginView,CustomRefreshView,TestView)

urlpatterns = [
    path('user/signup/',UserSignupView.as_view(),name='user-signup'),
    path('psychologist/signup/',PsychologistSignupView.as_view(),name='psychologist-signup'),
    path('verify-otp/',VerifyOTPView.as_view(),name='verify-otp'),
    path('resend-otp/',ResendOTPView.as_view(),name='resend-otp'),
    path('user/login/',UserLoginView.as_view(),name='user-login'),
    path('psychologist/login/',PsychologistLoginView.as_view(),name='psychologist-login'),
    path('token/refresh/',CustomRefreshView.as_view(),name='token-refresh'),
    path('test/',TestView.as_view(),name='test')
]