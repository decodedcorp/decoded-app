'use client';

import React from 'react';
import Link from 'next/link';

import { useRouter } from 'next/navigation';
import { TrendingContentItem } from '@/api/generated/models/TrendingContentItem';
import { toContentHref, toChannelHref, getContentLinkProps } from '@/lib/routing';

interface TrendingContentCardProps {
  content: TrendingContentItem;
  className?: string;
}

export function TrendingContentCard({ content, className = '' }: TrendingContentCardProps) {
  const router = useRouter();
  const contentUrl = toContentHref({ channelId: content.channel_id, contentId: content.id });
  const channelUrl = toChannelHref(content.channel_id);
  const linkProps = getContentLinkProps({ channelId: content.channel_id, contentId: content.id });

  const handleChannelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Navigate to channel page only
    router.push(channelUrl);
  };

  return (
    <Link
      {...linkProps}
      className={`relative rounded-lg overflow-hidden aspect-square group cursor-pointer hover:shadow-xl transition-all duration-300 block focus:outline-none focus:ring-2 focus:ring-primary-500 ${className}`}
      aria-label={`${content.title || '제목 없음'} 콘텐츠 보기`}
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
            className="flex items-center space-x-2 hover:bg-white/10 rounded-lg p-1 -ml-1 transition-colors"
          >
            {/* Channel Icon */}
            <div className="w-6 h-6 rounded-full bg-gray-600/80 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-medium text-white">
                {content.channel_name?.charAt(0).toUpperCase() || 'C'}
              </span>
            </div>

            {/* Channel Name */}
            <span className="text-sm font-medium truncate">{content.channel_name}</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
