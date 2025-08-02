from django.urls import path
from .views import (PsychologistAvailabilityView,PsychologitListView,PsychologistDetailsView,
                    CreateOrderView,BookSlotView,LockSlotView,PsychologitAppointmentView,
                    UserAppointmentView,AdminAppointmentView)

urlpatterns = [
    path('psychologist/availability/',PsychologistAvailabilityView.as_view(),name='psychologist-availability'),
    path('psychologist/availability/<int:slot_id>/',PsychologistAvailabilityView.as_view(),name='psychologist-availability_manage'),
    path('psychologit/list/',PsychologitListView.as_view(),name='psychologist-list'),
    path('psychologist/details/<int:psychologist_id>/',PsychologistDetailsView.as_view(),name='psychologist-details'),
    path('psychologist/appointments/',PsychologitAppointmentView.as_view(),name='psychologist-appointments'),
    path('user/appointments/',UserAppointmentView.as_view(),name='user-appointments'),
    path('create-order/',CreateOrderView.as_view(),name='create-order'),
    path('book-slot/',BookSlotView.as_view(),name='book-slot'),
    path('lock-slot/',LockSlotView.as_view(),name='lock-slot'),
    path('admin/appointments/',AdminAppointmentView.as_view(),name='admin-appointments'),

    
]