'use client';

import React, { memo, useState, useCallback, useMemo } from 'react';
import { useChannelPins } from '@/domains/channels/hooks/useChannelPins';
import { useContentsByIds } from '@/domains/channels/hooks/useContentsByIds';
import { HighlightItem } from '@/lib/types/highlightTypes';
import { UnifiedPinnedItem } from '@/api/generated/models/UnifiedPinnedItem';
import { ContentItem } from '@/lib/types/content';
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

  const { data: pinsData, isLoading: pinsLoading, error: pinsError } = useChannelPins(channelId);

  // Extract content IDs from pins data for batch fetching
  const contentIds = useMemo(() => {
    if (!pinsData?.items) return [];
    return pinsData.items
      .filter((pin: UnifiedPinnedItem) => pin.type === 'content')
      .map((pin: UnifiedPinnedItem) => pin.id);
  }, [pinsData?.items]);

  // Fetch content data for all pinned content items
  const { 
    contentMap, 
    isLoadingAny: contentsLoading, 
    hasErrors: hasContentErrors 
  } = useContentsByIds({
    contentIds,
    enabled: contentIds.length > 0
  });

  // Convert UnifiedPinnedItem + ContentItem to HighlightItem format
  const highlights = useMemo(() => {
    if (!pinsData?.items) return [];
    
    return pinsData.items.map((pin: UnifiedPinnedItem): HighlightItem => {
      const isContent = pin.type === 'content';
      const contentItem = isContent ? contentMap.get(pin.id) : null;
      
      // Use content data if available, otherwise fallback to pin metadata
      const title = contentItem?.title || pin.name;
      const baseDescription = contentItem?.description || 
        (isContent ? pin.content_metadata?.description : pin.folder_metadata?.description);
      const imageUrl = contentItem?.imageUrl || 
        (isContent ? pin.content_metadata?.thumbnail_url : undefined);
      
      // Pin note가 있으면 description에 추가
      const finalDescription = pin.pin_note 
        ? `${baseDescription ? `${baseDescription}\n\n` : ''}📌 ${pin.pin_note}`
        : baseDescription;
      
      return {
        id: pin.id,
        title,
        description: finalDescription || undefined,
        imageUrl: imageUrl || undefined,
        badge: 'Pinned',
        type: 'recent', // All pinned items treated as recent type
        date: new Date(pin.pinned_at).toLocaleDateString(),
        priority: pin.pin_order,
        clickAction: {
          type: 'content_modal',
          data: contentItem || { id: pin.id, type: pin.type, pinNote: pin.pin_note }
        },
      };
    }).sort((a: HighlightItem, b: HighlightItem) => a.priority - b.priority); // Sort by pin_order
  }, [pinsData?.items, contentMap]);

  const hasHighlights = highlights.length > 0;
  const isLoading = pinsLoading || contentsLoading;
  const error = pinsError || (hasContentErrors ? new Error('Failed to load some content data') : null);

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
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.error('[CommunityHighlights] Error loading pins:', error);
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
              {Array.from({ length: 4 }).map((_: any, index: number) => (
                <div
                  key={index}
                  className="w-80 h-40 bg-zinc-800/50 border border-zinc-700/50 rounded-xl animate-pulse flex-shrink-0"
                />
              ))}
            </div>
          ) : highlights.length > 0 ? (
            <div className="flex space-x-4 overflow-x-auto overflow-y-hidden pb-2 scrollbar-hide">
              {highlights.map((highlight: HighlightItem) => {
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
