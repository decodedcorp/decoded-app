'use client';

import React, { useMemo } from 'react';
import { ChannelResponse } from '@/api/generated/models/ChannelResponse';
import { ChannelCard } from './ChannelCard';
import { ExploreFilters } from '../../types/filters';
import { EmptyState } from '../common/LoadingStates';
import { filterChannelsByCategory } from '../../utils/categoryUtils';

interface ExploreGridProps {
  channels: ChannelResponse[];
  filters: ExploreFilters;
  onChannelClick: (channel: ChannelResponse) => void;
  className?: string;
}

export function ExploreGrid({ 
  channels, 
  filters, 
  onChannelClick, 
  className = '' 
}: ExploreGridProps) {
  // Filter and sort channels based on current filters
  const processedChannels = useMemo(() => {
    let filtered = [...channels];

    // Apply search filter
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();
      filtered = filtered.filter(channel => 
        channel.name.toLowerCase().includes(searchTerm) ||
        (channel.description && channel.description.toLowerCase().includes(searchTerm)) ||
        (channel.category && channel.category.toLowerCase().includes(searchTerm)) ||
        (channel.subcategory && channel.subcategory.toLowerCase().includes(searchTerm))
      );
    }

    // Apply category and subcategory filters
    filtered = filterChannelsByCategory(filtered, filters.category, filters.subcategory);

    // Apply sorting
    filtered.sort((a, b) => {
      const order = filters.sortOrder === 'desc' ? -1 : 1;
      
      switch (filters.sortBy) {
        case 'recent':
          return order * (new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
        case 'popular':
          return order * ((b.subscriber_count || 0) - (a.subscriber_count || 0));
        case 'content':
          return order * ((b.content_count || 0) - (a.content_count || 0));
        case 'subscribers':
          return order * ((b.subscriber_count || 0) - (a.subscriber_count || 0));
        default:
          return 0;
      }
    });

    return filtered;
  }, [channels, filters]);


  if (processedChannels.length === 0) {
    const searchIcon = (
      <svg 
        className="w-16 h-16 text-zinc-600 mb-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
        />
      </svg>
    );

    return (
      <div className={`py-24 ${className}`}>
        <EmptyState
          icon={searchIcon}
          title="No channels found"
          subtitle={
            filters.search.trim() 
              ? `No channels match "${filters.search}". Try adjusting your search terms or filters.`
              : 'No channels match your current filters. Try adjusting your filter criteria.'
          }
        />
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Results count */}
      <div className="mb-6">
        <p className="text-zinc-400 text-sm">
          {processedChannels.length.toLocaleString()} channels found
          {filters.search.trim() && (
            <span> for "{filters.search}"</span>
          )}
        </p>
      </div>

      {/* Magazine Style Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {processedChannels.map((channel) => (
          <div key={channel.id}>
            <ChannelCard
              channel={channel}
              size="medium"
              onCardClick={onChannelClick}
              className="h-full"
            />
          </div>
        ))}
      </div>

      {/* Load more indicator */}
      {processedChannels.length > 0 && (
        <div className="mt-12 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-zinc-800/50 rounded-full text-zinc-400 text-sm">
            <span>Showing {processedChannels.length} of {channels.length} channels</span>
          </div>
        </div>
      )}
    </div>
  );
}