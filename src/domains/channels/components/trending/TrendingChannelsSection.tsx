'use client';

import React, { useState } from 'react';
import { Flame, TrendingUp } from 'lucide-react';

import { useTrendingChannels, TrendingType } from '../../hooks/useTrending';
import { LoadingState, ErrorState } from '../common/LoadingStates';
import { LoadingSkeleton } from '@/shared/components/loading/LoadingSkeleton';
import { useChannelTranslation, useCommonTranslation } from '../../../../lib/i18n/hooks';

import { TrendingChannelCard } from './TrendingChannelCard';

interface TrendingChannelsSectionProps {
  className?: string;
}

export function TrendingChannelsSection({ className = '' }: TrendingChannelsSectionProps) {
  const [activeType, setActiveType] = useState<TrendingType>('popular');

  const { data, isLoading, error } = useTrendingChannels(activeType, 12);
  const { trending, states } = useChannelTranslation();
  const { ui } = useCommonTranslation();

  if (isLoading) {
    return (
      <section className={`${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-400 mb-2">{trending.title()}</h2>
            <p className="text-zinc-500 text-sm">{trending.subtitle()}</p>
          </div>
        </div>
        {/* 가로 스크롤 채널 카드 스켈레톤 */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-3 pb-4" style={{ width: 'max-content' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-64 flex-shrink-0">
                <div className="aspect-square bg-zinc-800 rounded-lg animate-pulse mb-3" />
                <div className="h-4 w-3/4 bg-zinc-800 rounded animate-pulse mb-2" />
                <div className="h-3 w-1/2 bg-zinc-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-400 mb-2">{trending.title()}</h2>
            <p className="text-zinc-500 text-sm">{trending.subtitle()}</p>
          </div>
        </div>
        <ErrorState title={trending.error()} subtitle={trending.errorSubtitle()} />
      </section>
    );
  }

  const channels = data?.channels || [];

  return (
    <section className={`${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-400 mb-2">{trending.title()}</h2>
          <p className="text-zinc-500 text-sm">{trending.subtitle()}</p>
        </div>

        {/* Popular/Trending Toggle */}
        <div className="flex gap-1 bg-zinc-900 rounded-lg p-1 border border-zinc-700">
          <button
            onClick={() => setActiveType('popular')}
            className={`
              px-2 md:px-4 py-2 text-sm rounded-md transition-all duration-200 font-medium
              ${
                activeType === 'popular'
                  ? 'text-black bg-[#eafd66] shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-zinc-800'
              }
            `}
          >
            {/* 모바일에서는 아이콘만, 데스크톱에서는 텍스트만 */}
            <span className="md:hidden">
              <Flame className="w-4 h-4" />
            </span>
            <span className="hidden md:inline">{trending.popular()}</span>
          </button>
          <button
            onClick={() => setActiveType('trending')}
            className={`
              px-2 md:px-4 py-2 text-sm rounded-md transition-all duration-200 font-medium
              ${
                activeType === 'trending'
                  ? 'text-black bg-[#eafd66] shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-zinc-800'
              }
            `}
          >
            {/* 모바일에서는 아이콘만, 데스크톱에서는 텍스트만 */}
            <span className="md:hidden">
              <TrendingUp className="w-4 h-4" />
            </span>
            <span className="hidden md:inline">{trending.trendingNow()}</span>
          </button>
        </div>
      </div>

      {/* Content Area - Conditional */}
      {!channels.length ? (
        <div className="text-center py-12">
          <p className="text-zinc-500">{trending.empty()}</p>
        </div>
      ) : (
        <>
          {/* Horizontal Scroll Grid */}
          <div className="overflow-x-auto scrollbar-hide" style={{ maxWidth: '100%' }}>
            <div className="flex space-x-3 pb-4" style={{ width: 'max-content' }}>
              {channels.map((channel) => (
                <TrendingChannelCard
                  key={channel.id}
                  channel={channel}
                  className="w-64 flex-shrink-0"
                />
              ))}
            </div>
          </div>

          {/* View All Button */}
          {/* <div className="text-center mt-6">
            <button className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors duration-200">
              {trending.viewAll()}
            </button>
          </div> */}
        </>
      )}
    </section>
  );
}
