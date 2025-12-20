"""
WSGI config untuk project LOGISTIK KITA.

WSGI (Web Server Gateway Interface) adalah specification untuk
web servers dan application servers untuk berkomunikasi dengan
web applications (dalam hal ini Django).

File ini digunakan oleh production web servers seperti Gunicorn, uWSGI, dll.
"""

import os
from django.core.wsgi import get_wsgi_application

# Set Django settings module untuk WSGI application
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Get WSGI application
application = get_wsgi_application()

# Optional: Tambah middleware untuk production
# Contoh: WhiteNoise untuk static files
try:
    from whitenoise import WhiteNoise
    application = WhiteNoise(application, root='staticfiles')
    # Tambah prefix untuk media files jika diperlukan
    # application.add_files('media/', prefix='media/')
except ImportError:
    # WhiteNoise tidak terinstall, skip
    pass

# Optional: Tambah untuk debugging
# if os.environ.get('DJANGO_SETTINGS_MODULE') == 'config.settings':
#     print("WSGI Application loaded successfully")
