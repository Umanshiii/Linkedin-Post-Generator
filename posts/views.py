from django.shortcuts import redirect, render
from django.contrib import messages
from .forms import UploadPostsForm, GeneratePostForm, RegisterForm
from .models import LinkedInPost, StyleProfile, GeneratedPost
from .services import llm 
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import GeneratePostInputSerializer, GeneratedPostSerializer, RegisterSerializer, PostUploadSerializer

def register_view(request):
    if request.user.is_authenticated:
        return redirect("dashboard") 
    if request.method == "POST":
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            messages.success(request, "Account created successfully. Please log in.")
            return redirect("login")
    else:
        form = RegisterForm()

    return render(request, "registration/register.html", {"form": form})

def upload_posts(request):
    if not request.user.is_authenticated:
        return redirect("login")

    if request.method == "POST":
        form = UploadPostsForm(request.POST)
        if form.is_valid():
            posts_text = form.cleaned_data["posts_text"]
            raw_posts = [p.strip() for p in posts_text.split("---") if p.strip()]

            for post_text in raw_posts[:15]:  # Limit to 15
                LinkedInPost.objects.create(user=request.user, raw_text=post_text)

            messages.success(request, f"Uploaded {len(raw_posts)} posts!")
            return redirect("dashboard")
    else:
        form = UploadPostsForm()
    return render(request, "upload_posts.html", {"form": form})

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def analyze_style_api(request):
    # Get up to 10 posts for this user
    posts = request.user.linkedin_posts.all()[:10]
    if not posts.exists():
        return Response(
            {"detail": "Upload posts first!"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    posts_text = "\n\n---\n\n".join([p.raw_text for p in posts])
    style_data = llm.analyze_style(posts_text)

    profile, created = StyleProfile.objects.get_or_create(user=request.user)
    for key, value in style_data.items():
        setattr(profile, key, value)
    profile.save()

    return Response(
        {"detail": "Style profile analyzed!", "has_profile": True},
        status=status.HTTP_200_OK,
    )

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def generate_post_api(request):
    serializer = GeneratePostInputSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    topic = serializer.validated_data["topic"]
    language = serializer.validated_data["language"]
    requested_length = serializer.validated_data.get("length", 250)
    tone = serializer.validated_data.get("tone", "auto")

    profile = StyleProfile.objects.filter(user=request.user).first()
    if not profile:
        return Response(
            {"error": "Analyze style first!"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    target_length = requested_length or profile.typical_length

    style_dict = {
        "tone_summary": profile.tone_summary,
        "structure_summary": profile.structure_summary,
        "vocabulary_keywords": profile.vocabulary_keywords,
    }

    generated_text = llm.generate_post(
    topic=topic,
    style_profile=style_dict,
    language=language,
    target_length=target_length,
    tone=tone,
)
    if not isinstance(generated_text, str) or not generated_text.strip():
        return Response(
            {"detail": "LLM failed to generate text"},
            status=500,
        )

    post = GeneratedPost.objects.create(
        user=request.user,
        topic=topic,
        language=language,
        target_length=target_length,
        generated_text=generated_text,
    )
    return Response(GeneratedPostSerializer(post).data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard(request):
    """
    JSON endpoint for React dashboard.
    Reads real values from DB so frontend always reflects backend state.
    """
    profile = StyleProfile.objects.filter(user=request.user).first()
    has_profile = profile is not None

    data = {
        "username": request.user.username,
        "user_posts_count": request.user.linkedin_posts.count(),
        "has_profile": has_profile,
        "tone_summary": getattr(profile, "tone_summary", None),
        "structure_summary": getattr(profile, "structure_summary", None),
        "vocabulary_keywords": getattr(profile, "vocabulary_keywords", None),
        "typical_length": getattr(profile, "typical_length", None),
    }
    return Response(data, status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"detail": "User created"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def upload_posts_api(request):
    serializer = PostUploadSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    posts_text = serializer.validated_data["posts_text"]
    raw_posts = [p.strip() for p in posts_text.split("---") if p.strip()]

    for post_text in raw_posts[:15]:
        LinkedInPost.objects.create(user=request.user, raw_text=post_text)

    return Response({"added": len(raw_posts[:15])}, status=status.HTTP_201_CREATED)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_post(request, pk):
    try:
        post = LinkedInPost.objects.get(pk=pk, user=request.user)
    except LinkedInPost.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    post.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_posts(request):
    qs = LinkedInPost.objects.filter(user=request.user).order_by("-created_at")
    data = [
        {"id": p.id, "raw_text": p.raw_text, "created_at": p.created_at}
        for p in qs
    ]
    return Response(data)