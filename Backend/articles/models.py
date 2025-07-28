from django.db import models
from authentication_app.models import CustomUser
from cloudinary.models import CloudinaryField


class Article(models.Model):
    STATUS_CHOICES = (
        ('draft','Draft'),
        ('published','Published'),
    )
    title = models.CharField(max_length=200)
    content = models.TextField()
    cover_image = CloudinaryField('cover_image',null=True,blank=True)
    category = models.CharField(max_length=100)
    author = models.ForeignKey(CustomUser,models.CASCADE,related_name='articles')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20,choices=STATUS_CHOICES,default='draft')
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title