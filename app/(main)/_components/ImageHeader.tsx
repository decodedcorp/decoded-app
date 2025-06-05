'use client';

import React from 'react';

interface ImageHeaderProps {
  onClick: (e: React.MouseEvent) => void;
  isOverlayOpen?: boolean;
}

export function ImageHeader({ onClick, isOverlayOpen = false }: ImageHeaderProps) {
  return (
    <div className="absolute top-0 left-0 right-0 z-10">
      <div className="absolute top-3 left-1/2 -translate-x-1/2 animate-float">
        <button 
          className="text-white/70 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
          onClick={onClick}
        >
          <svg 
            className={`w-5 h-5 transition-transform duration-300 ${isOverlayOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translate(-50%, 0px);
          }
          50% {
            transform: translate(-50%, -5px);
          }
          100% {
            transform: translate(-50%, 0px);
          }
        }
        .animate-float {
          animation: float 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
} 