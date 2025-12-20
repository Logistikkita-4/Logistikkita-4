"""
ASGI config untuk project LOGISTIK KITA.

ASGI (Asynchronous Server Gateway Interface) adalah spiritual successor
dari WSGI, yang mendukung asynchronous Python web applications.

Dibutuhkan jika menggunakan:
- Django Channels (WebSockets)
- Async views
- Daphne/uvicorn sebagai server
"""

import os
from django.core.asgi import get_asgi_application

# Set Django settings module untuk ASGI application
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Get ASGI application
application = get_asgi_application()

# Untuk WebSocket support dengan Django Channels:
# from channels.routing import ProtocolTypeRouter, URLRouter
# from channels.auth import AuthMiddlewareStack
# import apps.websocket.routing

# application = ProtocolTypeRouter({
#     "http": get_asgi_application(),
#     "websocket": AuthMiddlewareStack(
#         URLRouter(
#             apps.websocket.routing.websocket_urlpatterns
#         )
#     ),
# })
