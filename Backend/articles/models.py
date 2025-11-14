from django.db import models
from authentication_app.models import CustomUser
from cloudinary.models import CloudinaryField


class Category(models.Model):
    name = models.CharField(max_length=100,unique=True)
    created_at = models.DateTimeField(auto_now_add=True,null=True)

    def __str__(self):
        return self.name


class Article(models.Model):
    STATUS_CHOICES = (
        ('draft','Draft'),
        ('published','Published'),
    )
    title = models.CharField(max_length=200)
    content = models.TextField()
    cover_image = CloudinaryField('cover_image',null=True,blank=True)
    category = models.ForeignKey(Category,on_delete=models.SET_NULL,null=True,related_name='articles')
    author = models.ForeignKey(CustomUser,models.CASCADE,related_name='articles')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20,choices=STATUS_CHOICES,default='draft')
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title

class ArticleRead(models.Model):
    user = models.ForeignKey(CustomUser,on_delete=models.CASCADE,related_name='read_articles')
    article = models.ForeignKey(Article,on_delete=models.CASCADE,related_name='reads')
    read_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user','article')

class ArticleLike(models.Model):
    user = models.ForeignKey(CustomUser,on_delete=models.CASCADE,related_name='liked_articles')
    article = models.ForeignKey(Article,on_delete=models.CASCADE,related_name='likes')
    liked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user','article')

class ArticleComment(models.Model):
    user = models.ForeignKey(CustomUser,on_delete=models.CASCADE,related_name='comments')
    article = models.ForeignKey(Article,on_delete=models.CASCADE,related_name='comments')
    comment = models.TextField()
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
