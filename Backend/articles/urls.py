from django.urls import path
from . views import (CreateArticleView)


urlpatterns = [
    path('articles/create/',CreateArticleView.as_view(),name='article-create'),
    path('articles/<int:article_id>/',CreateArticleView.as_view(),name='article-manage')
]