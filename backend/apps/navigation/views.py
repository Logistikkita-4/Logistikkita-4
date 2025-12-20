from django.core.cache import cache
from django.core.cache.backends.base import DEFAULT_TIMEOUT
from django.conf import settings
from django.db.models import Q
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView

from .models import NavigationMenu, MenuItem, SiteSetting, MediaFile
from .serializers import (
    NavigationMenuSerializer, 
    SiteSettingSerializer,
    MediaFileSerializer,
    CompactNavigationSerializer,
    CompactSiteSettingsSerializer
)

CACHE_TIMEOUT = getattr(settings, 'CACHE_TIMEOUT', {})

class NavigationMenuViewSet(viewsets.ViewSet):
    """
    ViewSet untuk handle navigation menu API requests.
    """
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def by_location(self, request):
        """
        Get navigation menu berdasarkan location.
        
        Parameters:
        - location: string (header, footer, sidebar, mobile)
        
        Returns:
        - Navigation data dengan nested structure
        """
        location = request.query_params.get('location', 'header')
        
        # Cache key
        cache_key = f'nav_menu_{location}'
        
        # Cek cache
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data)
        
        try:
            # Get active menu untuk location tersebut
            menu = NavigationMenu.objects.filter(
                location=location,
                is_active=True
            ).first()
            
            if not menu:
                return Response({
                    'location': location,
                    'items': []
                })
            
            # Serialize data
            serializer = NavigationMenuSerializer(menu)
            data = serializer.data
            
            # Cache data
            timeout = CACHE_TIMEOUT.get('navigation', 300)
            cache.set(cache_key, data, timeout)
            
            return Response(data)
            
        except Exception as e:
            return Response({
                'error': str(e),
                'location': location,
                'items': []
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def all(self, request):
        """
        Get semua navigation menus.
        
        Returns:
        - List semua active navigation menus
        """
        cache_key = 'nav_menu_all'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return Response(cached_data)
        
        try:
            menus = NavigationMenu.objects.filter(is_active=True).order_by('location', 'name')
            
            # Group by location
            result = {}
            for menu in menus:
                if menu.location not in result:
                    result[menu.location] = []
                
                serializer = NavigationMenuSerializer(menu)
                result[menu.location].append(serializer.data)
            
            # Cache data
            timeout = CACHE_TIMEOUT.get('navigation', 300)
            cache.set(cache_key, result, timeout)
            
            return Response(result)
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SiteSettingViewSet(viewsets.ViewSet):
    """
    ViewSet untuk handle site settings API requests.
    """
    permission_classes = [AllowAny]
    
    def list(self, request):
        """
        Get semua public site settings.
        
        Returns:
        - Dictionary dengan setting_key sebagai key
        """
        cache_key = 'site_settings_public'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return Response(cached_data)
        
        try:
            # Get semua public settings
            settings_qs = SiteSetting.objects.filter(is_public=True).order_by('category', 'setting_key')
            
            # Group by category
            result = {}
            for setting in settings_qs:
                category = setting.category
                if category not in result:
                    result[category] = {}
                
                result[category][setting.setting_key] = {
                    'value': setting.get_value(),
                    'type': setting.setting_type,
                    'description': setting.description
                }
            
            # Cache data
            timeout = CACHE_TIMEOUT.get('site_settings', 600)
            cache.set(cache_key, result, timeout)
            
            return Response(result)
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """
        Get site settings berdasarkan category.
        
        Parameters:
        - category: string (branding, colors, social, dll)
        
        Returns:
        - Dictionary dengan setting_key: value
        """
        category = request.query_params.get('category', 'branding')
        
        cache_key = f'site_settings_category_{category}'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return Response(cached_data)
        
        try:
            settings_qs = SiteSetting.objects.filter(
                category=category,
                is_public=True
            )
            
            result = {}
            for setting in settings_qs:
                result[setting.setting_key] = setting.get_value()
            
            # Cache data
            timeout = CACHE_TIMEOUT.get('site_settings', 600)
            cache.set(cache_key, result, timeout)
            
            return Response(result)
            
        except Exception as e:
            return Response({
                'error': str(e),
                'category': category
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def admin_all(self, request):
        """
        Get semua site settings (untuk admin).
        """
        try:
            settings_qs = SiteSetting.objects.all().order_by('category', 'setting_key')
            serializer = SiteSettingSerializer(settings_qs, many=True)
            return Response(serializer.data)
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MediaFileViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet untuk handle media files API requests.
    """
    queryset = MediaFile.objects.all()
    serializer_class = MediaFileSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        """Filter queryset berdasarkan file_type jika diberikan."""
        queryset = super().get_queryset()
        
        file_type = self.request.query_params.get('type')
        if file_type:
            queryset = queryset.filter(file_type=file_type)
        
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        
        return queryset.order_by('-uploaded_at')
    
    @action(detail=False, methods=['get'])
    def logos(self, request):
        """
        Get semua logo files.
        """
        cache_key = 'media_files_logos'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return Response(cached_data)
        
        try:
            logos = MediaFile.objects.filter(file_type='logo').order_by('-uploaded_at')
            serializer = self.get_serializer(logos, many=True)
            
            # Cache data
            cache.set(cache_key, serializer.data, 3600)  # 1 jam
            
            return Response(serializer.data)
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ConfigAPIView(APIView):
    """
    Single endpoint untuk semua config yang dibutuhkan frontend.
    """
    permission_classes = [AllowAny]
    
    def get(self, request):
        """
        Get semua config yang dibutuhkan untuk frontend initialization.
        
        Returns:
        - Navigation data
        - Site settings
        - Media files (logos)
        """
        location = request.query_params.get('nav_location', 'header')
        
        # Cache key untuk combined config
        cache_key = f'frontend_config_{location}'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return Response(cached_data)
        
        try:
            # Get navigation data
            menu = NavigationMenu.objects.filter(
                location=location,
                is_active=True
            ).first()
            
            nav_data = NavigationMenuSerializer(menu).data if menu else {'items': []}
            
            # Get site settings
            settings_qs = SiteSetting.objects.filter(is_public=True)
            settings_data = {}
            for setting in settings_qs:
                settings_data[setting.setting_key] = setting.get_value()
            
            # Get logos
            logos = MediaFile.objects.filter(file_type='logo').first()
            logo_data = MediaFileSerializer(logos, context={'request': request}).data if logos else None
            
            # Combine semua data
            result = {
                'navigation': nav_data,
                'settings': settings_data,
                'logo': logo_data,
                'timestamp': cache.get('config_timestamp')
            }
            
            # Cache data
            cache.set(cache_key, result, 300)  # 5 menit
            cache.set('config_timestamp', 'updated', 300)
            
            return Response(result)
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
