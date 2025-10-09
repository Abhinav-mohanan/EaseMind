from django.db import models
from datetime import datetime,timedelta
from authentication_app.models import PsychologistProfile,CustomUser

# Create your models here.


class PsychologistAvailability(models.Model):
    psychologist = models.ForeignKey(PsychologistProfile,on_delete=models.CASCADE)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    payment_amount = models.DecimalField(max_digits=10,decimal_places=2,default=0.00)
    is_booked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    locked_until = models.DateTimeField(null=True,blank=True)

    class Meta:
        unique_together = ('psychologist','date','start_time')
        ordering = ['date','start_time']
    
    def save(self,*args,**kwargs):
        if self.start_time and self.date:
            start_datetime = datetime.combine(self.date,self.start_time)
            self.end_time = (start_datetime + timedelta(minutes=30)).time()
        super().save(*args,**kwargs)
    
    def get_end_time(self):
        start_datetime = datetime.combine(datetime.today(),self.start_time)
        end_datetime = start_datetime + timedelta(minutes=30)
        return end_datetime.time()


class Appointment(models.Model):
    STATUS_CHOICES = (
        ('booked','Booked'),
        ('completed','Completed'),
        ('cancelled','Cancelled')
    )

    CANCELLED_BY = (
        ('user','User'),
        ('psychologist','Psychologist'),
        ('','None'),
    )
    user = models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    psychologist = models.ForeignKey(PsychologistProfile,on_delete=models.CASCADE)
    availability = models.ForeignKey(PsychologistAvailability,on_delete=models.CASCADE)
    status = models.CharField(max_length=25,choices=STATUS_CHOICES,default='booked')
    cancelled_by = models.CharField(max_length=25,choices=CANCELLED_BY,blank=True,default='')
    cancellation_reason = models.TextField(blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.psychologist.user.first_name} appointment with {self.user.first_name}'


class Payment(models.Model):
    PAYMENT_STATUS = (
        ('success','Success'),
        ('failed','Failed'),
        ('refunded','Refunded'),
        ('pending','Pending')
    )
    appointment = models.ForeignKey(Appointment,on_delete=models.CASCADE,related_name='payment',null=True,blank=True)
    razorpay_order_id = models.CharField(max_length=255,blank=True,null=True)
    razorpay_payment_id = models.CharField(max_length=255,blank=True,null=True)
    amount = models.DecimalField(max_digits=10,decimal_places=2,default=0.00)
    commission_amount = models.DecimalField(max_digits=10,decimal_places=2,default=0.00)
    psychologist_share = models.DecimalField(max_digits=10,decimal_places=2,default=0.00)
    status = models.CharField(choices=PAYMENT_STATUS,default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
