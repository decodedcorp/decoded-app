'use client';

import React, { useMemo } from 'react';
import { ChannelResponse } from '@/api/generated/models/ChannelResponse';
import { ChannelCard } from './ChannelCard';

// Helper functions for category information
const getCategoryIcon = (category: string) => {
  // Remove icons, return empty string
  return '';
};

const getCategoryDescription = (category: string) => {
  const descriptions: Record<string, string> = {
    Technology: '혁신적 기술을 선별하는 전문 에디터들',
    Design: '창의적 시각을 제공하는 디자인 큐레이터들',
    Business: '비즈니스 인사이트를 전하는 편집 전문가들',
    Lifestyle: '라이프스타일을 재해석하는 독창적 에디터들',
    Education: '학습 경험을 설계하는 교육 큐레이터들',
    Entertainment: '문화 콘텐츠를 발굴하는 편집자들',
    Uncategorized: '다양한 관점을 제시하는 큐레이터들',
    uncategorized: '다양한 관점을 제시하는 큐레이터들',
  };
  return descriptions[category] || '독특한 편집 철학을 가진 큐레이터들';
};

const getChannelQuality = (channels: ChannelResponse[]) => {
  const avgContent =
    channels.reduce((sum, ch) => sum + (ch.content_count || 0), 0) / channels.length;
  if (avgContent > 100) return '마스터 에디터';
  if (avgContent > 50) return '검증된 큐레이터';
  return '신진 편집자';
};

interface CategorySectionProps {
  title: string;
  channels: ChannelResponse[];
  onChannelClick: (channel: ChannelResponse) => void;
  onViewAll?: () => void;
  className?: string;
}

export function CategorySection({
  title,
  channels,
  onChannelClick,
  onViewAll,
  className = '',
}: CategorySectionProps) {
  if (channels.length === 0) {
    return null;
  }

  // Show up to 6 channels in horizontal scroll
  const displayChannels = channels.slice(0, 6);

  return (
    <section className={`mb-16 ${className}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-400 mb-1">{title}</h2>
          <p className="text-gray-500 text-sm mb-1">
            {channels.length}명의 큐레이터 • {getCategoryDescription(title)}
          </p>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span className="bg-zinc-800/50 px-2 py-1 rounded-full">
              {getChannelQuality(channels)}
            </span>
            <span>• 독창적 편집 관점</span>
          </div>
        </div>

        {channels.length > 6 && onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center space-x-2 px-4 py-2 bg-zinc-800/50 hover:bg-zinc-700/50 rounded-lg transition-colors duration-200 text-zinc-300 hover:text-white"
          >
            <span className="text-sm font-medium">View All</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Horizontal Scrollable Grid */}
      <div className="relative">
        <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent">
          <div className="flex space-x-4 min-w-max">
            {displayChannels.map((channel) => (
              <div key={channel.id} className="flex-shrink-0 w-72">
                <ChannelCard
                  key={channel.id}
                  channel={channel}
                  size="small"
                  onCardClick={onChannelClick}
                  className="h-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Gradient fade edges for better visual flow */}
        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black to-transparent pointer-events-none" />
      </div>
    </section>
  );
}

interface TrendingSectionProps {
  channels: ChannelResponse[];
  onChannelClick: (channel: ChannelResponse) => void;
  className?: string;
}

export function TrendingSection({
  channels,
  onChannelClick,
  className = '',
}: TrendingSectionProps) {
  // Get top trending channels (most subscribers + content)
  const trendingChannels = useMemo(() => {
    return [...channels]
      .sort((a, b) => {
        const scoreA = (a.subscriber_count || 0) + (a.content_count || 0) * 10;
        const scoreB = (b.subscriber_count || 0) + (b.content_count || 0) * 10;
        return scoreB - scoreA;
      })
      .slice(0, 8);
  }, [channels]);

  if (trendingChannels.length === 0) {
    return null;
  }

  return (
    <section className={`mb-16 ${className}`}>
      {/* Section Header */}
      <div className="mb-8">
        <div className="mb-2">
          <h2 className="text-2xl font-bold text-gray-400">주목받는 에디터</h2>
        </div>
        <p className="text-gray-500 text-sm mb-2">
          뛰어난 편집 능력과 독창적 큐레이션으로 주목받는 에디터들
        </p>
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <span>편집 트렌드 선도</span>
          <span>•</span>
          <span>전문성 인정받음</span>
          <span>•</span>
          <span>독자 선호도 높음</span>
        </div>
      </div>

      {/* All trending channels in uniform grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {trendingChannels.slice(0, 8).map((channel) => (
          <ChannelCard
            key={channel.id}
            channel={channel}
            onCardClick={onChannelClick}
            size="medium"
            className="h-full"
          />
        ))}
      </div>
    </section>
  );
}
