import { useEffect, useState } from "react";
import { Loader2, Check } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { postsApi } from "../api/client";

type Page = "auth" | "dashboard" | "upload" | "analyze" | "generated";

interface AnalyzeStyleProps {
  onNavigate: (page: Page) => void;
  onMessage: (type: "success" | "error", text: string) => void;
}

interface StyleProfile {
  tone: string;
  avgLength: number;
  commonWords: string[];
  structure: string;
}

export function AnalyzeStyle({ onNavigate, onMessage }: AnalyzeStyleProps) {
  const { updateUser } = useAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [profile, setProfile] = useState<StyleProfile | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        // 1) call backend to analyze current user's posts
        await postsApi.analyzeStyle();

        // 2) fetch updated dashboard stats (includes style info)
        const dashRes = await postsApi.dashboard();
        const data = dashRes.data;

        const p: StyleProfile = {
          tone: data.tone_summary || "Not available",
          avgLength: data.typical_length || 0,
          commonWords: data.vocabulary_keywords || [],
          structure: data.structure_summary || "Not available",
        };

        setProfile(p);
        updateUser({ hasProfile: true });
        onMessage("success", "Style profile analyzed successfully.");
      } catch {
        onMessage(
          "error",
          "Could not analyze your style. Please upload posts and try again."
        );
      } finally {
        setIsAnalyzing(false);
      }
    };

    run();
  }, [updateUser, onMessage]);

  if (isAnalyzing) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12">
          <div className="text-center">
            <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-gray-900 mb-3">
              Analyzing your writing style...
            </h2>
            <p className="text-gray-600">
              Our AI is studying your posts to understand your unique voice.
              This will take just a moment.
            </p>
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                <span>Analyzing tone and sentiment</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse animation-delay-200" />
                <span>Identifying common phrases</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse animation-delay-400" />
                <span>Understanding structure patterns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-gray-900 mb-2">✨ Style analysis complete!</h1>
          <p className="text-gray-600">
            We&apos;ve learned your unique writing style.
          </p>
        </div>

        {profile && (
          <div className="space-y-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">🎭</span>
                </div>
                <div>
                  <h3 className="text-gray-900 mb-1">Tone</h3>
                  <p className="text-gray-700">{profile.tone}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <div className="bg-purple-600 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">📐</span>
                </div>
                <div>
                  <h3 className="text-gray-900 mb-1">Structure</h3>
                  <p className="text-gray-700">{profile.structure}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <div className="bg-green-600 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">📏</span>
                </div>
                <div>
                  <h3 className="text-gray-900 mb-1">Average length</h3>
                  <p className="text-gray-700">
                    ~{profile.avgLength} words per post
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <div className="bg-orange-600 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">💬</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-2">Your signature words</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.commonWords.length > 0 ? (
                      profile.commonWords.map((word, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                        >
                          {word}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-600 text-sm">
                        No keywords available yet.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            onMessage(
              "success",
              "Style profile ready! You can now generate posts."
            );
            onNavigate("dashboard");
          }}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30"
        >
          Go to dashboard
        </button>
      </div>
    </div>
  );
}
