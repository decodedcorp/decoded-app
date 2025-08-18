'use client';

import React from 'react';

import { ChannelData } from '@/store/channelModalStore';
import { ProxiedImage } from '@/components/ProxiedImage';

interface ChannelPageHeaderProps {
  channel: ChannelData;
  onGoBack: () => void;
  onSubscribe?: (channelId: string) => void;
  onUnsubscribe?: (channelId: string) => void;
  isSubscribeLoading?: boolean;
  onMobileFiltersToggle?: () => void;
}

export function ChannelPageHeader({
  channel,
  onGoBack,
  onSubscribe,
  onUnsubscribe,
  isSubscribeLoading = false,
  onMobileFiltersToggle,
}: ChannelPageHeaderProps) {
  return (
    <div>
      {/* 상단 배너 섹션 */}
      <div className="h-32 bg-zinc-800 relative overflow-hidden">
        {/* 채널 썸네일을 배경으로 사용 (있는 경우) */}
        {channel.thumbnail_url && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{ backgroundImage: `url(${channel.thumbnail_url})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-800/80 to-zinc-700/80" />
          </>
        )}
      </div>

      {/* 하단 정보 섹션 */}
      <div className="bg-black px-4 py-4">
        <div className="flex items-center justify-between">
          {/* 왼쪽: 아바타 + 채널 정보 */}
          <div className="flex items-center">
            {/* Mobile filters button */}
            {onMobileFiltersToggle && (
              <button
                onClick={onMobileFiltersToggle}
                className="md:hidden p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
                aria-label="Toggle filters"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}

            {/* 큰 아바타 - 배너에서 튀어나오게 */}
            <div className="relative">
              {channel.thumbnail_url && (
                <ProxiedImage
                  src={channel.thumbnail_url}
                  alt={`${channel.name} avatar`}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full object-cover border-4 border-black -mt-10 bg-black"
                />
              )}
            </div>

            {/* 채널 정보 */}
            <div>
              <h1 className="text-2xl font-bold text-white">{channel.name}</h1>
              <div className="flex items-center space-x-4 text-sm text-zinc-400 mt-1">
                <span>{channel.subscriber_count || 0} followers</span>
                <span>•</span>
                <span>{channel.content_count || 0} editors</span>
              </div>
            </div>
          </div>

          {/* 오른쪽: 액션 버튼들 */}
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-full text-white font-medium transition-colors">
              + Add Content
            </button>
            <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-white transition-colors">
              Follow
            </button>
            <button className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-white transition-colors">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
