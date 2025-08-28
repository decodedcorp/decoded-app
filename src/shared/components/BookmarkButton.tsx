'use client';

import React from 'react';
import { BookmarkIcon as BookmarkOutlineIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';

import { useCheckBookmarkStatus, useBookmarkMutations } from '@/domains/bookmarks/hooks/useBookmarks';
import { useAuthStore } from '@/store/authStore';

interface BookmarkButtonProps {
  contentId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showTooltip?: boolean;
}

export function BookmarkButton({ 
  contentId, 
  size = 'md', 
  className = '',
  showTooltip = false 
}: BookmarkButtonProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  // Check bookmark status
  const { data: statusData, isLoading: statusLoading } = useCheckBookmarkStatus(contentId);
  const isBookmarked = statusData?.is_bookmarked || false;
  
  // Bookmark mutations
  const { addBookmark, removeBookmark } = useBookmarkMutations();
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const buttonSizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
  };

  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent click handlers
    
    if (!isAuthenticated) {
      // TODO: Show login modal
      console.log('User needs to login to bookmark');
      return;
    }

    if (statusLoading) return;

    if (isBookmarked) {
      removeBookmark.mutate(contentId);
    } else {
      addBookmark.mutate(contentId);
    }
  };

  if (!isAuthenticated) {
    return null; // Don't show bookmark button for non-authenticated users
  }

  const isLoading = statusLoading || addBookmark.isPending || removeBookmark.isPending;

  return (
    <div className="relative">
      <button
        onClick={handleToggleBookmark}
        disabled={isLoading}
        className={`
          ${buttonSizeClasses[size]}
          rounded-lg transition-all duration-200
          ${isBookmarked 
            ? 'text-[#EAFD66] hover:text-[#d9ec55] bg-[#EAFD66]/10 hover:bg-[#EAFD66]/20' 
            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
        aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
      >
        {isBookmarked ? (
          <BookmarkSolidIcon className={sizeClasses[size]} />
        ) : (
          <BookmarkOutlineIcon className={sizeClasses[size]} />
        )}
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-800 text-xs text-white rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        </div>
      )}
    </div>
  );
}