from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

class RegisterForm(UserCreationForm):
    email = forms.EmailField(required=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].widget.attrs.update({'class': 'form-control'})
        self.fields['email'].widget.attrs.update({'class': 'form-control'})
        self.fields['password1'].widget.attrs.update({'class': 'form-control'})
        self.fields['password2'].widget.attrs.update({'class': 'form-control'})

        
class UploadPostsForm(forms.Form):
    posts_text = forms.CharField(
        widget=forms.Textarea(attrs={
            'rows': 12,
            'class': 'form-control',
            'placeholder': 'Paste 5-15 LinkedIn posts, one per block separated by "---"\n\nExample:\n---\nExcited to share my latest project...\n---\nJust wrapped up an amazing conference...'
        }),
        label="Your LinkedIn Posts",
        help_text="Copy your best posts. Use --- to separate each post."
    )

class GeneratePostForm(forms.Form):
    topic = forms.CharField(
        max_length=200,
        widget=forms.TextInput(attrs={'class': 'form-control'}),
        label="Topic"
    )
    language = forms.ChoiceField(
        choices=[('English', 'English'), ('Hindi', 'Hindi')],
        widget=forms.Select(attrs={'class': 'form-control'}),
        label="Language"
    )
    length = forms.ChoiceField(
        choices=[(100, 'Short (100 words)'), (250, 'Medium (250 words)'), (400, 'Long (400 words)')],
        widget=forms.Select(attrs={'class': 'form-control'}),
        label="Length"
    )
