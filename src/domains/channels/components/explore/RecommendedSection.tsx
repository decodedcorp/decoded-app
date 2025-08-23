'use client';

import React from 'react';
import { ChannelResponse } from '@/api/generated/models/ChannelResponse';
import { ChannelCard } from './ChannelCard';

interface RecommendedSectionProps {
  channels: ChannelResponse[];
  onChannelClick: (channel: ChannelResponse) => void;
  className?: string;
}

// Mock recommended channels data
// const mockRecommendedChannels: ChannelResponse[] = [
//   {
//     id: 'rec-1',
//     name: '테크 인사이더',
//     description: '최신 기술 트렌드와 스타트업 생태계 분석',
//     owner_id: 'system',
//     content_count: 45,
//     subscriber_count: 1200,
//     thumbnail_url: null,
//     created_at: new Date().toISOString(),
//     updated_at: new Date().toISOString(),
//   },
//   {
//     id: 'rec-2',
//     name: '디자인 모멘텀',
//     description: 'UI/UX 트렌드와 창의적 영감을 전하는 디자인 큐레이션',
//     owner_id: 'system',
//     content_count: 38,
//     subscriber_count: 950,
//     thumbnail_url: null,
//     created_at: new Date().toISOString(),
//     updated_at: new Date().toISOString(),
//   },
//   {
//     id: 'rec-3',
//     name: '비즈 리더십',
//     description: '성장하는 기업들의 전략과 리더십 인사이트',
//     owner_id: 'system',
//     content_count: 52,
//     subscriber_count: 1500,
//     thumbnail_url: null,
//     created_at: new Date().toISOString(),
//     updated_at: new Date().toISOString(),
//   },
//   {
//     id: 'rec-4',
//     name: '라이프 큐레이터',
//     description: '일상의 질을 높이는 라이프스타일과 웰빙 콘텐츠',
//     owner_id: 'system',
//     content_count: 29,
//     subscriber_count: 780,
//     thumbnail_url: null,
//     created_at: new Date().toISOString(),
//     updated_at: new Date().toISOString(),
//   },
// ];

export function RecommendedSection({
  channels,
  onChannelClick,
  className = '',
}: RecommendedSectionProps) {
  // Always use mock data for recommendations
  const recommendedChannels = channels;

  return (
    <section className={`mb-16 ${className}`}>
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-400 mb-1">당신을 위한 추천</h2>
        <p className="text-gray-500 text-sm mb-2">
          관심사와 활동 패턴을 바탕으로 선별한 큐레이터들
        </p>
      </div>

      {/* Recommended channels grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {recommendedChannels.map((channel) => (
          <ChannelCard
            key={channel.id}
            channel={channel}
            size="medium"
            onCardClick={onChannelClick}
            className="h-full"
          />
        ))}
      </div>

      {/* Personalized CTA */}
      <div className="mt-8 p-6 bg-zinc-900/30 rounded-lg border border-zinc-700/30">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-400 mb-2">
            이런 스타일의 큐레이션은 어떠신가요?
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            당신의 관심사에 맞는 편집 방향을 찾아 새로운 큐레이터로 시작해보세요
          </p>
          <button className="bg-zinc-800 hover:bg-zinc-700 text-gray-400 hover:text-gray-300 font-medium px-6 py-2 rounded-lg transition-colors duration-200">
            나만의 큐레이션 시작하기
          </button>
        </div>
      </div>
    </section>
  );
}
