from rest_framework import serializers
from .models import Article

class ArticleListSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    cover_image = serializers.SerializerMethodField()
    total_readers = serializers.IntegerField(read_only=True)

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