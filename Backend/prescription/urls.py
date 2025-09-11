from django.urls import path
from .views import (UserCompletedAppointmentsListView,PsychologistCompletedAppointmentsListView,
                    PsychologistPrescriptionView,UserPrescriptionView)

urlpatterns = [
    path('psychologist/consultations/',PsychologistCompletedAppointmentsListView.as_view(),name='psychologist-consultations'),
    path('psychologist/prescription/<int:appointment_id>/',PsychologistPrescriptionView.as_view(),name='psychologist-prescription'),
    path('user/consultations/',UserCompletedAppointmentsListView.as_view(),name='user-consultations'),
    path('user/prescription/<int:appointment_id>/',UserPrescriptionView.as_view(),name='user-consultations'),
    
]