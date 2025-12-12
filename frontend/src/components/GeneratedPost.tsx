import { useState, useEffect } from "react";
import { ArrowLeft, Copy, Check, Linkedin } from "lucide-react";

type Page = "auth" | "dashboard" | "upload" | "analyze" | "generated";

interface GeneratedPostProps {
  onNavigate: (page: Page) => void;
}

interface StoredPostData {
  topic: string;
  language: string;
  length: number;
  tone: string;
  post: string;
  timestamp: number;
}

export function GeneratedPost({ onNavigate }: GeneratedPostProps) {
  const [copied, setCopied] = useState(false);
  const [postData, setPostData] = useState<StoredPostData | null>(null);
  const [generatedText, setGeneratedText] = useState("");

  useEffect(() => {
    const data = localStorage.getItem("generatedPostData");
    if (data) {
      const parsed: StoredPostData = JSON.parse(data);
      setPostData(parsed);
      setGeneratedText(parsed.post || "");
    }
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = generatedText.trim().split(/\s+/).filter(Boolean).length;
  const charCount = generatedText.length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button
        onClick={() => onNavigate("dashboard")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to dashboard</span>
      </button>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-gray-900 mb-3">Your generated post</h1>
          {postData && (
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <span>Topic: {postData.topic}</span>
              <div className="w-1 h-1 bg-gray-300 rounded-full" />
              <span>Language: {postData.language}</span>
              <div className="w-1 h-1 bg-gray-300 rounded-full" />
              <span>~{wordCount} words</span>
            </div>
          )}
        </div>

        <div className="mb-6 border border-gray-200 rounded-xl p-6 bg-gray-50">
          <div className="flex items-start gap-3 mb-4 pb-4 border-b border-gray-200">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
              YN
            </div>
            <div>
              <div className="text-gray-900">Your Name</div>
              <div className="text-sm text-gray-600">Your Title | Company</div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <span>Just now</span>
                <span>•</span>
                <Linkedin className="w-3 h-3" />
              </div>
            </div>
          </div>

          <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
            {generatedText}
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span>{charCount}</span>
            <span>characters</span>
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full" />
          <div className="flex items-center gap-2">
            <span>{wordCount}</span>
            <span>words</span>
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full" />
          <div
            className={`flex items-center gap-2 ${
              charCount > 3000 ? "text-red-600" : "text-green-600"
            }`}
          >
            <span>
              {charCount <= 3000 ? "✅ Perfect length" : "⚠️ Too long"}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                <span>Copied to clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                <span>Copy to clipboard</span>
              </>
            )}
          </button>
          <button
            onClick={() => onNavigate("dashboard")}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Generate another
          </button>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <span className="font-medium">💡 Next steps:</span> Review the post,
            make any tweaks you'd like, then share it on LinkedIn to engage with
            your network!
          </p>
        </div>
      </div>
    </div>
  );
}
