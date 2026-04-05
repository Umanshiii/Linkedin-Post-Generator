from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView # Add this import
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("posts/", include("posts.urls")),

    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]