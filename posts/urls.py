from django.urls import path
from . import views

urlpatterns = [
    path("dashboard/", views.dashboard, name="dashboard"),
    path("analyze/", views.analyze_style_api, name="analyze_style"),
    path("generate/", views.generate_post_api, name="generate_post"),
    path("register/", views.register, name="register"),
    path("upload-posts/", views.upload_posts_api, name="upload_posts"),
    path("linkedin-posts/<int:pk>/", views.delete_post, name="delete_posts"),
    path("linkedin-posts/", views.list_posts, name="post-list"),
]
