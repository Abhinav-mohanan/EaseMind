from rest_framework import serializers


class AdminDashboardStatsSerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    total_psychologists = serializers.IntegerField()
    total_appointments = serializers.IntegerField()
    total_cancelled_appointments = serializers.IntegerField()
    total_completed_appointments = serializers.IntegerField()
    total_appointment_amount = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_pending_payments = serializers.DecimalField(max_digits=10, decimal_places=2)


class AppointmentStatsSerializer(serializers.Serializer):
    status = serializers.CharField()
    count = serializers.IntegerField()
    percentage = serializers.FloatField()


class AdminDashboardSerializer(serializers.Serializer):
    stats = AdminDashboardStatsSerializer()
    appointment_stats = AppointmentStatsSerializer(many=True)
