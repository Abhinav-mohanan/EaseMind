from django.urls import path
from . views import (AdminLoginView,AdminUserManageView)

urlpatterns = [
    path('admin/login/',AdminLoginView.as_view(),name='admin-login'),
    path('admin/user/details/',AdminUserManageView.as_view(),name='admin-user-details'),
    path('admin/user/manage/<int:user_id>/',AdminUserManageView.as_view(),name='admin-user-manage'),
    
]