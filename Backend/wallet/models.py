from django.db import models
from authentication_app.models import CustomUser
from decimal import Decimal
from appointments.models import Appointment

# Create your models here.

class Wallet(models.Model):
    user = models.OneToOneField(CustomUser,on_delete=models.CASCADE,related_name='wallet')
    balance = models.DecimalField(max_digits=10,decimal_places=2,default=0.00)

    def credit(self,amount,description=None,appointment=None,initiated_by=None):
        amount = Decimal(str(amount)) if not isinstance(amount, Decimal) else amount
        self.balance = Decimal(str(self.balance)) if not isinstance(self.balance, Decimal) else self.balance
        self.balance += amount
        self.save()
        WalletTransaction.objects.create(
            wallet = self,
            transaction_type='credit',
            amount = amount,
            description = description,
            initiated_by = initiated_by,
            appointment = appointment
            
        )
    
    def debit(self,amount,description=None,initiated_by=None,appointment=None):
        amount = Decimal(str(amount)) if not isinstance(amount, Decimal) else amount
        self.balance = Decimal(str(self.balance)) if not isinstance(self.balance, Decimal) else self.balance
        if self.balance >= amount:
            self.balance -= amount
            self.save()
            WalletTransaction.objects.create(
                wallet = self,
                transaction_type ='debit',
                amount = amount,
                description = description,
                initiated_by = None,
                appointment = appointment
            )
            return True
        return False


class WalletTransaction(models.Model):
    TRANSACTIONCHOICES = (
        ('credit','Credit'),
        ('debit','Debit')
    )
    wallet = models.ForeignKey(Wallet,on_delete=models.CASCADE,related_name='transactions',null=True,blank=True)
    transaction_type = models.CharField(max_length=25,choices=TRANSACTIONCHOICES)
    amount = models.DecimalField(max_digits=10,decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=255,blank=True,null=True)
    initiated_by = models.ForeignKey(CustomUser,on_delete=models.SET_NULL,null=True,blank=True,related_name='initiated_transactions')
    appointment = models.ForeignKey(Appointment,on_delete=models.SET_NULL,null=True,blank=True,related_name='wallet_transactions')
