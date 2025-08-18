'use client';

import React, { memo, useState, useCallback } from 'react';
import { useChannelHighlights } from '@/domains/channels/hooks/useChannelHighlights';
import { HighlightItem } from '@/lib/types/highlightTypes';
import HighlightCard from './HighlightCard';

interface CommunityHighlightsProps {
  channelId: string;
  onItemClick?: (highlight: HighlightItem) => void;
  className?: string;
}

const CommunityHighlights = memo(function CommunityHighlights({
  channelId,
  onItemClick,
  className = '',
}: CommunityHighlightsProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const { highlights, isLoading, error, hasHighlights, refetch } = useChannelHighlights(channelId);

  const handleItemClick = useCallback(
    (highlight: HighlightItem) => {
      onItemClick?.(highlight);
    },
    [onItemClick],
  );

  const handleToggleExpanded = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  // Don't render if no highlights available
  if (!hasHighlights && !isLoading) {
    return null;
  }

  // Don't render if there's an error
  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[CommunityHighlights] Error loading highlights:', error);
    }
    return null;
  }

  return (
    <div className={`mt-10 border-b border-zinc-700/30 ${className}`}>
      {/* Collapsed state - Toggle button */}
      {!isExpanded && (
        <div className="py-2">
          <button
            onClick={handleToggleExpanded}
            className="flex items-center justify-between w-full text-left group hover:bg-zinc-800/30 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-3">
              <svg
                className="w-4 h-4 text-zinc-400 transition-transform duration-200"
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
              <div className="flex items-center space-x-2">
                <span className="text-sm text-zinc-400">Pinned</span>
                {isLoading && (
                  <div className="w-3 h-3 border border-zinc-400 border-t-transparent rounded-full animate-spin" />
                )}
              </div>
            </div>

            {/* Preview of highlight count */}
            {highlights.length > 0 && (
              <span className="text-sm text-zinc-400">{highlights.length} pinned</span>
            )}
          </button>
        </div>
      )}

      {/* Expanded state - Full highlights display */}
      {isExpanded && (
        <div className="bg-zinc-900/20">
          {/* Header with collapse button */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleToggleExpanded}
              className="flex items-center space-x-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <svg
                className="w-4 h-4 transition-transform duration-200 rotate-180"
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
              <span>Hide pinned</span>
            </button>
          </div>

          {/* Highlights grid */}
          {isLoading ? (
            /* Loading skeleton */
            <div className="flex space-x-4 overflow-x-hidden">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="w-80 h-40 bg-zinc-800/50 border border-zinc-700/50 rounded-xl animate-pulse flex-shrink-0"
                />
              ))}
            </div>
          ) : highlights.length > 0 ? (
            <div className="flex space-x-4 overflow-x-auto overflow-y-hidden pb-2 scrollbar-hide">
              {highlights.map((highlight) => {
                return (
                  <HighlightCard
                    key={highlight.id}
                    highlight={highlight}
                    onClick={() => handleItemClick(highlight)}
                    size="medium"
                  />
                );
              })}
            </div>
          ) : (
            /* Empty state */
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-3 bg-zinc-800/50 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-zinc-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2c1.103 0 2 .897 2 2v8.586l4.707 4.707c.391.391.391 1.023 0 1.414s-1.023.391-1.414 0L12 13.414 6.707 18.707c-.391.391-1.023.391-1.414 0s-.391-1.023 0-1.414L10 12.586V4c0-1.103.897-2 2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-zinc-400 mb-1">No pinned content yet</h3>
              <p className="text-sm text-zinc-500">
                Pinned content will appear here as the community creates engaging content
              </p>
            </div>
          )}
        </div>
      )}

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
});

CommunityHighlights.displayName = 'CommunityHighlights';

export default CommunityHighlights;
