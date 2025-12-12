// frontend/src/components/Dashboard.tsx
import { useState, useEffect } from "react";
import { FileText, Brain, Sparkles, Loader2 } from "lucide-react";
import { postsApi } from "../api/client";

type Page = "auth" | "dashboard" | "upload" | "analyze" | "generated";

interface DashboardProps {
  username: string;
  onNavigate: (page: Page) => void;
  onMessage: (type: "success" | "error", text: string) => void;
}

interface DashboardStats {
  user_posts_count: number;
  has_profile: boolean;
}

export function Dashboard({ username, onNavigate, onMessage }: DashboardProps) {
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("English");
  const [length, setLength] = useState(250);
  const [tone, setTone] = useState("auto");
  const [isGenerating, setIsGenerating] = useState(false);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await postsApi.dashboard();
        setStats({
          user_posts_count: res.data.user_posts_count,
          has_profile: res.data.has_profile,
        });
      } catch {
        onMessage("error", "Failed to load dashboard.");
      } finally {
        setIsLoadingStats(false);
      }
    };
    loadDashboard();
  }, [onMessage]);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      onMessage("error", "Please enter a topic");
      return;
    }

    setIsGenerating(true);

    try {
      const resp = await postsApi.generate(topic, language, length, tone);
      const data = resp.data;

      localStorage.setItem(
        "generatedPostData",
        JSON.stringify({
          topic,
          language,
          length,
          tone,
          post: data.generated_text,
          timestamp: Date.now(),
        })
      );

      onNavigate("generated");
    } catch (e) {
      onMessage("error", "Failed to generate post. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const firstName = (username || "").split(" ")[0] || username;
  const postsCount = stats?.user_posts_count ?? 0;
  const hasProfile = stats?.has_profile ?? false;

  if (isLoadingStats) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-gray-900 mb-3">Welcome, {firstName} 👋</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload your posts, let LinkedInk AI learn your style, and then
          generate new posts in your unique voice
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-gray-900 mb-1">Previous LinkedIn posts</h3>
              <p className="text-gray-600 text-sm mb-3">
                Posts you've added for analysis
              </p>
              <div className="text-4xl text-gray-900 mb-3">{postsCount}</div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => onNavigate("upload")}
                  className="text-blue-600 hover:underline text-sm text-left"
                >
                  Add more posts
                </button>
                {postsCount > 0 && (
                  <button
                    onClick={() => onNavigate("upload")}
                    className="text-red-600 hover:underline text-sm text-left"
                  >
                    Remove posts
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Style profile card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-xl ${
                hasProfile ? "bg-green-100" : "bg-gray-100"
              }`}
            >
              <Brain
                className={`w-6 h-6 ${
                  hasProfile ? "text-green-600" : "text-gray-400"
                }`}
              />
            </div>
            <div className="flex-1">
              <h3 className="text-gray-900 mb-1">Writing style profile</h3>
              <p className="text-gray-600 text-sm mb-3">
                Has your style been analyzed?
              </p>
              <div className="flex items-center gap-2 mb-3">
                {hasProfile ? (
                  <>
                    <span className="text-2xl">✅</span>
                    <span className="text-green-600">Style ready</span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-red-400 rounded-full" />
                    <span className="text-gray-500">Not analyzed yet</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        {postsCount === 0 && (
          <div className="text-center max-w-xl mx-auto">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-gray-900 mb-3">
              Let's start by uploading your posts
            </h2>
            <p className="text-gray-600 mb-6">
              Upload at least a few LinkedIn posts so we can learn your unique
              writing style
            </p>
            <button
              onClick={() => onNavigate("upload")}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30"
            >
              Upload your posts
            </button>
          </div>
        )}

        {postsCount > 0 && !hasProfile && (
          <div className="text-center max-w-xl mx-auto">
            <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-gray-900 mb-3">
              Great! Now let's analyze your style
            </h2>
            <p className="text-gray-600 mb-6">
              We have {postsCount} {postsCount === 1 ? "post" : "posts"} from
              you. Click below to analyze your writing style.
            </p>
            <button
              onClick={() => onNavigate("analyze")}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-500/30"
            >
              Analyze my style
            </button>
          </div>
        )}

        {postsCount > 0 && hasProfile && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-gray-900 mb-2">✨ Generate a new post</h2>
              <p className="text-gray-600">
                Posts will be generated to match your usual style and length
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="topic" className="block text-gray-700 mb-2">
                  What's your post about?
                </label>
                <input
                  type="text"
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="E.g., Launching my AI project, My journey in data science..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isGenerating}
                />
              </div>

              <div>
                <label htmlFor="language" className="block text-gray-700 mb-2">
                  Language
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isGenerating}
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Hinglish</option>
                </select>
              </div>

              <div>
                <label htmlFor="length" className="block text-gray-700 mb-2">
                  Length
                </label>
                <select
                  id="length"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isGenerating}
                >
                  <option value={100}>Short (100 words)</option>
                  <option value={250}>Medium (250 words)</option>
                  <option value={400}>Long (400 words)</option>
                </select>
              </div>

              <div>
                <label htmlFor="tone" className="block text-gray-700 mb-2">
                  Tone
                </label>
                <select
                  id="tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isGenerating}
                >
                  <option value="auto">Match my usual tone</option>
                  <option value="professional">
                    Professional & authoritative
                  </option>
                  <option value="inspirational">
                    Inspirational & motivational
                  </option>
                  <option value="educational">Educational & helpful</option>
                  <option value="personal">Personal & authentic</option>
                  <option value="conversational">
                    Engaging & conversational
                  </option>
                </select>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!topic.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating your post...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate post</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
