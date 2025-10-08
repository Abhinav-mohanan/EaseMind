from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from authentication_app.models import CustomUser,PsychologistProfile
from authentication_app.permissions import IsAdmin
from appointments.models import Appointment,Payment
from wallet.models import Wallet
from django.db.models import Sum,Count,Q
from .serializer import AdminDashboardSerializer
import logging

logger = logging.getLogger(__name__)

class AdminDashboardView(APIView):
    permission_classes = [IsAdmin]
    def get(self,request):
        try:
            stats = self.get_dashboard_stats()
            appointment_stats = self.get_appointment_stats()
            dashboard_data = {
                'stats':stats,
                'appointment_stats':appointment_stats,
            }
            serializer = AdminDashboardSerializer(data=dashboard_data)
            serializer.is_valid(raise_exception=True)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f'Error while load the dashboard : {str(e)}')
            return Response({"error":"An error occured while load dashboard"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get_dashboard_stats(self):
        total_users = CustomUser.objects.filter(role='user',is_blocked=False).count()
        total_psychologists = PsychologistProfile.objects.filter(user__role='psychologist',user__is_blocked=False,is_verified='verified').count()
        total_appointments = Appointment.objects.count()
        total_cancelled_appointments = Appointment.objects.filter(status='cancelled').count()
        total_completed_appointments = Appointment.objects.filter(status='completed').count()
        total_appointment_amount = Payment.objects.filter(
            appointment__status='completed').aggregate(total_appointment_amount=Sum('amount'))['total_appointment_amount'] or 0
        admin_wallet = Wallet.objects.filter(is_admin_wallet=True).first()
        total_revenue = admin_wallet.balance if admin_wallet else 0
        total_pending_payments = admin_wallet.locked_balance if admin_wallet else 0
        return {
            'total_users': total_users,
            'total_psychologists': total_psychologists,
            'total_appointments': total_appointments,
            'total_cancelled_appointments': total_cancelled_appointments,
            'total_revenue': float(total_revenue),
            'total_pending_payments': float(total_pending_payments),
            'total_completed_appointments':total_completed_appointments,
            'total_appointment_amount':total_appointment_amount
        }
    
    def get_appointment_stats(self):
        stats_data = Appointment.objects.aggregate(
            booked=Count('id',filter=Q(status='booked')),
            completed=Count('id',filter=Q(status='completed')),
            cancelled=Count('id',filter=Q(status='cancelled'))
        )
        
        total=sum(stats_data.values())
        appointment_stats = []
        for status_name,count in stats_data.items():
            if count > 0:
                percentage = (count / total * 100) if total > 0 else 0
                appointment_stats.append({
                    'status':status_name.title(),
                    'count':count,
                    'percentage':round(percentage,1)
                })
        return appointment_stats
