from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from .models import LinkedInPost, GeneratedPost, StyleProfile

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    confirmPassword = serializers.CharField(write_only=True, min_length=8)

    def validate(self, attrs):
        # Password match
        if attrs["password"] != attrs["confirmPassword"]:
            raise serializers.ValidationError(
                {"confirmPassword": "Passwords do not match."}
            )

        # Unique email
        if User.objects.filter(email=attrs["email"]).exists():
            raise serializers.ValidationError(
                {"email": "Email already registered."}
            )

        # Unique username
        username = attrs["username"].strip()
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError(
                {"username": "Username already taken."}
            )

        return attrs

    def create(self, validated_data):
        username = validated_data["username"].strip()
        name = validated_data["name"].strip()
        email = validated_data["email"].strip().lower()
        password = validated_data["password"]

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=name,
        )
        return user


class PostUploadSerializer(serializers.Serializer):
    posts_text = serializers.CharField(style={"base_template": "textarea.html"})


class DashboardStatsSerializer(serializers.Serializer):
    username = serializers.CharField()
    user_posts_count = serializers.IntegerField()
    has_profile = serializers.BooleanField()


class GeneratePostInputSerializer(serializers.Serializer):
    topic = serializers.CharField(max_length=500)
    language = serializers.ChoiceField(
        choices=[
            ("English", "English"),
            ("Hindi", "Hindi"),
            ("Hinglish", "Hinglish"),
        ],
        default="English",
    )
    length = serializers.IntegerField(required=False, default=250)
    tone = serializers.ChoiceField(
        choices=[
            ("auto", "Auto (use profile)"),
            ("professional", "Professional & authoritative"),
            ("inspirational", "Inspirational & motivational"),
            ("educational", "Educational & helpful"),
            ("personal", "Personal & authentic"),
            ("conversational", "Engaging & conversational"),
        ],
        default="auto",
        required=False,
    )


class GeneratedPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneratedPost
        fields = "__all__"

