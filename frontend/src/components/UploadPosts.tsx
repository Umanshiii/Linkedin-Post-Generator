import { useState, useEffect } from "react";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { postsApi } from "../api/client";
import { MascotCompanion } from "./MascotCompanion";

type Page = "auth" | "dashboard" | "upload" | "analyze" | "generated";

interface UploadPostsProps {
  onNavigate: (page: Page) => void;
  onMessage: (type: "success" | "error", text: string) => void;
}

interface UploadedPost {
  id: number;
  raw_text: string;
  created_at: string;
}

export function UploadPosts({ onNavigate, onMessage }: UploadPostsProps) {
  const { updateUser, user } = useAuth();
  const [postsText, setPostsText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [posts, setPosts] = useState<UploadedPost[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await postsApi.listPosts();
        if (Array.isArray(res.data)) {
          setPosts(res.data as UploadedPost[]);
        } else {
          setPosts([]);
        }
      } catch (err) {
        setPosts([]);
        onMessage("error", "Failed to load your posts.");
      }
    };
    loadPosts();
  }, [onMessage]);

  const handleUpload = async () => {
    if (!postsText.trim()) {
      onMessage("error", "Please paste at least one post");
      return;
    }

    const splitPosts = postsText.split("---").filter((p) => p.trim().length > 0);

    if (splitPosts.length === 0) {
      onMessage(
        "error",
        "No valid posts found. Make sure to separate posts with ---"
      );
      return;
    }

    if (splitPosts.length < 3) {
      onMessage(
        "error",
        "Please upload at least 3 posts for better style analysis"
      );
      return;
    }

    setIsUploading(true);
    try {
      const resp = await postsApi.uploadPosts(postsText);
      const added: number = resp.data?.added ?? splitPosts.length;

      updateUser({
        postsCount: (user?.postsCount || 0) + added,
      });

      onMessage("success", `Uploaded ${added} posts successfully!`);
      onNavigate("dashboard");
    } catch (e) {
      onMessage("error", "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await postsApi.deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      
      if (user && user.postsCount > 0) {
        updateUser({ postsCount: user.postsCount - 1 });
      }
    } catch {
      onMessage("error", "Failed to remove post.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button
        onClick={() => onNavigate("dashboard")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to dashboard</span>
      </button>

      {/* Interactive Mascot Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 mb-8 flex items-center justify-between shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Feed My Brain! 🧠</h2>
          <p className="text-gray-600 text-sm mt-1">
            Paste your past posts separated by <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200">---</code> so I can learn your voice.
          </p>
        </div>
        <MascotCompanion 
          state={isUploading ? "thinking" : "suggesting"} 
          message={isUploading ? "Processing your writing style..." : "Aim for at least 3 posts!"} 
          size="sm" 
        />
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Upload your LinkedIn posts</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Paste 3-15 of your past LinkedIn posts below. This helps us understand your unique writing style.
          </p>
        </div>
        
        <div className="mb-6">
          <label htmlFor="posts" className="block text-gray-700 font-medium mb-2">
            Your posts
          </label>
          <textarea
            id="posts"
            value={postsText}
            onChange={(e) => setPostsText(e.target.value)}
            placeholder={`Paste your first post here...\n\n\n---\n\n\nPaste your second post here...\n\n\n---\n\n\nAnd so on...`}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
            rows={16}
            disabled={isUploading}
          />
          <p className="text-sm text-gray-500 mt-2">
            Separate each post with a line containing{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">---</code>
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-900 mb-2 font-medium">
            Example format:
          </p>
          <pre className="text-xs text-blue-800 overflow-x-auto">
{`I'm excited to share that I just launched my new project!
After months of hard work, it's finally live.

Check it out: [link]

---

Here are 3 lessons I learned about remote work:
1. Communication is key
2. Set clear boundaries
3. Take regular breaks

What's your experience? 💬`}
          </pre>
        </div>

        {Array.isArray(posts) && posts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-gray-900 mb-2 text-sm font-medium">
              Your uploaded posts
            </h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex justify-between items-start gap-3 border border-gray-200 rounded-lg p-3 bg-gray-50"
                >
                  <div className="text-sm text-gray-800 whitespace-pre-wrap flex-1">
                    {post.raw_text}
                  </div>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-600 text-xs hover:underline flex-shrink-0 font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!postsText.trim() || isUploading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 font-medium"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Uploading posts...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>Upload posts</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}