"use client";

import React from "react";

interface LikeDisplayProps {
  likeCount: number;
  isLiked?: boolean; // Optional: if you plan to show a "liked" state
  onLikeClick?: (event: React.MouseEvent<HTMLDivElement>) => void; // To handle like action
  className?: string;
}

export function LikeDisplay({ likeCount, isLiked, onLikeClick, className }: LikeDisplayProps) {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation(); // Prevent click from bubbling to parent
    onLikeClick?.(event);
  };

  return (
    <div
      className={`flex items-center ${className || ""} ${onLikeClick ? 'cursor-pointer' : ''}`}
      onClick={onLikeClick ? handleClick : undefined}
      role={onLikeClick ? "button" : undefined}
      tabIndex={onLikeClick ? 0 : undefined}
      aria-label={onLikeClick ? (isLiked ? "Unlike this item" : "Like this item") : undefined}
      onKeyDown={onLikeClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(e as any);} } : undefined}
      title={onLikeClick ? (isLiked ? "Unlike" : "Like") : `${likeCount.toLocaleString()} likes`}
    >
      <svg
        className={`w-5 h-5 ${isLiked ? "text-red-500" : "text-white/70"} mr-1.5 drop-shadow-sm`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
          clipRule="evenodd"
        ></path>
      </svg>
      <span className="text-sm text-white font-semibold drop-shadow-sm">
        {likeCount.toLocaleString()}
      </span>
    </div>
  );
} 