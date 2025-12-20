from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from apps.navigation.models import NavigationMenu, MenuItem, SiteSetting, MediaFile
import json

class Command(BaseCommand):
    help = 'Seed initial data untuk navigation dan site settings'
    
    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding initial data...')
        
        # 1. Create superuser jika belum ada
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@logistikkita.com',
                password='admin123'
            )
            self.stdout.write(self.style.SUCCESS('Created superuser: admin/admin123'))
        
        # 2. Create Navigation Menu (Header)
        header_menu, created = NavigationMenu.objects.get_or_create(
            name='main-navigation',
            defaults={
                'location': 'header',
                'description': 'Main navigation menu untuk header website',
                'is_active': True
            }
        )
        
        if created:
            self.stdout.write('Created main navigation menu')
            
            # Menu structure sesuai permintaan
            menu_structure = [
                {
                    'title': 'Beranda',
                    'url': '/',
                    'icon': 'HiHome',
                    'order_index': 1,
                },
                {
                    'title': 'Layanan & Armada',
                    'url': '#',
                    'icon': 'HiTruck',
                    'order_index': 2,
                    'children': [
                        {'title': 'Kapasitas Armada', 'url': '/maintenance', 'icon': 'HiCube', 'order_index': 1},
                        {'title': 'Jangkauan Pengiriman', 'url': '/maintenance', 'icon': 'HiMap', 'order_index': 2},
                        {'title': 'Prosedur Keamanan', 'url': '/maintenance', 'icon': 'HiShieldCheck', 'order_index': 3},
                        {'title': 'Simulasi Harga Estimasi', 'url': '/simulasi-harga', 'icon': 'HiCalculator', 'order_index': 4},
                        {'title': 'Jenis Layanan', 'url': '/maintenance', 'icon': 'HiClipboardList', 'order_index': 5},
                    ]
                },
                {
                    'title': 'Galeri & Portofolio',
                    'url': '#',
                    'icon': 'HiPhotograph',
                    'order_index': 3,
                    'children': [
                        {'title': 'Dokumentasi Pengiriman', 'url': '/maintenance', 'icon': 'HiCamera', 'order_index': 1},
                        {'title': 'Kisah Sukses Lokal', 'url': '/maintenance', 'icon': 'HiStar', 'order_index': 2},
                        {'title': 'Testimoni Klien', 'url': '/maintenance', 'icon': 'HiChatAlt2', 'order_index': 3},
                    ]
                },
                {
                    'title': 'Tentang Kami',
                    'url': '#',
                    'icon': 'HiInformationCircle',
                    'order_index': 4,
                    'children': [
                        {'title': 'Visi, Misi, & Nilai', 'url': '/maintenance', 'icon': 'HiEye', 'order_index': 1},
                        {'title': 'Profil & Legalitas', 'url': '/maintenance', 'icon': 'HiDocumentText', 'order_index': 2},
                        {'title': 'Penanganan Risiko', 'url': '/maintenance', 'icon': 'HiExclamation', 'order_index': 3},
                    ]
                },
                {
                    'title': 'Hubungi Kami',
                    'url': '#',
                    'icon': 'HiPhone',
                    'order_index': 5,
                    'children': [
                        {'title': 'Lacak Resi (Tracking)', 'url': '/maintenance', 'icon': 'HiSearch', 'order_index': 1},
                        {'title': 'Formulir RFQ', 'url': '/maintenance', 'icon': 'HiClipboard', 'order_index': 2},
                        {'title': 'Informasi Kontak', 'url': '/maintenance', 'icon': 'HiMail', 'order_index': 3},
                        {'title': 'Lokasi Kantor', 'url': '/maintenance', 'icon': 'HiLocationMarker', 'order_index': 4},
                    ]
                },
                {
                    'title': 'Blog / Berita',
                    'url': '#',
                    'icon': 'HiNewspaper',
                    'order_index': 6,
                    'children': [
                        {'title': 'Berita Terbaru', 'url': '/maintenance', 'icon': 'HiFire', 'order_index': 1},
                        {'title': 'Tips Logistik', 'url': '/maintenance', 'icon': 'HiLightBulb', 'order_index': 2},
                    ]
                },
            ]
            
            # Create menu items
            for item_data in menu_structure:
                children = item_data.pop('children', [])
                
                parent_item = MenuItem.objects.create(
                    menu=header_menu,
                    **item_data
                )
                
                for child_data in children:
                    MenuItem.objects.create(
                        menu=header_menu,
                        parent=parent_item,
                        **child_data
                    )
            
            self.stdout.write('Created menu items')
        
        # 3. Create Footer Menu
        footer_menu, created = NavigationMenu.objects.get_or_create(
            name='footer-navigation',
            defaults={
                'location': 'footer',
                'description': 'Footer navigation menu',
                'is_active': True
            }
        )
        
        if created:
            self.stdout.write('Created footer navigation menu')
        
        # 4. Create Site Settings
        default_settings = [
            # Branding
            {'key': 'site_name', 'value': 'LOGISTIK KITA', 'type': 'string', 'category': 'branding'},
            {'key': 'site_slogan', 'value': 'Expedition & Logistics Solutions', 'type': 'string', 'category': 'branding'},
            {'key': 'site_description', 'value': 'Partner terpercaya untuk semua kebutuhan pengiriman di seluruh Indonesia', 'type': 'string', 'category': 'branding'},
            
            # Colors
            {'key': 'primary_color', 'value': '#3B82F6', 'type': 'color', 'category': 'colors'},
            {'key': 'secondary_color', 'value': '#10B981', 'type': 'color', 'category': 'colors'},
            {'key': 'accent_color', 'value': '#8B5CF6', 'type': 'color', 'category': 'colors'},
            {'key': 'navbar_bg', 'value': 'rgba(255, 255, 255, 0.8)', 'type': 'color', 'category': 'colors'},
            {'key': 'dark_primary_color', 'value': '#60A5FA', 'type': 'color', 'category': 'colors'},
            {'key': 'dark_secondary_color', 'value': '#34D399', 'type': 'color', 'category': 'colors'},
            {'key': 'dark_navbar_bg', 'value': 'rgba(15, 23, 42, 0.8)', 'type': 'color', 'category': 'colors'},
            
            # Theme
            {'key': 'theme_mode', 'value': 'system', 'type': 'string', 'category': 'colors'},
            {'key': 'navbar_blur', 'value': '12', 'type': 'number', 'category': 'colors'},
            
            # Typography
            {'key': 'font_family', 'value': 'Inter, system-ui, sans-serif', 'type': 'string', 'category': 'typography'},
            {'key': 'font_size_base', 'value': '16', 'type': 'number', 'category': 'typography'},
            {'key': 'font_weight_normal', 'value': '400', 'type': 'number', 'category': 'typography'},
            {'key': 'font_weight_bold', 'value': '700', 'type': 'number', 'category': 'typography'},
            
            # Social Media
            {'key': 'facebook_url', 'value': 'https://facebook.com/logistikkita', 'type': 'url', 'category': 'social'},
            {'key': 'instagram_url', 'value': 'https://instagram.com/logistikkita', 'type': 'url', 'category': 'social'},
            {'key': 'twitter_url', 'value': 'https://twitter.com/logistikkita', 'type': 'url', 'category': 'social'},
            {'key': 'linkedin_url', 'value': 'https://linkedin.com/company/logistikkita', 'type': 'url', 'category': 'social'},
            
            # Contact Information
            {'key': 'contact_email', 'value': 'info@logistikkita.com', 'type': 'email', 'category': 'contact'},
            {'key': 'contact_phone', 'value': '+62 812-3456-7890', 'type': 'string', 'category': 'contact'},
            {'key': 'contact_whatsapp', 'value': '+62 812-3456-7890', 'type': 'string', 'category': 'contact'},
            {'key': 'contact_address', 'value': 'Jl. Sudirman No. 123, Jakarta Pusat, Indonesia', 'type': 'string', 'category': 'contact'},
            {'key': 'contact_hours', 'value': 'Senin - Minggu: 24 Jam', 'type': 'string', 'category': 'contact'},
            
            # SEO
            {'key': 'meta_title', 'value': 'LOGISTIK KITA - Expedition & Logistics Solutions', 'type': 'string', 'category': 'seo'},
            {'key': 'meta_description', 'value': 'Layanan pengiriman barang terpercaya di seluruh Indonesia. Cepat, aman, dan terjangkau.', 'type': 'string', 'category': 'seo'},
            {'key': 'meta_keywords', 'value': 'logistik, pengiriman, ekspedisi, cargo, jasa kirim, indonesia', 'type': 'string', 'category': 'seo'},
            
            # General Settings
            {'key': 'maintenance_mode', 'value': 'false', 'type': 'boolean', 'category': 'general', 'is_public': False},
            {'key': 'default_language', 'value': 'id', 'type': 'string', 'category': 'general'},
            {'key': 'timezone', 'value': 'Asia/Jakarta', 'type': 'string', 'category': 'general'},
            
            # Features Flags (untuk development)
            {'key': 'feature_ai_pricing', 'value': 'true', 'type': 'boolean', 'category': 'features'},
            {'key': 'feature_real_time_tracking', 'value': 'true', 'type': 'boolean', 'category': 'features'},
            {'key': 'feature_bulk_shipment', 'value': 'true', 'type': 'boolean', 'category': 'features'},
        ]
        
        for setting in default_settings:
            SiteSetting.objects.get_or_create(
                setting_key=setting['key'],
                defaults={
                    'setting_value': setting['value'],
                    'setting_type': setting['type'],
                    'category': setting['category'],
                    'is_public': setting.get('is_public', True),
                    'description': f"Default {setting['key']} setting"
                }
            )
        
        self.stdout.write(self.style.SUCCESS('Successfully seeded all initial data!'))
        
        # 5. Print API endpoints info
        self.stdout.write('\n' + '='*50)
        self.stdout.write('API ENDPOINTS:')
        self.stdout.write('='*50)
        self.stdout.write('1. Navigation Menu: GET /api/nav-menus/by_location/?location=header')
        self.stdout.write('2. Site Settings: GET /api/site-settings/')
        self.stdout.write('3. Combined Config: GET /api/config/')
        self.stdout.write('4. Admin Panel: http://localhost:8000/admin/')
        self.stdout.write('='*50)
