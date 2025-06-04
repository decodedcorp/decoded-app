'use client';

import React from 'react';

interface ImageHeaderProps {
  onClick: (e: React.MouseEvent) => void;
}

export function ImageHeader({ onClick }: ImageHeaderProps) {
  return (
    <div 
      className="absolute top-2 left-1/2 -translate-x-1/2 h-8 px-3 z-[1000] flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-auto"
      onClick={onClick}
    >
      <svg 
        className="w-5 h-5 text-white hover:text-white/80 transition-colors animate-float" 
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
    </div>
  );
} 