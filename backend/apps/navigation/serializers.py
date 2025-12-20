"""
Serializers untuk aplikasi Navigation.
File location: backend/apps/navigation/serializers.py
"""

from rest_framework import serializers
from .models import NavigationMenu, MenuItem, SiteSetting, MediaFile


class MenuItemSerializer(serializers.ModelSerializer):
    """Serializer untuk MenuItem dengan nested children."""
    children = serializers.SerializerMethodField()
    has_children = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = MenuItem
        fields = [
            'id',
            'title',
            'url',
            'full_url',
            'icon',
            'is_external',
            'is_active',
            'badge_text',
            'badge_color',
            'requires_auth',
            'description',
            'order_index',
            'has_children',
            'children'
        ]
        read_only_fields = ['full_url', 'has_children']
    
    def get_children(self, obj):
        """Get active children ordered by order_index."""
        children = obj.children.filter(is_active=True).order_by('order_index')
        if children.exists():
            return MenuItemSerializer(children, many=True, context=self.context).data
        return []


class NavigationMenuSerializer(serializers.ModelSerializer):
    """Serializer untuk NavigationMenu dengan items."""
    items = serializers.SerializerMethodField()
    location_display = serializers.CharField(source='get_location_display', read_only=True)
    
    class Meta:
        model = NavigationMenu
        fields = ['id', 'name', 'location', 'location_display', 'description', 
                 'is_active', 'created_at', 'items']
        read_only_fields = ['location_display', 'created_at']
    
    def get_items(self, obj):
        """Get root items (items without parent) yang aktif."""
        root_items = obj.items.filter(parent=None, is_active=True).order_by('order_index')
        return MenuItemSerializer(root_items, many=True, context=self.context).data


class SiteSettingSerializer(serializers.ModelSerializer):
    """Serializer untuk SiteSetting dengan parsed value."""
    parsed_value = serializers.SerializerMethodField()
    
    class Meta:
        model = SiteSetting
        fields = ['id', 'setting_key', 'setting_value', 'setting_type', 'category', 
                 'description', 'is_public', 'parsed_value', 'created_at', 'updated_at']
        read_only_fields = ['parsed_value', 'created_at', 'updated_at']
    
    def get_parsed_value(self, obj):
        """Return parsed value berdasarkan type."""
        return obj.get_value()


class MediaFileSerializer(serializers.ModelSerializer):
    """Serializer untuk MediaFile."""
    file_url = serializers.SerializerMethodField()
    file_type_display = serializers.CharField(source='get_file_type_display', read_only=True)
    
    class Meta:
        model = MediaFile
        fields = [
            'id', 'name', 'file_url', 'file_type', 'file_type_display', 
            'alt_text', 'caption', 'width', 'height', 'category', 
            'tags', 'uploaded_at', 'file_size', 'file_extension'
        ]
        read_only_fields = ['file_url', 'file_type_display', 'uploaded_at', 
                           'file_size', 'file_extension']
    
    def get_file_url(self, obj):
        """Get absolute file URL."""
        request = self.context.get('request')
        if request and obj.file:
            return request.build_absolute_uri(obj.file.url)
        return obj.file.url if obj.file else None


# Compact serializers untuk API response yang lebih kecil
class CompactMenuItemSerializer(serializers.ModelSerializer):
    """Compact serializer untuk menu item."""
    
    class Meta:
        model = MenuItem
        fields = ['id', 'title', 'url', 'icon', 'is_external', 'badge_text', 'order_index']


class CompactNavigationSerializer(serializers.ModelSerializer):
    """Compact serializer untuk frontend navigation data."""
    items = serializers.SerializerMethodField()
    
    class Meta:
        model = NavigationMenu
        fields = ['id', 'name', 'location', 'items']
    
    def get_items(self, obj):
        """Get only active root items tanpa children yang dalam."""
        root_items = obj.items.filter(parent=None, is_active=True).order_by('order_index')
        return CompactMenuItemSerializer(root_items, many=True).data


class CompactSiteSettingsSerializer(serializers.Serializer):
    """Compact serializer untuk frontend site settings."""
    settings = serializers.DictField(
        child=serializers.CharField(),
        help_text="Dictionary dengan key: value settings"
    )


# Untuk response khusus
class ConfigResponseSerializer(serializers.Serializer):
    """Serializer untuk /api/v1/config/ endpoint response."""
    navigation = NavigationMenuSerializer(allow_null=True)
    settings = serializers.DictField(child=serializers.JSONField())
    logo = MediaFileSerializer(allow_null=True)
    timestamp = serializers.CharField()
