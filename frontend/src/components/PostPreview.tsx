import { useState } from 'react';
import { Copy, Check, Edit3, Download, Trash2, Linkedin } from 'lucide-react';

interface PostPreviewProps {
  content: string;
  onClear: () => void;
}

export function PostPreview({ content, onClear }: PostPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(isEditing ? editedContent : content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
  };

  const characterCount = (isEditing ? editedContent : content).length;
  const wordCount = (isEditing ? editedContent : content).trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-900">Preview</h2>
        {content && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={onClear}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Clear"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {!content ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-gray-100 p-6 rounded-full mb-4">
            <Linkedin className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-gray-900 mb-2">No post generated yet</h3>
          <p className="text-gray-600 text-sm max-w-xs">
            Fill in the details and click "Generate Post" to see your LinkedIn post appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* LinkedIn-style post preview */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white">
                YN
              </div>
              <div>
                <div className="text-gray-900">Your Name</div>
                <div className="text-sm text-gray-600">Your Title | Company</div>
                <div className="text-xs text-gray-500">Just now • 🌐</div>
              </div>
            </div>

            {isEditing ? (
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={12}
              />
            ) : (
              <div className="text-gray-800 whitespace-pre-wrap break-words">
                {content}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <span>{characterCount}</span>
              <span>characters</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full" />
            <div className="flex items-center gap-1">
              <span>{wordCount}</span>
              <span>words</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full" />
            <div className={`flex items-center gap-1 ${characterCount > 3000 ? 'text-red-600' : 'text-green-600'}`}>
              <span>
                {characterCount <= 3000 ? 'Perfect length' : 'Too long'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {isEditing ? (
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleCopy}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Post</span>
                    </>
                  )}
                </button>
                <button
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* LinkedIn tip */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <span className="font-medium">💡 Pro tip:</span> Posts with 1-3 paragraphs and 3-5 hashtags tend to perform best on LinkedIn
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
