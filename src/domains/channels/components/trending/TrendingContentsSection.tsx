'use client';

import React, { useState } from 'react';
import { useTrendingContents, TrendingType } from '../../hooks/useTrending';
import { TrendingContentCard } from './TrendingContentCard';
import { LoadingState, ErrorState } from '../common/LoadingStates';

interface TrendingContentsSectionProps {
  className?: string;
}

export function TrendingContentsSection({ className = '' }: TrendingContentsSectionProps) {
  const [activeType, setActiveType] = useState<TrendingType>('popular');
  
  const { data, isLoading, error } = useTrendingContents(activeType, 12);

  if (isLoading) {
    return (
      <section className={`${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-400 mb-2">인기 콘텐츠</h2>
            <p className="text-zinc-500 text-sm">모든 채널에서 화제가 되고 있는 인기 콘텐츠들</p>
          </div>
        </div>
        <LoadingState title="인기 콘텐츠를 불러오는 중..." />
      </section>
    );
  }

  if (error) {
    return (
      <section className={`${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-400 mb-2">인기 콘텐츠</h2>
            <p className="text-zinc-500 text-sm">모든 채널에서 화제가 되고 있는 인기 콘텐츠들</p>
          </div>
        </div>
        <ErrorState title="콘텐츠를 불러올 수 없습니다" subtitle="잠시 후 다시 시도해 주세요" />
      </section>
    );
  }

  const contents = data?.content || [];

  return (
    <section className={`${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-400 mb-2">인기 콘텐츠</h2>
          <p className="text-zinc-500 text-sm">모든 채널에서 화제가 되고 있는 인기 콘텐츠들</p>
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
            인기
          </button>
          <button
            onClick={() => setActiveType('trending')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeType === 'trending'
                ? 'bg-[#eafd66] text-black'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            트렌딩
          </button>
        </div>
      </div>

      {/* Content Area - Conditional */}
      {!contents.length ? (
        <div className="text-center py-12">
          <p className="text-zinc-500">표시할 콘텐츠가 없습니다</p>
        </div>
      ) : (
        <>
          {/* Horizontal Scroll Grid */}
          <div className="overflow-x-auto scrollbar-hide" style={{ maxWidth: '100%' }}>
            <div className="flex space-x-3 pb-4" style={{ width: 'max-content' }}>
              {contents.map((content) => (
                <TrendingContentCard
                  key={content.id}
                  content={content}
                  className="w-64 flex-shrink-0"
                />
              ))}
            </div>
          </div>

          {/* View All Button */}
          <div className="text-center mt-6">
            <button className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors duration-200">
              전체 보기
            </button>
          </div>
        </>
      )}
    </section>
  );
}