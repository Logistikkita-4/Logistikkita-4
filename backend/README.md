```markdown
# 🚚 LOGISTIK KITA - Backend API

[![Django](https://img.shields.io/badge/Django-5.0-green.svg)](https://www.djangoproject.com/)
[![DRF](https://img.shields.io/badge/DRF-3.14-blue.svg)](https://www.django-rest-framework.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-✓-blue.svg)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Backend Django REST API untuk sistem manajemen ekspedisi LOGISTIK KITA.**  
Menyediakan API untuk dynamic navigation, site settings, dan CMS functionality.

## ✨ Features

### 🎨 **CMS & Configuration**
- Dynamic navigation menu management
- Site settings dengan admin panel
- Media file upload (logo, favicon, images)
- Dark/Light mode configuration
- Multi-language ready

### 🔧 **Technical Features**
- RESTful API dengan Django REST Framework
- PostgreSQL database dengan Redis caching
- JWT Authentication (optional)
- CORS enabled untuk frontend
- Docker containerization
- Production-ready configuration

### 📊 **API Features**
- Cache optimization untuk performa
- Rate limiting untuk security
- Comprehensive error handling
- API documentation via Swagger (optional)

## 🏗️ Architecture

```

backend/
├──apps/navigation/     # Navigation & site settings app
├──config/             # Django project configuration
├──docker/            # Docker configurations
├──static/           # Static files
└──media/           # Uploaded media files

```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- PostgreSQL 15+ (atau SQLite untuk development)
- Redis 7+ (optional, untuk caching)
- Docker & Docker Compose (optional)

### Option 1: Local Development (Recommended)

```bash
# 1. Clone repository
git clone https://github.com/yourusername/logistik-kita.git
cd backend

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# atau venv\Scripts\activate  # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Setup environment
cp .env.example .env
# Edit .env dengan konfigurasi lokal

# 5. Run database migrations
python manage.py migrate

# 6. Seed initial data
python manage.py seed_initial_data

# 7. Create superuser (optional)
python manage.py createsuperuser

# 8. Run development server
python manage.py runserver
```

Option 2: Docker Development

```bash
# 1. Clone repository
git clone https://github.com/yourusername/logistik-kita.git
cd backend

# 2. Start all services dengan Docker Compose
docker-compose up -d

# 3. View logs
docker-compose logs -f

# 4. Stop services
docker-compose down
```

Option 3: Development Shortcut

```bash
# Gunakan Makefile untuk commands yang umum
make dev            # Install, migrate, seed, dan run
make docker-up      # Start docker services
make status         # Check service status
```

📁 Project Structure

```
backend/
├── apps/
│   └── navigation/         # Navigation & site settings
│       ├── models.py       # Database models
│       ├── admin.py        # Admin panel
│       ├── serializers.py  # API serializers
│       ├── views.py        # API views
│       ├── urls.py         # URL routing
│       └── management/     # Custom commands
│
├── config/                 # Django configuration
│   ├── settings.py        # Development settings
│   ├── settings/          # Environment settings
│   │   ├── base.py       # Base settings
│   │   └── production.py # Production settings
│   ├── urls.py           # URL routing
│   ├── wsgi.py           # WSGI config
│   └── asgi.py           # ASGI config
│
├── docker/                # Docker configurations
│   ├── postgres/         # PostgreSQL configs
│   └── nginx/            # Nginx configs (optional)
│
├── static/               # Static files
├── media/               # Uploaded files
│
├── requirements.txt      # Python dependencies
├── Dockerfile           # Docker image
├── docker-compose.yml   # Multi-container setup
├── Makefile            # Development commands
└── README.md           # This file
```

🔧 Configuration

Environment Variables

Copy .env.example to .env:

```env
# Django
DEBUG=True
SECRET_KEY=your-secret-key-here
DJANGO_ENV=development

# Database
DB_NAME=logistik_kita
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
USE_SQLITE=False  # Set True untuk development tanpa PostgreSQL

# Redis
REDIS_URL=redis://localhost:6379/1
USE_MEMORY_CACHE=False  # Set True jika tidak pakai Redis

# CORS
CORS_ALLOW_ALL_ORIGINS=True
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Frontend
FRONTEND_URL=http://localhost:3000
```

Database Setup

PostgreSQL (Recommended)

```bash
# Create database
sudo -u postgres psql
CREATE DATABASE logistik_kita;
CREATE USER logistik_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE logistik_kita TO logistik_user;
```

SQLite (Development)

Set USE_SQLITE=True di .env

📚 API Documentation

Base URL

```
Development: http://localhost:8000/api/
Production:  https://yourdomain.com/api/
```

Main Endpoints

Method Endpoint Description
GET /config/ Get all frontend configuration
GET /nav-menus/by_location/ Get navigation by location
GET /site-settings/ Get all site settings
GET /media-files/logos/ Get logo files
GET /health/ Health check

Example Usage

```bash
# Get navigation for header
curl http://localhost:8000/api/nav-menus/by_location/?location=header

# Get all site settings
curl http://localhost:8000/api/site-settings/

# Get combined config for frontend
curl http://localhost:8000/api/config/
```

Response Example

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
    "primary_color": "#3B82F6",
    "contact_phone": "+62 812-3456-7890"
  },
  "logo": {
    "name": "logo.png",
    "file_url": "/media/logo.png"
  }
}
```

🧪 Testing

```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test apps.navigation

# Run tests with coverage
coverage run manage.py test
coverage report
```

🐳 Docker Deployment

Development

```bash
# Build and start
docker-compose up --build

# View logs
docker-compose logs -f

# Run commands inside container
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```

Production

```bash
# Build production image
docker build -t logistik-kita-backend:latest .

# Run with environment variables
docker run -d \
  -p 8000:8000 \
  -e DJANGO_ENV=production \
  -e SECRET_KEY=your-secret-key \
  -e DB_HOST=postgres \
  logistik-kita-backend:latest
```

🚀 Deployment

Platform Recommendations

1. Render.com (Easy & Free)
2. Railway.app (Developer friendly)
3. AWS Elastic Beanstalk (Enterprise)
4. DigitalOcean App Platform (Simple)

Environment Variables for Production

```env
DJANGO_ENV=production
SECRET_KEY=your-production-secret-key
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Database (Render/Railway provides URL)
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Redis
REDIS_URL=redis://host:6379/0

# CORS
CORS_ALLOWED_ORIGINS=https://your-frontend.com
```

🔐 Security

· JWT authentication ready
· CORS properly configured
· SQL injection protection
· XSS protection with security headers
· CSRF protection
· Rate limiting on API endpoints
· Secure password hashing

📊 Database Schema

Key Tables

```sql
-- Navigation menus
CREATE TABLE navigation_menus (...);

-- Menu items (hierarchical)
CREATE TABLE menu_items (...);

-- Site settings (CMS)
CREATE TABLE site_settings (...);

-- Media files
CREATE TABLE media_files (...);
```

🤝 Contributing

1. Fork repository
2. Create feature branch (git checkout -b feature/amazing-feature)
3. Commit changes (git commit -m 'Add amazing feature')
4. Push to branch (git push origin feature/amazing-feature)
5. Open Pull Request

📄 License

MIT License - see LICENSE file for details.

🆘 Support

· 📧 Email: logistikkita.assist@gmail.com
· 🐛 Issues: GitHub Issues
· 💬 Discussions: GitHub Discussions
