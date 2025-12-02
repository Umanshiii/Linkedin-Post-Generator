from django.contrib import admin
from django.urls import path, include
from posts.views import register_view

urlpatterns = [
    path('admin/', admin.site.urls),

    # Root → register page ONLY
    path('', register_view, name='home'),

    # App URLs (dashboard, upload, etc.)
    path('', include('posts.urls')),

    # Auth URLs
    path('accounts/', include('django.contrib.auth.urls')),
]
