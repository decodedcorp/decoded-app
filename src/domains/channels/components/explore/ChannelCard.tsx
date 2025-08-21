'use client';

import React from 'react';
import { ChannelResponse } from '@/api/generated/models/ChannelResponse';
import { ProxiedImage } from '@/components/ProxiedImage';

interface ChannelCardProps {
  channel: ChannelResponse;
  onClick: (channel: ChannelResponse) => void;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  highlightCategory?: boolean; // For recommended section
}

const CARD_SIZES = {
  small: {
    container: 'aspect-[4/3]',
    image: 'h-32',
    title: 'text-base',
    description: 'text-sm line-clamp-2',
    stats: 'text-xs',
  },
  medium: {
    container: 'aspect-[3/4] md:aspect-[4/5]',
    image: 'h-40 md:h-48',
    title: 'text-lg',
    description: 'text-sm line-clamp-3',
    stats: 'text-xs',
  },
  large: {
    container: 'aspect-[16/10]',
    image: 'h-48 md:h-56',
    title: 'text-xl md:text-2xl',
    description: 'text-base line-clamp-4',
    stats: 'text-sm',
  },
};

export function ChannelCard({
  channel,
  onClick,
  size = 'medium',
  className = '',
  highlightCategory = false,
}: ChannelCardProps) {
  const sizeStyles = CARD_SIZES[size];

  const formatCount = (count: number | undefined) => {
    if (!count) return '0';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  const handleClick = () => {
    onClick(channel);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${channel.name} 큐레이터의 편집 컬렉션 보기`}
      className={`
        group relative bg-zinc-900/50 rounded-xl overflow-hidden border border-zinc-800/50
        hover:border-zinc-600/50 hover:bg-zinc-900/70 hover:shadow-lg hover:shadow-black/20
        hover:scale-[1.02] transition-all duration-300 cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
        ${sizeStyles.container} ${className}
      `}
    >
      {/* Channel Thumbnail */}
      <div
        className={`relative ${sizeStyles.image} overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900`}
      >
        {channel.thumbnail_url ? (
          <ProxiedImage
            src={channel.thumbnail_url}
            downloadedSrc={channel.thumbnail_url}
            alt={`${channel.name} thumbnail`}
            width={400}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20">
            <span
              className={`font-bold text-white/80 ${
                size === 'large' ? 'text-4xl' : size === 'medium' ? 'text-2xl' : 'text-xl'
              }`}
            >
              {channel.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Content Count Badge */}
        {channel.content_count && channel.content_count > 0 && (
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
            <span className="text-white text-xs font-medium">
              {formatCount(channel.content_count)} items
            </span>
          </div>
        )}
      </div>

      {/* Channel Info */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Channel Name */}
        <h3
          className={`font-semibold text-gray-400 mb-2 group-hover:text-gray-300 transition-colors line-clamp-2 ${sizeStyles.title}`}
        >
          {channel.name}
        </h3>

        {/* Description */}
        {channel.description ? (
          <p className={`text-gray-500 mb-3 flex-grow ${sizeStyles.description}`}>
            {channel.description}
          </p>
        ) : (
          <p className={`text-gray-600 mb-3 flex-grow ${sizeStyles.description} italic`}>
            {channel.content_count || 0}개의 엄선된 콘텐츠로 구성된 전문 에디터의 큐레이션
          </p>
        )}

        {/* Channel Tags/Keywords */}
        <div className="flex flex-wrap gap-1 mb-3">
          {/* Category removed - not available in current API */}
          {(channel.content_count || 0) > 50 && (
            <span className="px-2 py-1 bg-zinc-800/50 text-gray-400 rounded-full text-xs font-medium">
              전문 큐레이션
            </span>
          )}
          {(channel.subscriber_count || 0) > 100 && (
            <span className="px-2 py-1 bg-zinc-800/50 text-gray-400 rounded-full text-xs font-medium">
              인기 에디터
            </span>
          )}
        </div>

        {/* Stats Row */}
        <div className={`flex items-center justify-between text-gray-500 ${sizeStyles.stats}`}>
          <div className="flex items-center space-x-4">
            {/* Subscriber Count */}
            <div className="flex items-center space-x-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span>{formatCount(channel.subscriber_count)}</span>
            </div>

            {/* Created Date */}
            {channel.created_at && (
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{formatDate(channel.created_at)}</span>
              </div>
            )}
          </div>

          {/* Arrow Icon */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}
