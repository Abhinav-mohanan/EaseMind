from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from rest_framework import status
from authentication_app.permissions import IsVerifiedAndUnblock
from authentication_app.permissions import IsAdmin
from .serializer import ArticleListSerializer,ArticleCreateSerializer
from .models import Article,ArticleRead
from django.db.models import Q,Count
# Create your views here.

class CreateArticleView(APIView):
    permission_classes = [IsVerifiedAndUnblock]

    def get(self,request):
        user = request.user
        search = request.query_params.get('search')
        status_filter = request.query_params.get('status')
        articles = Article.objects.filter(author=user).order_by('-created_at')
        if search:
            articles = articles.filter(
                Q(title__icontains=search) | 
                Q(content__icontains=search))
        
        if status_filter and status_filter != 'all':
            articles = articles.filter(status=status_filter)
        paginator = PageNumberPagination()
        page = paginator.paginate_queryset(articles,request)
        seralizer = ArticleListSerializer(page,many=True)
        return paginator.get_paginated_response(seralizer.data)
    
    def post(self,request):
        data = request.data
        seralizer = ArticleCreateSerializer(data=data,context={'request':request})
        if seralizer.is_valid():
            seralizer.save()
            return Response(seralizer.data,status=status.HTTP_201_CREATED)
        return Response(seralizer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def put(self,request,article_id):
        user = request.user
        try:
            article = Article.objects.get(id=article_id,author=user)
        except Article.DoesNotExist:
            return Response({"error":"Article not found"},status=status.HTTP_404_NOT_FOUND)
        serializer = ArticleCreateSerializer(article,data=request.data,partial=True,context={'request':request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request,article_id):
        user = request.user
        try:
            article = Article.objects.get(id=article_id,author=user)
            article.delete()
            return Response({"message":"Article deleted successfully"},status=status.HTTP_200_OK)
        except Article.DoesNotExist:
            return Response({"error":"Article not found"},status=status.HTTP_404_NOT_FOUND)


class ArticleListView(APIView):    
    def get(self,request):
        search_query = request.query_params.get('search')
        articles = Article.objects.filter(status='published').annotate(total_readers=Count('reads'))
        if search_query:
            articles = articles.filter(
                Q(title__icontains=search_query)|
                Q(content__icontains=search_query))
        paginator = PageNumberPagination()
        page = paginator.paginate_queryset(articles,request)
        serializer = ArticleListSerializer(page,many=True)
        return paginator.get_paginated_response(serializer.data)

class ArticleDetailView(APIView):
    def get(self,request,article_id):
        user = request.user
        try:
            article = Article.objects.annotate(total_readers=Count('reads')).get(id=article_id,status='published')
            if user.is_authenticated:
                ArticleRead.objects.get_or_create(user=user,article=article)
            serializer = ArticleListSerializer(article)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error":"Article Not found"},status=status.HTTP_404_NOT_FOUND)

class ArticleAdminView(APIView):
    permission_classes = [IsAdmin]

    def get(self,request):
        search_query = request.query_params.get('search')
        articles = Article.objects.filter(status='published')
        if search_query:
            articles = articles.filter(
                Q(title__icontains=search_query) |
                Q(content__icontains=search_query) 
            )
        paginator = PageNumberPagination()
        page = paginator.paginate_queryset(articles,request)
        serializer = ArticleListSerializer(page,many=True)
        return paginator.get_paginated_response(serializer.data)
    
    def delete(self,request,article_id):    
        try:
            article = Article.objects.get(id=article_id)
            article.delete()
            return Response({"message":"Article deleted Successfully"},status=status.HTTP_200_OK)
        except Article.DoesNotExist:
            return Response({"error":"Article not found"},status=status.HTTP_404_NOT_FOUND)