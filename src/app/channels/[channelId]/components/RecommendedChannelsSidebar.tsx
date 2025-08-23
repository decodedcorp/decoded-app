'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { ChannelData } from '@/store/channelModalStore';
import { useChannels } from '@/domains/channels/hooks/useChannels';
import { ProxiedImage } from '@/components/ProxiedImage';

interface RecommendedChannelsSidebarProps {
  currentChannelId: string;
  className?: string;
  onCollapseChange?: (isCollapsed: boolean) => void;
}

export function RecommendedChannelsSidebar({
  currentChannelId,
  className = '',
  onCollapseChange,
}: RecommendedChannelsSidebarProps) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  // collapse 상태 변경 시 부모에게 알림
  const handleCollapseToggle = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    onCollapseChange?.(newCollapsedState);
  };

  // 추천 채널 데이터 가져오기 (현재 채널 제외)
  const { data: channelsData, isLoading } = useChannels({
    limit: 12,
    sortBy: 'content_count',
    sortOrder: 'desc',
  });

  const recommendedChannels = React.useMemo(() => {
    if (!channelsData?.channels) return [];

    // 현재 채널 제외하고 상위 8개만 표시
    return channelsData.channels
      .filter((channel: ChannelData) => channel.id !== currentChannelId)
      .slice(0, 8);
  }, [channelsData, currentChannelId]);

  const handleChannelClick = (channelId: string) => {
    router.push(`/channels/${channelId}`);
  };

  if (isLoading) {
    return (
      <div className={`w-80 bg-zinc-900/50 border-l border-zinc-700/50 p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-white mb-6">Discover Channels</h3>
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-zinc-800 rounded-full animate-pulse" />
              <div className="flex-1">
                <div className="h-4 bg-zinc-800 rounded animate-pulse mb-2" />
                <div className="h-3 bg-zinc-800 rounded animate-pulse w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!recommendedChannels.length) {
    return null;
  }

  return (
    <div
      className={`transition-all duration-300 ease-in-out bg-zinc-900/50 border-l border-zinc-700/50 overflow-hidden ${
        isCollapsed ? 'w-12' : 'w-80'
      } ${className}`}
    >
      <div className={isCollapsed ? 'p-2' : 'p-6'}>
        {!isCollapsed ? (
          <>
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center justify-between">
              <div className="flex items-center">Discover Channels</div>
              <button
                onClick={handleCollapseToggle}
                className="p-1 hover:bg-zinc-700/50 rounded transition-colors duration-200"
                aria-label="Collapse"
              >
                <svg
                  className="w-4 h-4 text-zinc-400 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </h3>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <button
              onClick={handleCollapseToggle}
              className="p-1 hover:bg-zinc-700/50 rounded transition-colors duration-200 mb-4"
              aria-label="Expand"
            >
              <svg
                className="w-4 h-4 text-zinc-400 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <svg
              className="w-5 h-5 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        )}

        {!isCollapsed && (
          <div>
            <div className="space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent">
              {recommendedChannels.map((channel: ChannelData) => (
                <div
                  key={channel.id}
                  onClick={() => handleChannelClick(channel.id)}
                  className="group flex items-center space-x-3 p-3 rounded-lg bg-zinc-800/30 hover:bg-zinc-700/50 transition-all duration-200 cursor-pointer border border-transparent hover:border-zinc-600"
                >
                  {channel.thumbnail_url ? (
                    <ProxiedImage
                      src={channel.thumbnail_url}
                      alt={`${channel.name} thumbnail`}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0 group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-lg">
                        {channel.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white group-hover:text-blue-300 transition-colors duration-200 truncate">
                      {channel.name}
                    </h4>
                    <div className="flex items-center space-x-3 text-xs text-zinc-400 mt-1">
                      <span className="flex items-center">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        {channel.subscriber_count || 0}
                      </span>
                      <span className="flex items-center">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                        {channel.content_count || 0} items
                      </span>
                    </div>
                    {channel.description && (
                      <p className="text-xs text-zinc-500 mt-1 line-clamp-2 group-hover:text-zinc-400 transition-colors duration-200">
                        {channel.description}
                      </p>
                    )}
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <svg
                      className="w-4 h-4 text-zinc-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            {/* 더 보기 버튼 */}
            <div className="mt-6 pt-4 border-t border-zinc-700/50">
              <button
                onClick={() => router.push('/channels')}
                className="w-full px-4 py-2 bg-zinc-800/50 hover:bg-zinc-700/50 text-white rounded-lg transition-colors duration-200 text-sm font-medium flex items-center justify-center space-x-2"
              >
                <span>Explore All Channels</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
