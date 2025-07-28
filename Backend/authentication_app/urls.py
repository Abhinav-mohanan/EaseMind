from django.urls import path
from . views import (UserSignupView,PsychologistSignupView,VerifyOTPView,ResendOTPView,UserLoginView,
                     PsychologistLoginView,CustomRefreshView,Logoutview,AuthStatusView,ForgotPasswordView,
                     ResetPasswordView,UserProfileView,PsychologistProfileView)

urlpatterns = [
    path('user/signup/',UserSignupView.as_view(),name='user-signup'),
    path('user/login/',UserLoginView.as_view(),name='user-login'),
    path('user/profile/',UserProfileView.as_view(),name='user-profile'),
    path('psychologist/signup/',PsychologistSignupView.as_view(),name='psychologist-signup'),
    path('psychologist/login/',PsychologistLoginView.as_view(),name='psychologist-login'),
    path('psychologist/profile/',PsychologistProfileView.as_view(),name='psychologist-profile'),    
    path('auth/status/',AuthStatusView.as_view(),name='auth-status'),
    path('verify-otp/',VerifyOTPView.as_view(),name='verify-otp'),
    path('resend-otp/',ResendOTPView.as_view(),name='resend-otp'),
    path('token/refresh/',CustomRefreshView.as_view(),name='token-refresh'),
    path('logout/',Logoutview.as_view(),name='logout'),
    path('forgot-password/',ForgotPasswordView.as_view(),name='forgot-password'),
    path('reset-password/',ResetPasswordView.as_view(),name='reset-password'),
]