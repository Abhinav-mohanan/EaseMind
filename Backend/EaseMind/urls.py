from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/',include('authentication_app.urls')),
    path('api/',include('admin_app.urls')),
    path('api/',include('articles.urls')),
    path('api/',include('appointments.urls')),
    path('api/',include('wallet.urls')),
    path('api/',include('chat.urls')),
    path('api/',include('videocall.urls')),
    path('api/',include('prescription.urls')),
    path('api/',include('dashboard.urls')),
    
    
    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,document_root = settings.MEDIA_ROOT)
