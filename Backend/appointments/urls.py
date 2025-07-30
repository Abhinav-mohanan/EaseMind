from django.urls import path
from .views import (PsychologistAvailabilityView)

urlpatterns = [
    path('psychologist/availability/',PsychologistAvailabilityView.as_view(),name='psychologist-availability'),
    path('psychologist/availability/<int:slot_id>/',PsychologistAvailabilityView.as_view(),name='psychologist-availability_manage')
]