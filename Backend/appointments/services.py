from django.utils import timezone
from datetime import datetime,timedelta
from django.db import transaction
from wallet.models import WalletTransaction,Wallet
from django_celery_beat.models import ClockedSchedule,PeriodicTask
import json


def cancel_appointment_service(
        appointment,
        cancelled_by,
        description,
        requested_user,
        force_refund=True
        ):
    
    
    appointment_datetime = timezone.make_aware(
            datetime.combine(
                appointment.availability.date,
                appointment.availability.start_time
            )
        )
    
    now = timezone.now()
    refund_allowed = force_refund

    if cancelled_by == 'psychologist':
        refund_allowed = True
    if cancelled_by == 'user':
        if appointment_datetime - now >= timedelta(hours=1):
            refund_allowed = True
    
    with transaction.atomic():

        appointment.availability.is_booked = False
        appointment.availability.locked_until = None
        appointment.availability.save()

        appointment.status = 'cancelled'
        appointment.cancellation_reason = description
        appointment.cancelled_by = cancelled_by
        appointment.save()

        if refund_allowed and appointment.availability.payment_amount > 0:
            total_amount = appointment.availability.payment_amount

            transactions = WalletTransaction.objects.filter(
                appointment=appointment,
                transaction_type='credit',
                status='pending'
            )
            for txn in transactions:
                wallet = txn.wallet
                if not wallet.refund_locked(txn.amount,txn,requested_user):
                    raise ValueError("Insufficient refund amount for refund")
                
            user_wallet = Wallet.objects.get(user=appointment.user)
            psychologist_name = appointment.psychologist.user.get_full_name()
            session_date = appointment.availability.date.strftime('%Y-%m-%d')
            session_time = appointment.availability.start_time.strftime('%I:%M %p')

            readable_description = (
                f'Refund credited due to cancellation by {cancelled_by}, '
                f'{psychologist_name} on {session_date} at {session_time}'
            )

            user_wallet.credit(
                amount=total_amount,
                initiated_by=requested_user,
                appointment=appointment,
                description=readable_description
            )
    return appointment

def schedule_appointment_reminder(appointment):
    appointment_start = timezone.make_aware(
        datetime.combine(
                appointment.availability.date,
                appointment.availability.start_time
        )
    )
    reminder_time = appointment_start - timedelta(minutes=30)
    
    if reminder_time <= timezone.now():
        return
    
    clocked,_ = ClockedSchedule.objects.get_or_create(
        clocked_time = reminder_time
    )

    PeriodicTask.objects.create(
        name=f'appointment_reminder-{appointment.id}',
        task='appointments.tasks.send_appointment_reminder',
        args=json.dumps([appointment.id]),
        clocked=clocked,
        one_off=True
    )
