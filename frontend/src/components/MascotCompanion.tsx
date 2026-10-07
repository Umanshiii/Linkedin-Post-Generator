import React from 'react';
import mascotImage from '../assets/image.png';

interface MascotProps {
  state?: 'idle' | 'thinking' | 'celebrating' | 'error' | 'suggesting';
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const MascotCompanion: React.FC<MascotProps> = ({ 
  state = 'idle', 
  message, 
  size = 'md' 
}) => {
  // Size configurations
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  }[size];

  // Natural motion based on state (no flag-like tilting)
  const stateAnimations = {
    idle: 'animate-float hover:scale-105',
    thinking: 'animate-pulse',
    celebrating: 'animate-bounce',
    error: 'shake',
    suggesting: 'animate-float hover:scale-105',
  }[state];

  return (
    <div className="flex items-center gap-4">
      {/* Speech Bubble */}
      {message && (
        <div className="relative bg-white border border-blue-100 shadow-sm rounded-2xl px-4 py-3 text-sm text-gray-700 max-w-xs animate-fade-in">
          <p>{message}</p>
          {/* Bubble tail */}
          <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-r border-b border-blue-100 transform rotate-[-45deg]"></div>
        </div>
      )}

      {/* Mascot Image */}
      <div className="relative flex-shrink-0 cursor-pointer">
        <img
          src={mascotImage}
          alt="LinkedInk AI Mascot"
          className={`${sizeClasses} object-contain drop-shadow-md transition-all duration-300 ${stateAnimations}`}
        />
        {/* Status indicator dot */}
        <span className={`absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
          state === 'thinking' ? 'bg-amber-400' :
          state === 'celebrating' ? 'bg-green-500' :
          state === 'error' ? 'bg-red-500' : 'bg-blue-500'
        }`} />
      </div>
    </div>
  );
};