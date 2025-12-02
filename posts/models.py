from django.db import models
from django.contrib.auth.models import User

class LinkedInPost(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='linkedin_posts')
    raw_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']

class StyleProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    tone_summary = models.TextField(blank=True)
    structure_summary = models.TextField(blank=True)
    vocabulary_keywords = models.JSONField(default=list)
    typical_length = models.IntegerField(default=0)
    analyzed_at = models.DateTimeField(auto_now_add=True)

class GeneratedPost(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    topic = models.CharField(max_length=200)
    language = models.CharField(max_length=20, default='English')
    target_length = models.IntegerField()
    generated_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
