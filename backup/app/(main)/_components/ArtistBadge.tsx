"use client";

import React from "react";

interface ArtistBadgeProps {
  artistName: string;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export function ArtistBadge({ artistName, className, onClick }: ArtistBadgeProps) {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) {
      event.stopPropagation(); // Prevent click from bubbling to parent
      onClick(event);
    }
  };
  
  return (
    <div
      className={`border border-white/40 rounded-full px-3 py-1 bg-white/10 backdrop-blur-sm ${className || ""} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick ? handleClick : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `View artist ${artistName}` : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(e as any);} } : undefined}
      title={onClick ? `View artist ${artistName}` : artistName}
    >
      <p className="text-sm text-white font-medium truncate drop-shadow-sm max-w-[150px]" title={artistName}>
        {artistName}
      </p>
    </div>
  );
} 