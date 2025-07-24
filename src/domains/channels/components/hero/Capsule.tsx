'use client';

import React from 'react';

interface CapsuleProps {
  name: string;
  img?: string;
  onClick?: () => void;
  isExpanded?: boolean;
}

export function Capsule({ name, img, onClick, isExpanded }: CapsuleProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      className={`
        flex items-center border border-zinc-700 rounded-full px-5 py-2 mr-3 min-w-[160px] max-w-xs
        transition-all duration-300 cursor-pointer
        ${
          isExpanded
            ? 'bg-zinc-800 border-zinc-500 scale-105 shadow-lg'
            : 'hover:bg-zinc-800 hover:border-zinc-500 hover:scale-102'
        }
      `}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Explore ${name} channel`}
      aria-pressed={isExpanded}
    >
      {img && (
        <img src={img} alt={`${name} avatar`} className="w-7 h-7 rounded-full object-cover mr-2" />
      )}
      <span className="text-white font-thin text-lg whitespace-nowrap truncate">{name}</span>
    </div>
  );
}
