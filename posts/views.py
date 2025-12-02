from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.contrib import messages
from .forms import UploadPostsForm, GeneratePostForm, RegisterForm
from .models import LinkedInPost, StyleProfile, GeneratedPost
from .services.llm import analyze_style, generate_post
import json
from django.http import JsonResponse

def register_view(request):
    if request.user.is_authenticated:
        return redirect('dashboard')

    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            messages.success(request, 'Account created successfully. Please log in.')
        
            return redirect('login')
    else:
        form = RegisterForm()
    return render(request, 'registration/register.html', {'form': form})

@login_required
def dashboard(request):
    username = request.user.username
    user_posts = request.user.linkedin_posts.count()
    has_profile = StyleProfile.objects.filter(user=request.user).exists()
    
    context = {
        'username': username,
        'user_posts': user_posts,
        'has_profile': has_profile,
    }
    return render(request, 'dashboard.html', context)

@login_required
def upload_posts(request):
    if request.method == 'POST':
        form = UploadPostsForm(request.POST)
        if form.is_valid():
            posts_text = form.cleaned_data['posts_text']
            raw_posts = [p.strip() for p in posts_text.split('---') if p.strip()]
            
            for post_text in raw_posts[:15]:  # Limit to 15
                LinkedInPost.objects.create(user=request.user, raw_text=post_text)
            
            messages.success(request, f'Uploaded {len(raw_posts)} posts!')
            return redirect('dashboard')
    else:
        form = UploadPostsForm()
    return render(request, 'upload_posts.html', {'form': form})

@login_required
def analyze_style_view(request):
    posts = request.user.linkedin_posts.all()[:10]
    if not posts.exists():
        messages.error(request, 'Upload posts first!')
        return redirect('dashboard')
    
    # Combine posts for analysis
    posts_text = '\n\n---\n\n'.join([p.raw_text for p in posts])
    style_data = analyze_style(posts_text)
    
    # Save or update profile
    profile, created = StyleProfile.objects.get_or_create(user=request.user)
    for key, value in style_data.items():
        setattr(profile, key, value)
    profile.save()
    
    messages.success(request, 'Style profile analyzed!')
    return redirect('dashboard')


@login_required
@login_required
def generate_post_view(request):
    if request.method == 'POST':
        topic = request.POST.get('topic', '')
        language = request.POST.get('language', 'English')

        profile = StyleProfile.objects.filter(user=request.user).first()
        if not profile:
            return JsonResponse({'error': 'Analyze style first!'})

        target_length = profile.typical_length or 250

        generated_text = generate_post(topic, {
            'tone_summary': profile.tone_summary,
            'structure_summary': profile.structure_summary,
            'vocabulary_keywords': profile.vocabulary_keywords
        }, language, target_length)

        post = GeneratedPost.objects.create(
            user=request.user,
            topic=topic,
            language=language,
            target_length=target_length,
            generated_text=generated_text,
        )

        return JsonResponse({'success': True, 'post_id': post.id})

    return redirect('dashboard')

def home(request):
    return render(request, 'home.html')
