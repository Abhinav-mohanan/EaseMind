from rest_framework import serializers
from .models import Article,Category,ArticleComment
from authentication_app.models import CustomUser
from django.utils.timesince import timesince
from django.utils import timezone
import re

class AuthorSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    specialization = serializers.SerializerMethodField()
    bio = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    

    class Meta:
        model = CustomUser
        fields = ['name','image_url','bio','specialization']

    def get_name(self,obj):
        return f'{obj.first_name} {obj.last_name}'
    
    def get_specialization(self,obj):
        if hasattr(obj,'psychologist_profile'):
            return obj.psychologist_profile.specialization
        return None
    
    def get_bio(self,obj):
        if hasattr(obj,'psychologist_profile'):
            return obj.psychologist_profile.bio
    
    def get_image_url(self,obj):
        if obj.profile_picture:
            return obj.profile_picture.url
        return None
    

class ArticleListSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    cover_image = serializers.SerializerMethodField()
    total_readers = serializers.IntegerField(read_only=True)
    likes = serializers.SerializerMethodField(read_only=True)
    is_liked = serializers.SerializerMethodField(read_only=True)
    category = serializers.SerializerMethodField()
    authorDetails = AuthorSerializer(source='author',read_only=True)

    class Meta: 
        model = Article
        fields = '__all__'
    
    
    def get_author_name(self,obj):
        first_name = obj.author.first_name or ''
        last_name = obj.author.last_name or ''
        return f'{first_name} {last_name}'
    
    def get_cover_image(self,obj):
        if obj.cover_image:
            return obj.cover_image.url
        return None
    
    def get_category(self,obj):
        if obj.category:
            return obj.category.name
        return None
    
    def get_likes(self,obj):
        if hasattr(obj,'likes'):
            return obj.likes.count()
        return None
    
    def get_is_liked(self,obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False


class ArticleCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ['title','content','cover_image','category','status']
    
    def validate(self, data):
        title = data.get('title')
        instance = getattr(self,'instance',None)
        if instance:
            if Article.objects.filter(title=title).exclude(id=instance.id).exists():
                raise serializers.ValidationError("Article with this title already exists.")
        else:
            if Article.objects.filter(title=title).exists():
                raise serializers.ValidationError("Article with this title already exists.")
        return data
    
    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return Article.objects.create(**validated_data)

class CategoryListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id','name','created_at']
        
class CategoryCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id','name','created_at']
    
    def validate(self,data):
        name = data.get('name','').strip()
        if len(name) == 0:
            raise serializers.ValidationError("Enter a valid category name")
        if not re.match(r'^[A-Za-z ]+$', name):
            raise serializers.ValidationError("Category name should contain only alphabets and spaces")
        if len(name) < 3 or len(name) >= 20:
            raise serializers.ValidationError("Category name must contain 3-20 characters")
        
        qs = Category.objects.filter(name__iexact=name)
        if self.instance:
            qs = qs.exclude(id=self.instance.id)
        
        if qs.exists():
            raise serializers.ValidationError("Category with this name already exists")
        
        data['name'] = name
        return data

class CommentSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    user_image = serializers.SerializerMethodField()
    time_ago = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()


    class Meta:
        model = ArticleComment
        fields = ['id','comment','user_name','user_image','time_ago','is_owner']
    
    def get_user_name(self,obj):
        return f'{obj.user.first_name} {obj.user.last_name}'
    
    def get_user_image(self,obj):
        if obj.user.profile_picture:
            return obj.user.profile_picture.url
        return None
    
    def get_time_ago(self,obj):
        now = timezone.now()
        time_str = timesince(obj.created_at,now).split(',')[0]
        return f'{time_str} ago'
    
    def get_is_owner(self, obj):
        request = self.context.get("request")
        return request.user.is_authenticated and request.user == obj.user

    