from django.urls import path
from .views import (CreateArticleView,ArticleListView,ArticleDetailView,ArticleAdminView)


urlpatterns = [
    path('articles/create/',CreateArticleView.as_view(),name='article-create'),
    path('articles/create/<int:article_id>/',CreateArticleView.as_view(),name='article-manage'),
    path('articles/',ArticleListView.as_view(),name='articles'),
    path('articles/<int:article_id>/',ArticleDetailView.as_view(),name='article-details'),
    path('admin/articles/',ArticleAdminView.as_view(),name='admin-articles'),
    path('admin/article/<int:article_id>/',ArticleAdminView.as_view(),name='admin-article-manage')

]