# backend/apps/navigation/apps.py

from django.apps import AppConfig

class NavigationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.navigation'
    verbose_name = 'Navigation & Site Settings'
    
    def ready(self):
        """Import signals jika ada."""
        try:
            import apps.navigation.signals
        except ImportError:
            pass
