# backend/config/urls.py


"""
URL configuration for config project.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Admin site
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/v1/', include([
        # Navigation app
        path('navigation/', include('apps.navigation.urls')),
        
        # Authentication (JWT)
        path('auth/', include('rest_framework_simplejwt.urls')),
    ])),
    
    # Root API view
    path('api/', include('rest_framework.urls', namespace='rest_framework')),
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
    except ImportError:
        # Debug toolbar not installed
        pass

# Error handlers
handler404 = 'config.views.custom_404'
handler500 = 'config.views.custom_500'

# ============ OPSIONAL: Buat file views.py untuk error handlers ============
# Jika mau tambah custom error pages, buat file config/views.py:
"""
from django.shortcuts import render

def custom_404(request, exception):
    return render(request, '404.html', status=404)

def custom_500(request):
    return render(request, '500.html', status=500)
"""
