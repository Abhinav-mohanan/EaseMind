from django.urls import path
from .views import (CreateArticleView,ArticleListView,ArticleDetailView,
                    ArticleAdminView,TopArticlesView,ArticleCategoryView,AllCategoriesView,
                    LikeToggleView,ArticleCommentView,CommentDetaliView)


urlpatterns = [
    path('articles/create/',CreateArticleView.as_view(),name='article-create'),
    path('articles/create/<int:article_id>/',CreateArticleView.as_view(),name='article-manage'),
    path('articles/',ArticleListView.as_view(),name='articles'),
    path('categories/',AllCategoriesView.as_view(),name='categories'),
    path('top-articles/',TopArticlesView.as_view(),name='articles'),
    path('articles/<int:article_id>/',ArticleDetailView.as_view(),name='article-details'),
    path('articles/<int:article_id>/comments/',ArticleCommentView.as_view(),name='article-comments'),
    path('comment/detail/<int:comment_id>/',CommentDetaliView.as_view(),name='comment-detail'),
    path('admin/articles/',ArticleAdminView.as_view(),name='admin-articles'),
    path('admin/article/<int:article_id>/',ArticleAdminView.as_view(),name='admin-article-manage'),
    path('articles/<int:article_id>/like/',LikeToggleView.as_view(),name='article-like-toggle'),
    path('admin/create/category/',ArticleCategoryView.as_view(),name='create-category'),
    path('admin/create/category/<int:category_id>/',ArticleCategoryView.as_view(),name='create-category'),


]