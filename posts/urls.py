from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.dashboard, name='dashboard'),
    path('upload/', views.upload_posts, name='upload_posts'),
    path('analyze/', views.analyze_style_view, name='analyze_style'),
    path('generate/', views.generate_post_view, name='generate_post'),
    path('register/', views.register_view, name='register'),
]
