'use client';

import React, { useState } from 'react';
import { TypeWriter } from './TypeWriter';

interface ImageOverlayProps {
  isOpen: boolean;
  isCurrentlyHovered: boolean;
  onClose: () => void;
}

export function ImageOverlay({ isOpen, isCurrentlyHovered, onClose }: ImageOverlayProps) {
  const [isClosing, setIsClosing] = useState(false);

  if (!isOpen) return null;

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 transition-all duration-200 transform-gpu"
      style={{
        transform: isCurrentlyHovered ? 'scale(1.05)' : 'scale(1)',
        animation: isClosing ? 'slideUp 0.2s ease-out forwards' : 'slideDown 0.2s ease-out forwards'
      }}
      onClick={handleClose}
    >
      <div className="relative w-full h-full flex flex-col items-center">
        <button 
          className="absolute top-3 left-1/2 -translate-x-1/2 text-white/70 hover:text-white transition-all duration-150 p-1.5 rounded-full hover:bg-white/10"
          onClick={handleClose}
        >
          <svg 
            className={`w-5 h-5 transition-transform duration-150 ${isClosing ? 'rotate-0' : 'rotate-180'}`}
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

        <div className="w-full max-w-3xl px-6 py-6 mt-12">
          <div className="text-sm text-neutral-300 leading-relaxed">
            <TypeWriter />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            clip-path: inset(0 0 100% 0);
            opacity: 0;
          }
          to {
            clip-path: inset(0 0 0 0);
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            clip-path: inset(0 0 0 0);
            opacity: 1;
          }
          to {
            clip-path: inset(0 0 100% 0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
} 