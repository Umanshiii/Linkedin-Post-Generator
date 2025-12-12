import json
import os
from cerebras.cloud.sdk import Cerebras


API_KEY = os.environ.get("CEREBRAS_API_KEY")
client: Cerebras | None = None
if API_KEY:
    client = Cerebras(api_key=API_KEY)


def _fallback_style() -> dict:
    """Default style profile when LLM or JSON parsing fails."""
    return {
        "tone_summary": "Direct and professional",
        "structure_summary": "Short paragraphs with calls to action",
        "vocabulary_keywords": ["excited", "team", "learned", "share"],
        "typical_length": 250,
    }


def analyze_style(posts_text: str) -> dict:
    """Analyze user posts and return style profile as a dict."""

    # If Cerebras is not configured, immediately return fallback
    if client is None:
        return _fallback_style()

    prompt1 = f"""
Analyze these LinkedIn posts and extract writing style in JSON format.

POSTS:
{posts_text[:4000]}

Return ONLY valid JSON with this structure:
{{
  "tone_summary": "2-3 sentences about tone/emotion",
  "structure_summary": "How posts are structured (paragraphs, lists, etc)",
  "vocabulary_keywords": ["word1", "word2", "phrase1"],
  "typical_length": 250
}}
"""

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b",
            messages=[
                {"role": "user", "content": prompt1},
            ],
            max_completion_tokens=target_length * 4,
            temperature=0.2,
            top_p=1.0,
            stream=False,
        )
        content = completion.choices[0].message.content
        return json.loads(content)
    except Exception:
        return _fallback_style()


def generate_post(
    topic: str,
    style_profile: dict,
    language: str,
    target_length: int,
    tone: str,
) -> str:
    """Generate a clear, on-topic LinkedIn post in the user's style."""

    style_text = f"""
USER STYLE:
- Tone: {style_profile.get('tone_summary', '')}
- Structure: {style_profile.get('structure_summary', '')}
- Keywords: {', '.join(style_profile.get('vocabulary_keywords', [])[:10])}
- Typical length: {target_length} words
"""

    # Language handling
    lang = language.lower()
    if lang == "hindi":
        language_instruction = (
            "WRITE THE ENTIRE POST IN HINDI ONLY, using Devanagari script (हिन्दी). "
            "Do NOT write full sentences in English."
        )
    elif lang == "hinglish":
        language_instruction = (
            "WRITE THE ENTIRE POST IN HINGLISH ONLY: Hindi sentences written with English letters. "
            "Do NOT use Devanagari script and do NOT write full sentences in pure English."
        )
    else:
        language_instruction = (
            "WRITE THE ENTIRE POST IN NATURAL, FLUENT ENGLISH ONLY."
        )

    # Tone handling
    tone_map = {
        "professional": "Use a professional, authoritative tone focused on data, insights, and credibility.",
        "inspirational": "Use an inspirational, motivational tone with success stories and encouragement.",
        "educational": "Use an educational, helpful tone with clear explanations and practical tips.",
        "personal": "Use a personal, authentic tone with behind-the-scenes details and lessons learned.",
        "conversational": "Use an engaging, conversational tone, asking questions and inviting comments.",
    }
    tone_instruction = (
        "Match the usual tone from the USER STYLE."
        if tone == "auto"
        else tone_map.get(tone, "Match the usual tone from the USER STYLE.")
    )

    min_words = int(target_length * 0.8)
    max_words = int(target_length * 1.2)

    prompt2 = f"""
You are an assistant that MUST follow instructions exactly.

YOUR ROLE
- You are a LinkedIn ghostwriter.
- You must OBEY ALL constraints about TOPIC, LANGUAGE, TONE and LENGTH.
- If you break any rule, your answer is considered INVALID.

TOPIC (MUST stay on this topic only):
\"\"\"{topic}\"\"\"

USER STYLE (use as a guide, but constraints below are MORE IMPORTANT):
- Tone: {style_profile.get('tone_summary', '')}
- Structure: {style_profile.get('structure_summary', '')}
- Keywords: {', '.join(style_profile.get('vocabulary_keywords', [])[:10])}
- Typical length: MUST be between {min_words} and {max_words} words.

LANGUAGE CONSTRAINT :
{language_instruction}
- Do NOT mix languages except as allowed above.
- If language is Hinglish, sentences must be in Hindi but written with English letters (Roman script), not in pure English and not in Devanagari.

TONE CONSTRAINT:
{tone_instruction}

LENGTH CONSTRAINT:
- The final post MUST be between {min_words} and {max_words} words.
- If your first draft is outside this range, you MUST rewrite it until it fits.
- Do not stop early; extend the story with concrete details until the word count is within the range

TASK:
1. Write one coherent story with a clear beginning, middle, and end about the TOPIC. Each sentence must logically connect to the previous one. No random jumps in topic
2. Use short sentences with extra breaks, like a real LinkedIn post. Most sentences must be under 12-15 words. Do not make every sentence its own isolated line.
3. If you use bullets or lists, keep them simple and add a blank line before and after the list.
4. The FIRST sentence must clearly mention the TOPIC using similar wording, Avoid long compound sentences; do not join ideas with more than one conjunction.
5. Focus on the author's personal experience, journey, challenges, learnings, and outcomes related to this TOPIC. The post should feel connected to each sentence
6. Include at least:
   - One concrete challenge or obstacle.
   - One specific lesson learned.
   - One forward-looking or call-to-action sentence.
7. Use some of the USER STYLE keywords naturally if they fit.
8. Match the paragraph spacing and line breaks of the USER STYLE as closely as possible.
9. Do NOT:
   - Change the subject.
   - Add generic career advice unrelated to the TOPIC.
   - Write vague motivational fluff.
   - Add any headings, labels, explanations, or metadata.

OUTPUT FORMAT:
- Return ONLY the final LinkedIn post text.
- No titles, no bullet list of instructions, no commentary, no explanation, no JSON.
"""

    if client is None:
        return (
            f"Sharing some thoughts on {topic}.\n\n"
            f"{style_profile.get('tone_summary', 'Professional tone')}"
        )

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b",
            messages=[
                {"role": "user", "content": prompt2},
            ],
            max_completion_tokens=target_length * 4,
            temperature=0.1,
            top_p=0.9,
            stream=False,
        )
        return completion.choices[0].message.content
    except Exception: 
        return ( f"Sharing some thoughts on {topic}.\n\n" f"{style_profile.get('tone_summary', 'Professional tone')}" )
    
