from django.urls import path
from . views import (AdminLoginView,AdminUserManageView,ManagePsychologistView,PsychologistVerificationView,
                     )

urlpatterns = [
    path('admin/login/',AdminLoginView.as_view(),name='admin-login'),
    path('admin/user/details/',AdminUserManageView.as_view(),name='admin-user-details'),
    path('admin/user/manage/<int:user_id>/',AdminUserManageView.as_view(),name='admin-user-manage'),
    path('admin/psychologist/details/',ManagePsychologistView.as_view(),name='admin-psychologist-details'),
    path('admin/psychologist/manage/<int:psychologist_id>/',ManagePsychologistView.as_view(),name='admin-psychologist-manage'),
    path('admin/psychologist/verification/details/',PsychologistVerificationView.as_view(),name='psychologist-verification-details'),
    path('admin/psychologist/verification/<int:psychologist_id>/',PsychologistVerificationView.as_view(),name='admin-psychologist-verification'),
    
]