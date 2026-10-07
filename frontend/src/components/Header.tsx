import { Linkedin } from 'lucide-react';
import mascotImage from '../assets/image.png'; // Adjust path if assets is in a different folder relative to components

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mascot as the brand icon */}
            <div className="w-11 h-11 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-1 border border-blue-100 flex items-center justify-center shadow-inner">
              <img 
                src={mascotImage} 
                alt="LinkedInk AI Mascot" 
                className="w-full h-full object-contain hover:scale-110 transition-transform duration-300" 
              />
            </div>
            <div>
              <h1 className="text-gray-900 font-bold text-lg leading-tight">LinkedInk AI</h1>
              <p className="text-gray-500 text-xs">AI-Powered LinkedIn Post Generator</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-100 text-sm">
            <Linkedin className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 font-medium">Optimized for LinkedIn</span>
          </div>
        </div>
      </div>
    </header>
  );
}