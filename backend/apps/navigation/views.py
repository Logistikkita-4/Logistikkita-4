"""
Views untuk aplikasi Navigation.
File location: backend/apps/navigation/views.py
"""

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

# Get cache timeout dari settings
CACHE_TIMEOUT = getattr(settings, 'CACHE_TIMEOUT', {})


class NavigationMenuViewSet(viewsets.ViewSet):
    """
    ViewSet untuk handle navigation menu API requests.
    
    Endpoints:
    - GET /api/v1/navigation/by_location/?location=header
    - GET /api/v1/navigation/all/
    """
    
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def by_location(self, request):
        """
        Get navigation menu berdasarkan location.
        
        Parameters:
        - location: string (header, footer, sidebar, mobile)
        
        Query Parameters:
        ?location=header (default: header)
        
        Returns:
        - Navigation data dengan nested structure
        """
        location = request.query_params.get('location', 'header')
        
        # Cache key untuk location tertentu
        cache_key = f'nav_menu_{location}'
        
        # Cek cache terlebih dahulu
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data)
        
        try:
            # Get active menu untuk location tersebut
            menu = NavigationMenu.objects.filter(
                location=location,
                is_active=True
            ).first()
            
            # Jika menu tidak ditemukan, return empty structure
            if not menu:
                return Response({
                    'location': location,
                    'items': []
                })
            
            # Serialize data
            serializer = NavigationMenuSerializer(menu)
            data = serializer.data
            
            # Cache data dengan timeout dari settings
            timeout = CACHE_TIMEOUT.get('navigation', 300)  # Default 5 menit
            cache.set(cache_key, data, timeout)
            
            return Response(data)
            
        except Exception as e:
            # Error handling
            return Response({
                'error': str(e),
                'location': location,
                'items': []
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def all(self, request):
        """
        Get semua navigation menus.
        
        Endpoint: GET /api/v1/navigation/all/
        
        Returns:
        - List semua active navigation menus dikelompokkan berdasarkan location
        """
        cache_key = 'nav_menu_all'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return Response(cached_data)
        
        try:
            # Get semua active menus, diurutkan berdasarkan location dan name
            menus = NavigationMenu.objects.filter(is_active=True).order_by('location', 'name')
            
            # Group by location
            result = {}
            for menu in menus:
                if menu.location not in result:
                    result[menu.location] = []
                
                serializer = NavigationMenuSerializer(menu)
                result[menu.location].append(serializer.data)
            
            # Cache data
            timeout = CACHE_TIMEOUT.get('navigation', 300)  # Default 5 menit
            cache.set(cache_key, result, timeout)
            
            return Response(result)
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SiteSettingViewSet(viewsets.ViewSet):
    """
    ViewSet untuk handle site settings API requests.
    
    Endpoints:
    - GET /api/v1/settings/ (semua settings public)
    - GET /api/v1/settings/by_category/?category=branding
    - GET /api/v1/settings/admin_all/ (hanya authenticated users)
    """
    
    permission_classes = [AllowAny]
    
    def list(self, request):
        """
        Get semua public site settings.
        
        Endpoint: GET /api/v1/settings/
        
        Returns:
        - Dictionary dengan setting_key sebagai key, dikelompokkan berdasarkan category
        """
        cache_key = 'site_settings_public'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return Response(cached_data)
        
        try:
            # Get semua public settings, diurutkan berdasarkan category dan key
            settings_qs = SiteSetting.objects.filter(is_public=True).order_by('category', 'setting_key')
            
            # Group by category
            result = {}
            for setting in settings_qs:
                category = setting.category
                if category not in result:
                    result[category] = {}
                
                # Tambah data setting dengan tipe dan deskripsi
                result[category][setting.setting_key] = {
                    'value': setting.get_value(),
                    'type': setting.setting_type,
                    'description': setting.description
                }
            
            # Cache data
            timeout = CACHE_TIMEOUT.get('site_settings', 600)  # Default 10 menit
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
        
        Query Parameters:
        ?category=branding (default: branding)
        
        Returns:
        - Dictionary dengan setting_key: value
        """
        category = request.query_params.get('category', 'branding')
        
        cache_key = f'site_settings_category_{category}'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return Response(cached_data)
        
        try:
            # Get settings untuk category tertentu
            settings_qs = SiteSetting.objects.filter(
                category=category,
                is_public=True
            )
            
            # Format sebagai dictionary sederhana
            result = {}
            for setting in settings_qs:
                result[setting.setting_key] = setting.get_value()
            
            # Cache data
            timeout = CACHE_TIMEOUT.get('site_settings', 600)  # Default 10 menit
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
        
        Endpoint: GET /api/v1/settings/admin_all/
        Permission: Hanya untuk authenticated users
        
        Returns:
        - Semua settings termasuk yang tidak public
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
    
    Endpoints:
    - GET /api/v1/media/ (semua media files)
    - GET /api/v1/media/logos/ (hanya logo files)
    """
    
    queryset = MediaFile.objects.all()
    serializer_class = MediaFileSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        """
        Filter queryset berdasarkan parameter query.
        
        Query Parameters:
        - ?type=logo (filter by file_type)
        - ?category=main (filter by category)
        """
        queryset = super().get_queryset()
        
        # Filter by file_type jika diberikan
        file_type = self.request.query_params.get('type')
        if file_type:
            queryset = queryset.filter(file_type=file_type)
        
        # Filter by category jika diberikan
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        
        # Urutkan berdasarkan upload terbaru
        return queryset.order_by('-uploaded_at')
    
    @action(detail=False, methods=['get'])
    def logos(self, request):
        """
        Get semua logo files.
        
        Endpoint: GET /api/v1/media/logos/
        
        Returns:
        - List semua file dengan type='logo'
        """
        cache_key = 'media_files_logos'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return Response(cached_data)
        
        try:
            # Get semua logo files
            logos = MediaFile.objects.filter(file_type='logo').order_by('-uploaded_at')
            serializer = self.get_serializer(logos, many=True)
            
            # Cache data untuk 1 jam
            cache.set(cache_key, serializer.data, 3600)
            
            return Response(serializer.data)
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ConfigAPIView(APIView):
    """
    Single endpoint untuk semua config yang dibutuhkan frontend.
    
    Endpoint: GET /api/v1/config/
    
    Digunakan untuk frontend initialization agar hanya perlu 1 API call.
    """
    
    permission_classes = [AllowAny]
    
    def get(self, request):
        """
        Get semua config yang dibutuhkan untuk frontend initialization.
        
        Query Parameters:
        - nav_location: string (default: header)
        
        Returns:
        - Navigation data
        - Site settings (semua public settings)
        - Logo data
        - Timestamp
        """
        location = request.query_params.get('nav_location', 'header')
        
        # Cache key untuk combined config
        cache_key = f'frontend_config_{location}'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return Response(cached_data)
        
        try:
            # Get navigation data berdasarkan location
            menu = NavigationMenu.objects.filter(
                location=location,
                is_active=True
            ).first()
            
            # Serialize navigation data
            nav_data = NavigationMenuSerializer(menu).data if menu else {'items': []}
            
            # Get semua public site settings
            settings_qs = SiteSetting.objects.filter(is_public=True)
            settings_data = {}
            for setting in settings_qs:
                # Format sederhana: key -> value
                settings_data[setting.setting_key] = setting.get_value()
            
            # Get logo utama (yang pertama)
            logos = MediaFile.objects.filter(file_type='logo').first()
            logo_data = MediaFileSerializer(logos, context={'request': request}).data if logos else None
            
            # Combine semua data menjadi satu response
            result = {
                'navigation': nav_data,
                'settings': settings_data,
                'logo': logo_data,
                'timestamp': cache.get('config_timestamp') or 'initial'
            }
            
            # Cache data untuk 5 menit
            cache.set(cache_key, result, 300)
            cache.set('config_timestamp', 'updated', 300)
            
            return Response(result)
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Tambahan untuk API endpoints yang mungkin dibutuhkan
class CompactConfigAPIView(APIView):
    """
    Compact version dari config API untuk kebutuhan minimal.
    
    Endpoint: GET /api/v1/config/compact/
    """
    
    permission_classes = [AllowAny]
    
    def get(self, request):
        """
        Get compact config data.
        
        Returns:
        - Navigation data (compact)
        - Essential site settings
        """
        try:
            # Get main navigation
            menu = NavigationMenu.objects.filter(
                location='header',
                is_active=True
            ).first()
            
            # Compact navigation serializer jika ada
            nav_data = CompactNavigationSerializer(menu).data if menu else {'items': []}
            
            # Get essential settings
            essential_settings = SiteSetting.objects.filter(
                is_public=True,
                category__in=['branding', 'general']
            )
            
            settings_data = {}
            for setting in essential_settings:
                settings_data[setting.setting_key] = setting.get_value()
            
            return Response({
                'navigation': nav_data,
                'settings': settings_data
            })
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Health check endpoint
class HealthCheckView(APIView):
    """
    Endpoint untuk health check aplikasi.
    
    Endpoint: GET /api/v1/health/
    """
    
    permission_classes = [AllowAny]
    
    def get(self, request):
        """
        Simple health check endpoint.
        
        Returns:
        - Status aplikasi
        - Database connection status
        """
        try:
            # Cek koneksi database
            from django.db import connection
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
            
            # Cek cache
            cache.set('health_check', 'ok', 10)
            cache_status = cache.get('health_check') == 'ok'
            
            return Response({
                'status': 'healthy',
                'database': 'connected',
                'cache': 'working' if cache_status else 'not_working',
                'timestamp': 'server_time_here'
            })
            
        except Exception as e:
            return Response({
                'status': 'unhealthy',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
