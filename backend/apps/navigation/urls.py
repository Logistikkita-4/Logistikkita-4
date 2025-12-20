from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'nav-menus', views.NavigationMenuViewSet, basename='nav-menu')
router.register(r'site-settings', views.SiteSettingViewSet, basename='site-setting')
router.register(r'media-files', views.MediaFileViewSet, basename='media-file')

urlpatterns = [
    # Router URLs
    path('', include(router.urls)),
    
    # Additional endpoints
    path('config/', views.ConfigAPIView.as_view(), name='config'),
    
    # Health check
    path('health/', lambda request: JsonResponse({'status': 'healthy'}), name='health'),
]

# Helper function untuk JSON response
from django.http import JsonResponse
