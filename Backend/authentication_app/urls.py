from django.urls import path
from . views import (UserSignupView,PsychologistSignupView)

urlpatterns = [
    path('user/signup/',UserSignupView.as_view(),name='user-signup'),
    path('psychologist/signup/',PsychologistSignupView.as_view(),name='psychologist-signup')
]