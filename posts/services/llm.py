import ollama
import json

def analyze_style(posts_text):
    """Analyze user posts and return style profile"""
    prompt = f"""
    Analyze these LinkedIn posts and extract writing style in JSON format:

    POSTS: {posts_text[:4000]}

    Return ONLY valid JSON:
    {{
        "tone_summary": "2-3 sentences about tone/emotion",
        "structure_summary": "How posts are structured (paragraphs, lists, etc)",
        "vocabulary_keywords": ["word1", "word2", "phrase1"],
        "typical_length": 250
    }}
    """
    
    try:
        response = ollama.chat(
            model='llama3.2:3b',
            messages=[{'role': 'user', 'content': prompt}]
        )
        return json.loads(response['message']['content'])
    except:
        return {
            "tone_summary": "Direct and professional", 
            "structure_summary": "Short paragraphs with calls to action",
            "vocabulary_keywords": ["excited", "team", "learned", "share"],
            "typical_length": 250
        }

def generate_post(topic, style_profile, language='English', target_length=250):
    """Generate post in user's style"""
    style_text = f"""
    USER STYLE:
    - Tone: {style_profile.get('tone_summary', '')}
    - Structure: {style_profile.get('structure_summary', '')}
    - Keywords: {', '.join(style_profile.get('vocabulary_keywords', [])[:10])}
    - Typical length: {target_length} words
    """
    
    prompt = f"""
    {style_text}

    Write a LinkedIn post about "{topic}" in {language}.
    Match the exact style above. Sound human, not AI-generated.
    Target {target_length} words.
    """
    
    try:
        response = ollama.chat(
            model='llama3.2:3b',
            messages=[{'role': 'user', 'content': prompt}]
        )
        return response['message']['content']
    except:
        return f"Excited to share about {topic}! 🎉\n\n{style_profile.get('tone_summary', 'Professional tone')}"
