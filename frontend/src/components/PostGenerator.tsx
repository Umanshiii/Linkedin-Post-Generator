import { useState } from 'react';
import { Wand2, Loader2, BookTemplate } from 'lucide-react';

interface PostGeneratorProps {
  onGenerate: (post: string) => void;
  onShowTemplates: () => void;
}

export function PostGenerator({ onGenerate, onShowTemplates }: PostGeneratorProps) {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockPost = generateMockPost(topic, tone, length, includeEmojis, includeHashtags);
      onGenerate(mockPost);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-900">Create Your Post</h2>
        <button
          onClick={onShowTemplates}
          className="flex items-center gap-2 px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
        >
          <BookTemplate className="w-4 h-4" />
          <span className="text-sm">Templates</span>
        </button>
      </div>

      <div className="space-y-5">
        {/* Topic Input */}
        <div>
          <label className="block text-gray-700 mb-2">
            What do you want to post about?
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="E.g., My experience leading a remote team, Tips for career growth, Lessons from my latest project..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
          />
        </div>

        {/* Tone Selection */}
        <div>
          <label className="block text-gray-700 mb-2">Tone</label>
          <div className="grid grid-cols-2 gap-2">
            {['professional', 'casual', 'inspirational', 'thought-leadership'].map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  tone === t
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Length Selection */}
        <div>
          <label className="block text-gray-700 mb-2">Post Length</label>
          <div className="grid grid-cols-3 gap-2">
            {['short', 'medium', 'long'].map((l) => (
              <button
                key={l}
                onClick={() => setLength(l)}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  length === l
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                }`}
              >
                {l.charAt(0).toUpperCase() + l.slice(1)}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {length === 'short' && 'Quick & concise (50-100 words)'}
            {length === 'medium' && 'Balanced depth (100-200 words)'}
            {length === 'long' && 'In-depth content (200-300 words)'}
          </p>
        </div>

        {/* Additional Options */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={includeEmojis}
              onChange={(e) => setIncludeEmojis(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-700">Include emojis</span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={includeHashtags}
              onChange={(e) => setIncludeHashtags(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-700">Include hashtags</span>
          </label>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!topic.trim() || isGenerating}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating your post...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              <span>Generate Post</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function generateMockPost(
  topic: string,
  tone: string,
  length: string,
  includeEmojis: boolean,
  includeHashtags: boolean
): string {
  const emoji = includeEmojis ? '🚀 ' : '';
  const hashtags = includeHashtags ? '\n\n#LinkedInTips #CareerGrowth #ProfessionalDevelopment' : '';
  
  let post = `${emoji}Excited to share some thoughts on: ${topic}\n\n`;
  
  if (tone === 'professional') {
    post += `In my experience, this topic is crucial for professional growth. Here are three key insights I've learned:\n\n`;
    post += `1. Understanding the fundamentals is essential\n`;
    post += `2. Continuous learning drives success\n`;
    post += `3. Collaboration amplifies impact\n\n`;
  } else if (tone === 'casual') {
    post += `So I've been thinking about this lately, and wanted to share what I've learned.\n\n`;
    post += `Honestly, it's been quite a journey! The biggest takeaway? Stay curious and keep pushing forward. `;
  } else if (tone === 'inspirational') {
    post += `Every challenge is an opportunity in disguise. ${includeEmojis ? '✨' : ''}\n\n`;
    post += `This reminded me that success isn't just about reaching the destination—it's about who we become along the way. `;
  } else {
    post += `Let me share a perspective that might challenge conventional thinking.\n\n`;
    post += `The industry often focuses on X, but we should be paying attention to Y. Here's why this matters: `;
  }
  
  if (length === 'long') {
    post += `\n\nWhat's your take on this? I'd love to hear your experiences in the comments below. `;
    post += `${includeEmojis ? '💬' : ''}\n\nLet's learn from each other and grow together!`;
  } else if (length === 'medium') {
    post += `\n\nWhat do you think? Drop your thoughts below! ${includeEmojis ? '💬' : ''}`;
  } else {
    post += `\n\nThoughts?`;
  }
  
  return post + hashtags;
}
