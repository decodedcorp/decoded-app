'use client';

import React from 'react';

import { useRouter } from 'next/navigation';
import { TrendingContentItem } from '@/api/generated/models/TrendingContentItem';
import { useChannel } from '../../hooks/useChannels';
import { AvatarFallback } from '@/components/FallbackImage';
import { useRecentContentStore } from '@/store/recentContentStore';

interface TrendingContentCardProps {
  content: TrendingContentItem;
  className?: string;
}

export function TrendingContentCard({ content, className = '' }: TrendingContentCardProps) {
  const router = useRouter();
  const { addContent } = useRecentContentStore();

  // Get channel data for thumbnail
  const { data: channelData } = useChannel(content.channel_id);

  const handleContentClick = () => {
    // 최근 본 콘텐츠에 추가
    addContent({
      id: String(content.id),
      channelId: content.channel_id,
      title: content.title || '제목 없음',
      thumbnailUrl: content.thumbnail_url || undefined,
    });

    // Navigate to channel page with content modal
    router.push(`/channels/${content.channel_id}?content=${content.id}`);
  };

  const handleChannelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Navigate to channel page only
    router.push(`/channels/${content.channel_id}`);
  };

  return (
    <article
      className={`relative rounded-lg overflow-hidden aspect-square group cursor-pointer hover:shadow-xl transition-all duration-300 ${className}`}
      onClick={handleContentClick}
    >
      {/* Background Image - Full Size */}
      <div className="absolute inset-0">
        {content.thumbnail_url ? (
          <img
            src={content.thumbnail_url}
            alt={content.title || ''}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
            <span className="text-zinc-500 text-sm">이미지 없음</span>
          </div>
        )}
      </div>

      {/* Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {/* Content Overlay - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        {/* Title */}
        <h3 className="font-semibold text-lg mb-1 line-clamp-2 leading-tight">
          {content.title || '제목 없음'}
        </h3>

        {/* Description */}
        {content.description && (
          <p className="text-gray-300 text-sm mb-3 line-clamp-2 leading-relaxed">
            {content.description}
          </p>
        )}

        {/* Channel Info Row */}
        <div className="flex items-center">
          <button
            onClick={handleChannelClick}
            className="flex items-center space-x-2 hover:bg-white/10 rounded-lg p-1 -ml-1 transition-colors cursor-pointer"
          >
            {/* Channel Icon with Fallback */}
            {channelData?.thumbnail_url ? (
              <img
                src={channelData.thumbnail_url}
                alt={channelData.name || ''}
                className="w-6 h-6 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <AvatarFallback
                size="sm"
                fallbackText={content.channel_name?.charAt(0).toUpperCase() || 'C'}
                className="w-6 h-6"
              />
            )}

            {/* Channel Name */}
            <span className="text-sm font-medium truncate">{content.channel_name}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
