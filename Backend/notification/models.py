from django.db import models
from authentication_app.models import CustomUser

# Create your models here.

class Notification(models.Model):
    user = models.ForeignKey(CustomUser,on_delete=models.CASCADE,related_name='notifications')
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    notification_type = models.CharField(max_length=50,
        choices=[
            ('INFO', 'Information'),
            ('WARNING', 'Warning'),
            ('ERROR', 'Error'),
            ('SUCCESS', 'Success')
        ],
        default='INFO'
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.email} : {self.message}'
    
