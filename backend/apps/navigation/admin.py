from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Count
from .models import NavigationMenu, MenuItem, SiteSetting, MediaFile
import json

@admin.register(NavigationMenu)
class NavigationMenuAdmin(admin.ModelAdmin):
    list_display = ['name', 'location', 'item_count', 'is_active', 'updated_at']
    list_filter = ['location', 'is_active', 'created_at']
    search_fields = ['name', 'description']
    list_editable = ['is_active']
    actions = ['activate_menus', 'deactivate_menus']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'location', 'description', 'is_active')
        }),
        ('Statistics', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    def item_count(self, obj):
        return obj.items.count()
    item_count.short_description = 'Items'
    item_count.admin_order_field = 'items_count'
    
    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.annotate(items_count=Count('items'))
    
    @admin.action(description="Activate selected menus")
    def activate_menus(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f"{updated} menu(s) activated.")
    
    @admin.action(description="Deactivate selected menus")
    def deactivate_menus(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f"{updated} menu(s) deactivated.")

@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ['title', 'menu_display', 'parent_display', 'url_display', 
                    'icon_display', 'order_index', 'is_active']
    list_filter = ['menu', 'is_active', 'is_external', 'requires_auth']
    search_fields = ['title', 'url', 'description']
    list_editable = ['order_index', 'is_active']
    autocomplete_fields = ['parent']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('menu', 'parent', 'title', 'url', 'description')
        }),
        ('Display Settings', {
            'fields': ('icon', 'order_index', 'is_external', 'requires_auth', 'is_active')
        }),
        ('Badge/Notification', {
            'fields': ('badge_text', 'badge_color'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    def menu_display(self, obj):
        return obj.menu.name if obj.menu else '-'
    menu_display.short_description = 'Menu'
    menu_display.admin_order_field = 'menu__name'
    
    def parent_display(self, obj):
        return obj.parent.title if obj.parent else '-'
    parent_display.short_description = 'Parent'
    
    def url_display(self, obj):
        if obj.is_external:
            return format_html('<a href="{}" target="_blank" title="External link">🔗 {}</a>', 
                             obj.full_url, obj.url[:50])
        else:
            return format_html('<code>{}</code>', obj.url[:50])
    url_display.short_description = 'URL'
    
    def icon_display(self, obj):
        if obj.icon:
            return format_html('<code>{}</code>', obj.icon)
        return '-'
    icon_display.short_description = 'Icon'
    
    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.select_related('menu', 'parent')

@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = ['setting_key', 'category', 'type_display', 'value_preview', 
                    'is_public', 'updated_at']
    list_filter = ['category', 'setting_type', 'is_public']
    search_fields = ['setting_key', 'setting_value', 'description']
    list_editable = ['is_public']
    
    fieldsets = (
        ('Setting Information', {
            'fields': ('setting_key', 'category', 'setting_type', 'description', 'is_public')
        }),
        ('Setting Value', {
            'fields': ('setting_value',),
            'classes': ('wide',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    def type_display(self, obj):
        type_map = {
            'string': '📝',
            'json': '🗂️',
            'color': '🎨',
            'image': '🖼️',
            'boolean': '✅',
            'number': '🔢',
            'email': '📧',
            'url': '🔗',
        }
        icon = type_map.get(obj.setting_type, '📌')
        return format_html('{} {}', icon, obj.get_setting_type_display())
    type_display.short_description = 'Type'
    
    def value_preview(self, obj):
        if obj.setting_type == 'color':
            return format_html(
                '<div style="display: flex; align-items: center; gap: 8px;">'
                '<div style="width: 20px; height: 20px; background-color: {}; border: 1px solid #ddd; border-radius: 3px;"></div>'
                '<code title="{}">{}</code>'
                '</div>',
                obj.setting_value, obj.setting_value, obj.setting_value
            )
        elif obj.setting_type == 'image':
            return format_html(
                '<a href="{}" target="_blank" style="display: flex; align-items: center; gap: 8px;">'
                '🖼️ <span style="color: #666;">{}</span>'
                '</a>',
                obj.setting_value, obj.setting_value.split('/')[-1][:30]
            )
        elif obj.setting_type == 'boolean':
            value = obj.get_value()
            return format_html(
                '<span style="padding: 2px 6px; border-radius: 3px; background-color: {}; color: {};">'
                '{}'
                '</span>',
                '#10B981' if value else '#EF4444',
                'white',
                '✓ True' if value else '✗ False'
            )
        elif obj.setting_type == 'json':
            try:
                parsed = json.loads(obj.setting_value)
                preview = json.dumps(parsed, indent=2)[:100]
                if len(obj.setting_value) > 100:
                    preview += '...'
                return format_html('<pre style="margin: 0; font-size: 11px; max-height: 60px; overflow: hidden;">{}</pre>', preview)
            except:
                preview = obj.setting_value[:100]
                if len(obj.setting_value) > 100:
                    preview += '...'
                return format_html('<code>{}</code>', preview)
        else:
            preview = obj.setting_value[:100]
            if len(obj.setting_value) > 100:
                preview += '...'
            return format_html('<code title="{}">{}</code>', obj.setting_value, preview)
    value_preview.short_description = 'Value'
    
    def formfield_for_dbfield(self, db_field, **kwargs):
        """Custom widget untuk field tertentu."""
        from django import forms
        
        if db_field.name == 'setting_value':
            kwargs['widget'] = forms.Textarea(attrs={'rows': 10, 'style': 'font-family: monospace;'})
        return super().formfield_for_dbfield(db_field, **kwargs)

@admin.register(MediaFile)
class MediaFileAdmin(admin.ModelAdmin):
    list_display = ['name', 'file_type', 'file_preview', 'file_size_display', 
                    'uploaded_at', 'uploaded_by']
    list_filter = ['file_type', 'category', 'uploaded_at']
    search_fields = ['name', 'alt_text', 'caption', 'tags']
    readonly_fields = ['file_size', 'uploaded_at', 'uploaded_by']
    
    fieldsets = (
        ('File Information', {
            'fields': ('name', 'file', 'file_type', 'category', 'tags')
        }),
        ('Image Details', {
            'fields': ('alt_text', 'caption', 'width', 'height'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('file_size', 'uploaded_by', 'uploaded_at'),
            'classes': ('collapse',)
        }),
    )
    
    def file_preview(self, obj):
        if obj.file_type in ['logo', 'favicon', 'banner', 'icon']:
            return format_html(
                '<a href="{}" target="_blank">'
                '<img src="{}" style="height: 40px; width: auto; border-radius: 4px; border: 1px solid #ddd;" />'
                '</a>',
                obj.file.url, obj.file.url
            )
        else:
            return format_html(
                '<a href="{}" target="_blank" style="color: #666;">📁 {}</a>',
                obj.file.url, obj.file.name.split('/')[-1][:30]
            )
    file_preview.short_description = 'Preview'
    
    def file_size_display(self, obj):
        if obj.file_size < 1024:
            return f"{obj.file_size} B"
        elif obj.file_size < 1024 * 1024:
            return f"{obj.file_size / 1024:.1f} KB"
        else:
            return f"{obj.file_size / (1024 * 1024):.1f} MB"
    file_size_display.short_description = 'Size'
    
    def save_model(self, request, obj, form, change):
        """Set uploaded_by ke user saat ini."""
        if not obj.pk:
            obj.uploaded_by = request.user
        super().save_model(request, obj, form, change)
