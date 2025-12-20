"""
Models untuk aplikasi Navigation.
File location: backend/apps/navigation/models.py
"""

from django.db import models
from django.core.validators import URLValidator
from django.contrib.auth import get_user_model  # Tambah ini
import json

# Get user model untuk foreign key
User = get_user_model()

class NavigationMenu(models.Model):
    """
    Model untuk menyimpan konfigurasi navigation menu.
    Bisa punya multiple menus: header, footer, sidebar.
    """
    LOCATION_CHOICES = [
        ('header', 'Header Navigation'),
        ('footer', 'Footer Navigation'),
        ('sidebar', 'Sidebar Navigation'),
        ('mobile', 'Mobile Navigation'),
    ]
    
    name = models.CharField(max_length=100, unique=True, help_text="Nama unik untuk menu ini")
    location = models.CharField(max_length=20, choices=LOCATION_CHOICES, default='header')
    description = models.TextField(blank=True, help_text="Deskripsi menu (optional)")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Navigation Menu'
        verbose_name_plural = 'Navigation Menus'
        ordering = ['location', 'name']
        indexes = [
            models.Index(fields=['location', 'is_active']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.get_location_display()})"
    
    def get_active_items(self):
        """Get semua active items untuk menu ini."""
        return self.items.filter(is_active=True).order_by('order_index')


class MenuItem(models.Model):
    """
    Model untuk item menu individual.
    Mendukung nested/hierarchical structure dengan parent-child relationship.
    """
    menu = models.ForeignKey(NavigationMenu, on_delete=models.CASCADE, 
                            related_name='items', null=True, blank=True)  # Tambah null=True
    
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, 
                              related_name='children')
    
    # Informasi dasar
    title = models.CharField(max_length=100, help_text="Teks yang ditampilkan di menu")
    url = models.CharField(max_length=500, validators=[URLValidator()], 
                          help_text="URL atau path (contoh: /about, https://example.com)")
    
    # Tampilan
    icon = models.CharField(max_length=50, blank=True, 
                           help_text="Nama icon dari React Icons (contoh: HiHome, HiTruck)")
    order_index = models.IntegerField(default=0, help_text="Urutan tampil di menu")
    
    # Status & visibility
    is_external = models.BooleanField(default=False, 
                                      help_text="Apakah link ke external website?")
    is_active = models.BooleanField(default=True)
    requires_auth = models.BooleanField(default=False, 
                                       help_text="Hanya tampil untuk user yang login")
    
    # Badge/notifikasi
    badge_text = models.CharField(max_length=20, blank=True, 
                                 help_text="Teks badge (contoh: New, Hot, Sale)")
    badge_color = models.CharField(max_length=7, blank=True, default='#EF4444',
                                  help_text="Warna badge dalam HEX (contoh: #FF0000)")
    
    # Metadata
    description = models.TextField(blank=True, help_text="Deskripsi untuk SEO atau tooltip")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Menu Item'
        verbose_name_plural = 'Menu Items'
        ordering = ['order_index', 'title']
        indexes = [
            models.Index(fields=['menu', 'parent', 'is_active']),
            models.Index(fields=['order_index']),
        ]
    
    def __str__(self):
        return f"{self.title} → {self.url}"
    
    @property
    def has_children(self):
        """Cek apakah menu item punya submenu."""
        return self.children.filter(is_active=True).exists()
    
    @property
    def full_url(self):
        """Generate full URL dengan protocol jika external."""
        if self.is_external and not self.url.startswith(('http://', 'https://')):
            return f"https://{self.url}"
        return self.url
    
    def get_descendants(self, include_self=False):
        """Get semua descendants item ini."""
        descendants = []
        if include_self:
            descendants.append(self)
        
        for child in self.children.filter(is_active=True).order_by('order_index'):
            descendants.append(child)
            descendants.extend(child.get_descendants())
        
        return descendants


