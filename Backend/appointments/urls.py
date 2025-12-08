from django.urls import path
from .views import (PsychologistAvailabilityView,PsychologistListView,PsychologistDetailsView,
                    CreateOrderView,BookSlotView,LockSlotView,PsychologitAppointmentView,
                    UserAppointmentView,AdminAppointmentView,UserAppointmentDetails,PsychologistAppointmentDetails,
                    TopPsychologistsView,)

urlpatterns = [
    path('psychologist/availability/',PsychologistAvailabilityView.as_view(),name='psychologist-availability'),
    path('psychologist/availability/<int:slot_id>/',PsychologistAvailabilityView.as_view(),name='psychologist-availability_manage'),
    path('psychologit/list/',PsychologistListView.as_view(),name='psychologist-list'),
    path('top-psychologit/list/',TopPsychologistsView.as_view(),name='psychologist-list'),
    path('psychologist/details/<int:psychologist_id>/',PsychologistDetailsView.as_view(),name='psychologist-details'),
    path('psychologist/appointments/',PsychologitAppointmentView.as_view(),name='psychologist-appointments'),
    path('psychologist/appointments/details/<int:appointment_id>/',PsychologistAppointmentDetails.as_view(),name='psychologist-appointment-details'),
    path('user/appointments/',UserAppointmentView.as_view(),name='user-appointments'),
    path('user/appointment/details/<int:appointment_id>/',UserAppointmentDetails.as_view(),name='appointment-details'),
    path('create-order/',CreateOrderView.as_view(),name='create-order'),
    path('book-slot/',BookSlotView.as_view(),name='book-slot'),
    path('lock-slot/',LockSlotView.as_view(),name='lock-slot'),
    path('admin/appointments/',AdminAppointmentView.as_view(),name='admin-appointments'),


    
]