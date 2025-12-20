"""
URL configuration untuk config project.
File location: backend/config/urls.py
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Admin site
    path('admin/', admin.site.urls),
    
    # API endpoints - Navigation app saja dulu
    path('api/v1/navigation/', include('apps.navigation.urls')),
    
    # Authentication (JWT) - COMMENT/HAPUS DULU
    # path('api/v1/auth/', include('rest_framework_simplejwt.urls')),
]

# Serve static and media files in development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    
    # Debug toolbar
    try:
        import debug_toolbar
        urlpatterns = [
            path('__debug__/', include(debug_toolbar.urls)),
        ] + urlpatterns
        print("✅ Debug toolbar enabled")
    except ImportError:
        print("⚠️  Debug toolbar not installed")
        pass

# Comment error handlers dulu jika belum ada
# handler404 = 'config.views.custom_404'
# handler500 = 'config.views.custom_500'
