from django.db import models
from appointments.models import Appointment
from authentication_app.models import PsychologistProfile,CustomUser

# Create your models here.

class Prescription(models.Model):
    SEVERITY_CHOICES = (
        ('mild','Mild'),
        ('moderate','Moderate'),
        ('severe','Severe')
    )
    appointment = models.OneToOneField(Appointment,on_delete=models.CASCADE,related_name='prescription')
    diagnosis = models.TextField()
    medicines = models.TextField(help_text="Medicine details with dosage")
    advice = models.TextField(blank=True,null=True)
    follow_up_date = models.DateField(blank=True,null=True,help_text='Suggested date for follow-up consultation')
    severity_level = models.CharField(max_length=25,choices=SEVERITY_CHOICES,blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Prescription for {self.appointment.user.first_name} - {self.appointment.id}'
    