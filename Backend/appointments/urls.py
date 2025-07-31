from django.urls import path
from .views import (PsychologistAvailabilityView,PsychologitListView)

urlpatterns = [
    path('psychologist/availability/',PsychologistAvailabilityView.as_view(),name='psychologist-availability'),
    path('psychologist/availability/<int:slot_id>/',PsychologistAvailabilityView.as_view(),name='psychologist-availability_manage'),
    path('psychologit/list/',PsychologitListView.as_view(),name='psychologist-list'),
    
]