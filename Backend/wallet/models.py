from django.db import models
from authentication_app.models import CustomUser
from decimal import Decimal
from appointments.models import Appointment
from django.db import transaction

# Create your models here.

class Wallet(models.Model):
    user = models.OneToOneField(CustomUser,on_delete=models.CASCADE,related_name='wallet',null=True,blank=True)
    is_admin_wallet = models.BooleanField(default=False)
    balance = models.DecimalField(max_digits=10,decimal_places=2,default=Decimal('0.00'))
    locked_balance = models.DecimalField(max_digits=10,decimal_places=2,default=Decimal('0.00'))

    @property
    def role(self):
        return self.user.role if self.user else "admin"
    
    def _create_transaction(self,transaction_type,amount,description=None,initiated_by=None,appointment=None,status='completed'):
        return WalletTransaction.objects.create(
            wallet = self,
            transaction_type=transaction_type,
            amount=amount,
            description=description,
            initiated_by=initiated_by,
            appointment=appointment,
            status=status
        )
    
    def credit_locked(self,amount,description=None,appointment=None,initiated_by=None):
        amount = Decimal(str(amount)) if not isinstance(amount,Decimal) else amount
        with transaction.atomic():
            self.locked_balance += amount
            self.save()
            return self._create_transaction(
                "credit",amount,description,initiated_by,appointment,status='pending')

    def release_locked(self,amount,transactions):
        amount = Decimal(str(amount)) if not isinstance(amount,Decimal) else amount
        with transaction.atomic():
            if self.locked_balance >= amount:
                self.locked_balance -= amount
                self.balance += amount
                self.save()
                transactions.status = 'completed'
                transactions.save()
                return True
        return False
    
    def refund_locked(self, amount, transactions,initiated_by):
        amount = Decimal(str(amount)) if not isinstance(amount, Decimal) else amount
        with transaction.atomic():
            if self.locked_balance >= amount:
                self.locked_balance -= amount
                self.save()
                transactions.status = 'refunded'
                transactions.save()
                description = f'Refund debit for {transactions.description}'
                return self._create_transaction(
                    "debit",amount,description,initiated_by,transactions.appointment)
        return False

    def credit(self,amount,description=None,appointment=None,initiated_by=None):
        amount = Decimal(str(amount)) if not isinstance(amount, Decimal) else amount
        self.balance = Decimal(str(self.balance)) if not isinstance(self.balance, Decimal) else self.balance
        with transaction.atomic():
            self.balance += amount
            self.save()
            return self._create_transaction('credit',amount,description,initiated_by,appointment)
    
    def debit(self,amount,description=None,initiated_by=None,appointment=None):
        amount = Decimal(str(amount)) if not isinstance(amount, Decimal) else amount
        self.balance = Decimal(str(self.balance)) if not isinstance(self.balance, Decimal) else self.balance
        with transaction.atomic():
            if self.balance >= amount:
                self.balance -= amount
                self.save()
                return self._create_transaction('debit',amount,description,initiated_by,appointment)
        return False


class WalletTransaction(models.Model):
    TRANSACTIONCHOICES = [
        ('credit','Credit'),
        ('debit','Debit')
    ]
    STATUS_CHOICES = [
        ("pending", "Pending"),      
        ("completed", "Completed"),  
        ("refunded", "Refunded"),    
    ]
    wallet = models.ForeignKey(Wallet,on_delete=models.CASCADE,related_name='transactions',null=True,blank=True)
    transaction_type = models.CharField(max_length=25,choices=TRANSACTIONCHOICES)
    amount = models.DecimalField(max_digits=10,decimal_places=2)
    status = models.CharField(max_length=15,choices=STATUS_CHOICES,default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=255,blank=True,null=True)
    initiated_by = models.ForeignKey(CustomUser,on_delete=models.SET_NULL,null=True,blank=True,related_name='initiated_transactions')
    appointment = models.ForeignKey(Appointment,on_delete=models.SET_NULL,null=True,blank=True,related_name='wallet_transactions')


class Payout(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    psychologist = models.ForeignKey(CustomUser,on_delete=models.CASCADE,related_name='payout_requests')
    amount = models.DecimalField(max_digits=10,decimal_places=2,default=0.00)
    status = models.CharField(max_length=50,choices=STATUS_CHOICES,default='pending')
    requested_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True,blank=True)
    remarks = models.TextField(blank=True,null=True)
    bank_account_no = models.CharField(max_length=20,null=True,blank=True)
    ifsc_code = models.CharField(max_length=20,null=True,blank=True)
    class Meta:
        ordering = ['-requested_at']