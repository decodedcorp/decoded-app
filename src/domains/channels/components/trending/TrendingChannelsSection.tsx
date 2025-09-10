'use client';

import React, { useState } from 'react';
import { useTrendingChannels, TrendingType } from '../../hooks/useTrending';
import { TrendingChannelCard } from './TrendingChannelCard';
import { LoadingState, ErrorState } from '../common/LoadingStates';
import { useChannelTranslation, useCommonTranslation } from '../../../../lib/i18n/hooks';

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
        <LoadingState title={trending.loading()} />
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
        <div className="flex items-center bg-zinc-800/50 rounded-lg p-1">
          <button
            onClick={() => setActiveType('popular')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeType === 'popular'
                ? 'bg-[#eafd66] text-black'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {trending.popular()}
          </button>
          <button
            onClick={() => setActiveType('trending')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeType === 'trending'
                ? 'bg-[#eafd66] text-black'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {trending.trendingNow()}
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
          <div className="text-center mt-6">
            <button className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors duration-200">
              {trending.viewAll()}
            </button>
          </div>
        </>
      )}
    </section>
  );
}