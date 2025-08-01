from django.urls import path
from .views import (PsychologistAvailabilityView,PsychologitListView,PsychologistDetailsView,
                    CreateOrderView,BookSlotView,LockSlotView)

urlpatterns = [
    path('psychologist/availability/',PsychologistAvailabilityView.as_view(),name='psychologist-availability'),
    path('psychologist/availability/<int:slot_id>/',PsychologistAvailabilityView.as_view(),name='psychologist-availability_manage'),
    path('psychologit/list/',PsychologitListView.as_view(),name='psychologist-list'),
    path('psychologist/details/<int:psychologist_id>/',PsychologistDetailsView.as_view(),name='psychologist-details'),
    path('create-order/',CreateOrderView.as_view(),name='create-order'),
    path('book-slot/',BookSlotView.as_view(),name='book-slot'),
    path('lock-slot/',LockSlotView.as_view(),name='lock-slot'),

    
]