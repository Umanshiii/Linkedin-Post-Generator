from django.core.mail import send_mail
from django.dispatch import receiver
from django_rest_passwordreset.signals import reset_password_token_created

@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    # This URL matches the route check we put in your React App.tsx!
    email_plaintext_message = (
        f"Click the link below to reset your password:\n\n"
        f"http://localhost:5173/?token={reset_password_token.key}"
    )

    send_mail(
        "Password Reset for LinkedInk AI",  # Subject
        email_plaintext_message,             # Message
        "noreply@linkedink.ai",              # From Email
        [reset_password_token.user.email],   # To Email
        fail_silently=False,
    )