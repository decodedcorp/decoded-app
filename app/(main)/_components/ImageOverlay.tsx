'use client';

import React from 'react';
import { TypeWriter } from './TypeWriter';

interface ImageOverlayProps {
  isOpen: boolean;
  isCurrentlyHovered: boolean;
  onClose: () => void;
}

export function ImageOverlay({ isOpen, isCurrentlyHovered, onClose }: ImageOverlayProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="absolute inset-0 bg-black/90 backdrop-blur-sm z-[9999] transition-all duration-300 transform-gpu pointer-events-auto"
      style={{
        width: '100%',
        height: '100%',
        transform: isCurrentlyHovered ? 'scale(1.05)' : 'scale(1)',
        opacity: 0,
        animation: 'slideDown 0.3s ease-out forwards'
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div className="p-4 text-white h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">이미지 상세 정보</h3>
          <button 
            className="text-white/70 hover:text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            ✕
          </button>
        </div>
        <div className="text-sm text-neutral-300">
          <TypeWriter />
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%) scale(1);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(${isCurrentlyHovered ? '1.05' : '1'});
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
} 