class SiteSetting(models.Model):
    """
    Model untuk menyimpan semua site settings yang bisa diubah via admin.
    Digunakan untuk CMS-like configuration.
    """
    TYPE_CHOICES = [
        ('string', 'Text/String'),
        ('json', 'JSON Data'),
        ('color', 'Color (HEX/RGB)'),
        ('image', 'Image URL'),
        ('boolean', 'True/False'),
        ('number', 'Number'),
        ('email', 'Email Address'),
        ('url', 'URL/Link'),
    ]
    
    CATEGORY_CHOICES = [
        ('branding', 'Branding'),
        ('colors', 'Colors & Theme'),
        ('typography', 'Typography'),
        ('social', 'Social Media'),
        ('contact', 'Contact Information'),
        ('seo', 'SEO Settings'),
        ('general', 'General Settings'),
        ('security', 'Security'),
        ('performance', 'Performance'),
    ]
    
    setting_key = models.CharField(max_length=100, unique=True, 
                                  help_text="Key unik untuk setting (contoh: site_name, primary_color)")
    setting_value = models.TextField(help_text="Value dari setting", default="")
    setting_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='string')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='general')
    
    # Metadata
    description = models.TextField(blank=True, help_text="Deskripsi setting")
    is_public = models.BooleanField(default=True, 
                                   help_text="Apakah setting ini bisa diakses via public API?")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Site Setting'
        verbose_name_plural = 'Site Settings'
        ordering = ['category', 'setting_key']
        indexes = [
            models.Index(fields=['category', 'is_public']),
            models.Index(fields=['setting_key']),
        ]
    
    def __str__(self):
        return f"{self.setting_key} ({self.category})"
    
    def get_value(self):
        """Parse value berdasarkan type."""
        if not self.setting_value:
            return ""
            
        if self.setting_type == 'json':
            try:
                return json.loads(self.setting_value)
            except json.JSONDecodeError:
                return self.setting_value
        elif self.setting_type == 'boolean':
            return self.setting_value.lower() in ('true', '1', 'yes', 'on', 't')
        elif self.setting_type == 'number':
            try:
                if '.' in self.setting_value:
                    return float(self.setting_value)
                return int(self.setting_value)
            except ValueError:
                return self.setting_value
        elif self.setting_type == 'color' and not self.setting_value.startswith('#'):
            return f"#{self.setting_value}"
        else:
            return self.setting_value
    
    @classmethod
    def get_setting(cls, key, default=None):
        """Helper method untuk get setting value by key."""
        try:
            setting = cls.objects.get(setting_key=key)
            return setting.get_value()
        except cls.DoesNotExist:
            return default


class MediaFile(models.Model):
    """
    Model untuk menyimpan file upload (logo, favicon, images).
    """
    MEDIA_TYPES = [
        ('logo', 'Logo'),
        ('favicon', 'Favicon'),
        ('banner', 'Banner Image'),
        ('icon', 'Icon'),
        ('document', 'Document'),
        ('other', 'Other'),
    ]
    
    name = models.CharField(max_length=200, help_text="Nama file untuk referensi")
    file = models.FileField(upload_to='media/%Y/%m/%d/', help_text="Upload file")
    file_type = models.CharField(max_length=20, choices=MEDIA_TYPES, default='other')
    
    # Untuk images
    alt_text = models.CharField(max_length=200, blank=True, help_text="Alt text untuk accessibility")
    caption = models.TextField(blank=True)
    width = models.IntegerField(null=True, blank=True)
    height = models.IntegerField(null=True, blank=True)
    
    # Organization
    category = models.CharField(max_length=100, blank=True, help_text="Kategori untuk grouping")
    tags = models.CharField(max_length=500, blank=True, help_text="Tags dipisahkan koma")
    
    # Metadata
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    file_size = models.IntegerField(default=0, help_text="Size file dalam bytes")  # Tambah default
    
    class Meta:
        verbose_name = 'Media File'
        verbose_name_plural = 'Media Files'
        ordering = ['-uploaded_at']
        indexes = [
            models.Index(fields=['file_type', 'category']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.get_file_type_display()})"
    
    def save(self, *args, **kwargs):
        """Calculate file size saat save."""
        if self.file:
            try:
                self.file_size = self.file.size
            except:
                self.file_size = 0
        super().save(*args, **kwargs)
    
    @property
    def file_url(self):
        """Get file URL."""
        if self.file:
            return self.file.url
        return ""
    
    @property
    def file_extension(self):
        """Get file extension."""
        if self.file:
            return self.file.name.split('.')[-1].lower() if '.' in self.file.name else ""
        return ""
