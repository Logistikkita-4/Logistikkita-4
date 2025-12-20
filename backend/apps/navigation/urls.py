"""
URL Configuration untuk aplikasi Navigation.
File location: backend/apps/navigation/urls.py
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from django.http import JsonResponse

# Helper function untuk JSON response
def health_check(request):
    """Simple health check endpoint."""
    return JsonResponse({'status': 'healthy', 'service': 'navigation'})

# Create router instance
router = DefaultRouter()

# Register ViewSets - Hapus dulu karena menggunakan @action decorator
# router.register(r'nav-menus', views.NavigationMenuViewSet, basename='nav-menu')
# router.register(r'site-settings', views.SiteSettingViewSet, basename='site-setting')
# router.register(r'media-files', views.MediaFileViewSet, basename='media-file')

# URL patterns untuk navigation app
urlpatterns = [
    # Navigation endpoints
    path('by_location/', views.NavigationMenuViewSet.as_view({'get': 'by_location'}), 
         name='navigation-by-location'),
    path('all/', views.NavigationMenuViewSet.as_view({'get': 'all'}), 
         name='navigation-all'),
    
    # Settings endpoints
    path('settings/', views.SiteSettingViewSet.as_view({'get': 'list'}), 
         name='settings-list'),
    path('settings/by_category/', views.SiteSettingViewSet.as_view({'get': 'by_category'}), 
         name='settings-by-category'),
    path('settings/admin_all/', views.SiteSettingViewSet.as_view({'get': 'admin_all'}), 
         name='settings-admin-all'),
    
    # Media endpoints
    path('media/', views.MediaFileViewSet.as_view({'get': 'list'}), 
         name='media-list'),
    path('media/logos/', views.MediaFileViewSet.as_view({'get': 'logos'}), 
         name='media-logos'),
    
    # Config endpoints
    path('config/', views.ConfigAPIView.as_view(), name='config'),
    path('config/compact/', views.CompactConfigAPIView.as_view(), name='config-compact'),
    
    # Health check
    path('health/', views.HealthCheckView.as_view(), name='health'),
    path('health/simple/', health_check, name='health-simple'),
]

# Alternatif: Jika mau pakai router (uncomment jika perlu)
"""
urlpatterns = [
    path('', include(router.urls)),
    path('config/', views.ConfigAPIView.as_view(), name='config'),
    path('health/', health_check, name='health'),
]
"""
