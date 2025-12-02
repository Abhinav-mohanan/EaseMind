from django.urls import path
from .views import (UserCompletedAppointmentsListView,PsychologistCompletedAppointmentsListView,
                    PsychologistPrescriptionView,UserPrescriptionView,UserHealthTrackingListCreateView,
                    UserHealthTrackingDetailView,PsychologistHealthTrackingView,DownloadPrescription)

urlpatterns = [
    path('psychologist/consultations/',PsychologistCompletedAppointmentsListView.as_view(),name='psychologist-consultations'),
    path('psychologist/prescription/<int:appointment_id>/',PsychologistPrescriptionView.as_view(),name='psychologist-prescription'),
    path('psychologist/health-tracking/<int:user_id>/',PsychologistHealthTrackingView.as_view(),name='psychologist-health-tracking'),
    path('user/consultations/',UserCompletedAppointmentsListView.as_view(),name='user-consultations'),
    path('user/prescription/<int:appointment_id>/',UserPrescriptionView.as_view(),name='user-consultations'),
    path('user/health-tracking/',UserHealthTrackingListCreateView.as_view(),name='user-health-tracking'),
    path('user/health-tracking/<int:health_tracking_id>/',UserHealthTrackingDetailView.as_view(),name='user-health-tracking-details'),
    path('appointments/<int:appointment_id>/prescription/download/',DownloadPrescription.as_view(),name='prescription-download')
    
]