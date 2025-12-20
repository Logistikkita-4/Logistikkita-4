from rest_framework import serializers
from .models import NavigationMenu, MenuItem, SiteSetting, MediaFile

class MenuItemSerializer(serializers.ModelSerializer):
    """Serializer untuk MenuItem dengan nested children."""
    children = serializers.SerializerMethodField()
    
    class Meta:
        model = MenuItem
        fields = [
            'id',
            'title',
            'url',
            'icon',
            'is_external',
            'badge_text',
            'badge_color',
            'requires_auth',
            'description',
            'order_index',
            'children'
        ]
    
    def get_children(self, obj):
        """Get active children ordered by order_index."""
        children = obj.children.filter(is_active=True).order_by('order_index')
        if children.exists():
            return MenuItemSerializer(children, many=True).data
        return []

class NavigationMenuSerializer(serializers.ModelSerializer):
    """Serializer untuk NavigationMenu dengan items."""
    items = serializers.SerializerMethodField()
    
    class Meta:
        model = NavigationMenu
        fields = ['id', 'name', 'location', 'description', 'items']
    
    def get_items(self, obj):
        """Get root items (items without parent) yang aktif."""
        root_items = obj.items.filter(parent=None, is_active=True).order_by('order_index')
        return MenuItemSerializer(root_items, many=True).data

class SiteSettingSerializer(serializers.ModelSerializer):
    """Serializer untuk SiteSetting dengan parsed value."""
    parsed_value = serializers.SerializerMethodField()
    
    class Meta:
        model = SiteSetting
        fields = ['setting_key', 'setting_value', 'setting_type', 'category', 
                 'description', 'is_public', 'parsed_value']
    
    def get_parsed_value(self, obj):
        """Return parsed value berdasarkan type."""
        return obj.get_value()

class MediaFileSerializer(serializers.ModelSerializer):
    """Serializer untuk MediaFile."""
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = MediaFile
        fields = [
            'id', 'name', 'file_url', 'file_type', 'alt_text', 'caption',
            'width', 'height', 'category', 'tags', 'uploaded_at'
        ]
    
    def get_file_url(self, obj):
        """Get absolute file URL."""
        request = self.context.get('request')
        if request and obj.file:
            return request.build_absolute_uri(obj.file.url)
        return obj.file.url if obj.file else None

# Compact serializers untuk API response
class CompactNavigationSerializer(serializers.Serializer):
    """Compact serializer untuk frontend navigation data."""
    location = serializers.CharField()
    items = MenuItemSerializer(many=True)

class CompactSiteSettingsSerializer(serializers.Serializer):
    """Compact serializer untuk frontend site settings."""
    settings = serializers.DictField(child=SiteSettingSerializer())
