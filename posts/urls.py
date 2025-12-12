from django.urls import path
from . import views

urlpatterns = [
    path("api/dashboard/", views.dashboard, name="dashboard"),
    path("api/analyze/", views.analyze_style_api, name="analyze_style"),
    path("api/generate/", views.generate_post_api, name="generate_post"),
    path("api/register/", views.register, name="register"),
    path("api/upload-posts/", views.upload_posts_api, name="upload_posts"),
    path("api/linkedin-posts/<int:pk>/", views.delete_post, name="delete_posts"),
    path("api/linkedin-posts/", views.list_posts, name="post-list"),
]
