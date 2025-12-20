# LOGISTIK KITA - Backend API

Django REST API untuk sistem manajemen ekspedisi LOGISTIK KITA.

## 🚀 Features

- RESTful API dengan Django REST Framework
- Dynamic navigation menu management
- Site settings CMS-like configuration
- PostgreSQL database dengan Redis caching
- Docker containerization
- Ready for production deployment

## 🏗️ Architecture
```markdown
# LOGISTIK KITA - Backend API

Django REST API untuk sistem manajemen ekspedisi LOGISTIK KITA.

## 🚀 Features

- RESTful API dengan Django REST Framework
- Dynamic navigation menu management
- Site settings CMS-like configuration
- PostgreSQL database dengan Redis caching
- Docker containerization
- Ready for production deployment

## 🏗️ Architecture

```

backend/
├──apps/
│└── navigation/     # Navigation & site settings app
├──config/            # Django project settings
├──docker/           # Docker configurations
└──requirements.txt  # Python dependencies

```

## 📦 Installation

### Local Development

```bash
# 1. Clone repository
git clone <repository-url>
cd backend

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# atau venv\Scripts\activate  # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Setup environment variables
cp .env.example .env
# Edit .env dengan konfigurasi yang sesuai

# 5. Setup PostgreSQL database
# Buat database bernama 'logistik_kita'

# 6. Run migrations
python manage.py migrate

# 7. Seed initial data
python manage.py seed_initial_data

# 8. Create superuser
python manage.py createsuperuser

# 9. Run development server
python manage.py runserver
```

Docker Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

🔧 Configuration

Environment Variables

Copy .env.example to .env and configure:

```env
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:pass@localhost:5432/logistik_kita
REDIS_URL=redis://localhost:6379/0
```

Database

Default menggunakan PostgreSQL. Untuk development bisa pakai SQLite:

```python
# config/settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

📚 API Documentation

Endpoints

Navigation

· GET /api/nav-menus/by_location/?location=header - Get navigation by location
· GET /api/nav-menus/all/ - Get all navigation menus

Site Settings

· GET /api/site-settings/ - Get all public site settings
· GET /api/site-settings/by_category/?category=branding - Get settings by category

Combined Config

· GET /api/config/ - Get all config for frontend initialization

Example Response

```json
{
  "navigation": {
    "name": "main-navigation",
    "location": "header",
    "items": [
      {
        "title": "Beranda",
        "url": "/",
        "icon": "HiHome",
        "children": []
      }
    ]
  },
  "settings": {
    "site_name": "LOGISTIK KITA",
    "primary_color": "#3B82F6"
  }
}
```

🧪 Testing

```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test apps.navigation
```

🐳 Docker

Build and Run

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

Docker Commands

```bash
# Access Django shell
docker-compose exec backend python manage.py shell

# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Access database
docker-compose exec db psql -U postgres -d logistik_kita
```

🚀 Deployment

Production Settings

Create config/settings/production.py:

```python
from .base import *

DEBUG = False
ALLOWED_HOSTS = ['your-domain.com', 'www.your-domain.com']

# Security settings
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}
```

Deployment to Render/Railway

1. Push code to GitHub
2. Connect to Render/Railway
3. Set environment variables
4. Deploy!

🔐 Security

· JWT authentication (optional)
· CORS configured
· SQL injection protection
· XSS protection
· CSRF protection
· Secure password hashing

📊 Database Schema

Key Tables

1. navigation_menus - Navigation menu configurations
2. menu_items - Individual menu items with hierarchy
3. site_settings - Dynamic site configuration
4. media_files - Uploaded media files

🤝 Contributing

1. Fork the repository
2. Create feature branch (git checkout -b feature/amazing-feature)
3. Commit changes (git commit -m 'Add amazing feature')
4. Push to branch (git push origin feature/amazing-feature)
5. Open Pull Request

📄 License

MIT License

🆘 Support

· 📧 Email: logistikkita.assist@gmail.com
· 🐛 Issues: GitHub Issues
• 📞 +62 858 1348 7753

```


## 10. **Tambahkan `setup.py` (optional)**

```python
# backend/setup.py
from setuptools import setup, find_packages

setup(
    name="logistik-kita-backend",
    version="1.0.0",
    description="Backend API untuk LOGISTIK KITA Expedition Management System",
    author="Your Name",
    author_email="your.email@example.com",
    packages=find_packages(),
    install_requires=[
        line.strip() for line in open("requirements.txt").readlines()
        if line.strip() and not line.startswith("#")
    ],
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.11",
    ],
)
