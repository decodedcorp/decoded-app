'use client';

import React from 'react';

import { TrendingChannelItem } from '@/api/generated/models/TrendingChannelItem';
import { useChannelModalStore } from '@/store/channelModalStore';
import { ContentFallback } from '@/components/FallbackImage';

interface TrendingChannelCardProps {
  channel: TrendingChannelItem;
  className?: string;
}

export function TrendingChannelCard({ channel, className = '' }: TrendingChannelCardProps) {
  const openChannelModal = useChannelModalStore((state) => state.openModal);

  const handleClick = () => {
    openChannelModal({
      id: channel.id,
      name: channel.name,
      description: channel.description || null,
      thumbnail_url: channel.thumbnail_url || null,
      banner_url: null,
      owner_id: '',
      subscriber_count: channel.subscribers_count || 0,
      content_count: channel.contents_count || 0,
      category: null,
      subcategory: null,
    });
  };

  const formatNumber = (num?: number) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <article
      className={`bg-zinc-900/50 border border-zinc-800/50 rounded-lg overflow-hidden cursor-pointer hover:shadow-xl hover:border-zinc-700 hover:bg-zinc-800/50 transition-all duration-300 ${className}`}
      onClick={handleClick}
    >
      <div className="aspect-video bg-zinc-800 overflow-hidden">
        {channel.thumbnail_url ? (
          <img
            src={channel.thumbnail_url}
            alt={channel.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Hide broken image and show fallback
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'block';
            }}
          />
        ) : null}

        {/* Fallback Content */}
        <ContentFallback
          className={`w-full h-full ${channel.thumbnail_url ? 'hidden' : 'block'}`}
        />
      </div>

      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-white text-sm line-clamp-2 leading-tight">
            {channel.name}
          </h3>
          {channel.description && (
            <p className="text-zinc-400 text-xs mt-2 line-clamp-3 leading-relaxed">
              {channel.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center space-x-3">
            {channel.subscribers_count !== undefined && (
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{formatNumber(channel.subscribers_count)}</span>
              </div>
            )}
            {channel.contents_count !== undefined && (
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{formatNumber(channel.contents_count)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
