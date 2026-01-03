from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny
from authentication_app.permissions import IsVerifiedAndUnblock
from authentication_app.permissions import IsAdmin
from .serializer import (ArticleListSerializer,ArticleCreateSerializer,CategoryListSerializer,
                         CategoryCreateSerializer,CommentSerializer)
from .models import (Article,ArticleRead,Category,ArticleLike,ArticleComment)
from .permissions import IsCommentOwner
from django.db.models import Q,Count
import logging
from django.db.models import F
# Create your views here.

logger = logging.getLogger(__name__)

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
            logger.warning(
                f'attempting to delete non-existent article {article_id}'
            )
            return Response({"error":"Article not found"},status=status.HTTP_404_NOT_FOUND)


class ArticleListView(APIView):
    permission_classes = [AllowAny]    
    def get(self,request):
        search_query = request.query_params.get('search')
        category = request.query_params.get('category')
        author = request.query_params.get('author')
        sort = request.query_params.get('sort')
        articles = Article.objects.filter(status='published')
        if search_query:
            articles = articles.filter(
                Q(title__icontains=search_query)|
                Q(content__icontains=search_query))
            
        if category and category != 'all':
            articles = articles.filter(category__name__iexact=category)
        
        if author:
            articles = articles.filter(
                Q(author__first_name__icontains=author) |
                Q(author__last_name__icontains=author)
            )
        
        if sort == 'oldest':
            articles = articles.order_by('created_at')
        else:
            articles = articles.order_by('-created_at')

        paginator = PageNumberPagination()
        page = paginator.paginate_queryset(articles,request)
        serializer = ArticleListSerializer(page,many=True,context={'request':request})
        return paginator.get_paginated_response(serializer.data)

class TopArticlesView(APIView):
    permission_classes = [AllowAny]
    def get(self,request):
        articles = Article.objects.filter(status='published'
                                          ).order_by('-total_reads').distinct()[:3]
        serializer = ArticleListSerializer(articles,many=True,context={'request':request})
        return Response(serializer.data)

class ArticleDetailView(APIView):
    permission_classes = [AllowAny]
    def get(self,request,article_id):
        try:
            article = Article.objects.get(id=article_id,status='published')
            user = request.user
            session_key = f'viewed_article_{article_id}'
            already_counted = False

            if user.is_authenticated:
                read_record,created = ArticleRead.objects.get_or_create(
                    user=user,article=article
                    )
                if not created:
                    already_counted = True
            else:
                if request.session.get(session_key):
                    already_counted = True
                else:
                    request.session[session_key] = True
            if not already_counted:
                Article.objects.filter(id=article_id).update(
                    total_reads=F('total_reads') + 1
                )
                article.refresh_from_db()
            serializer = ArticleListSerializer(article,context={'request':request})
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
            logger.warning(
                f'attempting to delete non-existent article {article_id}'
            )
            return Response({"error":"Article not found"},status=status.HTTP_404_NOT_FOUND)

class ArticleCategoryView(APIView):
    permission_classes = [IsAdmin]
    def get(self,request):
        categories = Category.objects.all().order_by('created_at')
        paginator = PageNumberPagination()
        page = paginator.paginate_queryset(categories,request)
        serializer = CategoryListSerializer(page,many=True)
        return paginator.get_paginated_response(serializer.data)
    
    def post(self,request):
        data = request.data
        serializer = CategoryCreateSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'message':"Category created sucessfully"},
                        status=status.HTTP_201_CREATED)
    
    def put(self,request,category_id):
        data = request.data
        category = Category.objects.get(id=category_id)
        serializer = CategoryCreateSerializer(category,data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message":"category updated successfully"},
                        status=status.HTTP_200_OK)
    
    def delete(self,request,category_id):
        category = Category.objects.get(id=category_id)
        category.delete()
        return Response({'message': 'Category deleted successfully'},
                        status=status.HTTP_200_OK)

class AllCategoriesView(APIView):
    permission_classes = [AllowAny]
    def get(self,request):
        categories = Category.objects.all().order_by('created_at')
        serializer = CategoryListSerializer(categories,many=True)
        return Response(serializer.data)

class LikeToggleView(APIView):
    def post(self,request,article_id):
        user = request.user
        try:
            article = Article.objects.get(id=article_id)
        except Article.DoesNotExist():
            return Response({"error":"Articles not found"},status=status.HTTP_404_NOT_FOUND)
        
        like_obj = ArticleLike.objects.filter(user=user,article=article)
        if like_obj.exists():
            like_obj.delete()
            is_liked = False
        else:
            ArticleLike.objects.create(user=user,article=article)
            is_liked = True
        likes = article.likes.count()
        return Response({'likes':likes,'is_liked':is_liked},status=status.HTTP_200_OK)

class ArticleCommentView(APIView):
    permission_classes = [AllowAny]
    def get(self,request,article_id):
        try:
            article = Article.objects.get(id=article_id)
        except Article.DoesNotExist:
            return Response({"error":"Article Not found"},status=status.HTTP_404_NOT_FOUND)
        
        comments = ArticleComment.objects.filter(article=article).order_by('-created_at')
        paginator = PageNumberPagination()
        page = paginator.paginate_queryset(comments,request)
        serializer = CommentSerializer(page,many=True,context={'request':request})
        return paginator.get_paginated_response(serializer.data)
    
    def post(self,request,article_id):
        user = request.user
        comment_text = request.data.get('comment','').strip()

        if not user.is_authenticated:
            return Response({"error":"Please login to post the comment"},
                            status=status.HTTP_401_UNAUTHORIZED)
        try:
            article = Article.objects.get(id=article_id,status='published')
        except Article.DoesNotExist:
            return Response({"error":"Article Not found"},status=status.HTTP_404_NOT_FOUND)
        
        if len(comment_text) < 1:
            return Response({"error":"Comment cannot be empty"},
                            status=status.HTTP_400_BAD_REQUEST)
        
        new_comment = ArticleComment.objects.create(
            user = user,
            article = article,
            comment = comment_text
        )
        
        return Response({'message':"Comment added sucessfully"},status=status.HTTP_201_CREATED)

class CommentDetaliView(APIView):
    permission_classes = [IsCommentOwner]

    def put(self,request,comment_id):
        try:
            comment = ArticleComment.objects.get(id=comment_id)
            self.check_object_permissions(request,comment)
            text = request.data.get('comment','').strip()
            if len(text) == 0:
                return Response({"error":"Comment cannot be empty"},
                                status=status.HTTP_400_BAD_REQUEST)
            comment.comment = text
            comment.save()
            return Response({"message":"Comment updated successfully"},status=status.HTTP_200_OK)
        except ArticleComment.DoesNotExist:
            return Response({"error":"Comment does not found"},
                            status=status.HTTP_404_NOT_FOUND)
        except Exception:
            logger.error(
                "Unexpected error while updating article comment",
                exc_info=True
            )
            return Response({
                "error":"Unexpected error occurred while updating the comment. Please try again later."
            },status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def delete(self,request,comment_id):
        try:
            comment = ArticleComment.objects.get(id=comment_id)
            self.check_object_permissions(request,comment)
            comment.delete()
            return Response({"message":"Comment deleted"},status=status.HTTP_200_OK)
        except ArticleComment.DoesNotExist:
            return Response({'error':"Comment not found"},
                            status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(
                "Unexpected error while deleting the article comment",
                exc_info=True
            )
            return Response({
                "error":'Unexpected error occurred while deleting the comment. Please try again later'
            },status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        