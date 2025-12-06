import { Sparkles, Linkedin } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-gray-900">LinkedInk AI</h1>
              <p className="text-gray-600 text-sm">AI-Powered LinkedIn Post Generator</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-100">
            <Linkedin className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700">Optimized for LinkedIn</span>
          </div>
        </div>
      </div>
    </header>
  );
}
