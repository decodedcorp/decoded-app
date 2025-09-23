'use client';

import { useState, useMemo, memo, useEffect } from 'react';

import { ChevronDownIcon, ChevronRightIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useChannels } from '@/domains/channels/hooks/useChannels';
import { useSubscribedChannels } from '@/domains/interactions/hooks/useSubscribedChannels';
import { useAuthStore } from '@/store/authStore';
import { usePathname } from 'next/navigation';
import { ChannelResponse } from '@/api/generated/models/ChannelResponse';
import { useChannelTranslation } from '@/lib/i18n/hooks';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryKeys';
import { ChannelsService } from '@/api/generated';
import { refreshOpenAPIToken } from '@/api/hooks/useApi';

import { SidebarChannelItem } from './SidebarChannelItem';

interface SidebarChannelListProps {
  className?: string;
  showTitle?: boolean;
}

export const SidebarChannelList = memo(function SidebarChannelList({
  className = '',
  showTitle = false,
}: SidebarChannelListProps) {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const t = useChannelTranslation();
  const queryClient = useQueryClient();

  // Get trending channels (always fetch as fallback)
  const {
    data: trendingChannelsData,
    isLoading: isTrendingLoading,
    error: trendingError,
  } = useChannels({
    limit: 5,
    sortBy: 'subscriber_count',
    sortOrder: 'desc',
  });

  // Get subscribed channels for authenticated users
  const {
    data: subscribedChannelsData,
    isLoading: isSubscribedLoading,
    error: subscribedError,
  } = useSubscribedChannels(5);

  // Determine which data to use
  const hasSubscribedChannels = subscribedChannelsData && subscribedChannelsData.length > 0;
  const shouldShowSubscribed = isAuthenticated && hasSubscribedChannels;

  // 로그인했지만 구독한 채널이 없거나, 로그인하지 않았을 때는 trending 채널 사용
  const shouldUseTrending = !isAuthenticated || !hasSubscribedChannels;

  const isLoading = shouldUseTrending ? isTrendingLoading : isSubscribedLoading;
  const error = shouldUseTrending ? trendingError : subscribedError;

  // Extract channels from the response
  const channels: ChannelResponse[] = useMemo(() => {
    if (shouldShowSubscribed) {
      return subscribedChannelsData || [];
    } else {
      return trendingChannelsData?.channels || [];
    }
  }, [shouldShowSubscribed, subscribedChannelsData, trendingChannelsData]);

  const getTitle = () => {
    return shouldShowSubscribed ? t.sidebar.subscribedChannels() : t.sidebar.trendingChannels();
  };

  const getEmptyMessage = () => {
    if (isAuthenticated && !hasSubscribedChannels) {
      return t.sidebar.subscribedEmpty();
    }
    return t.sidebar.trendingEmpty();
  };

  // 백그라운드에서 인기 채널들을 미리 prefetch
  useEffect(() => {
    if (channels.length > 0) {
      // 브라우저가 idle 상태일 때 prefetch 실행
      const prefetchChannels = () => {
        channels.slice(0, 3).forEach((channel, index) => {
          // 각 채널을 순차적으로 prefetch
          setTimeout(() => {
            const cachedData = queryClient.getQueryData(queryKeys.channels.detail(channel.id));
            if (!cachedData) {
              queryClient.prefetchQuery({
                queryKey: queryKeys.channels.detail(channel.id),
                queryFn: async () => {
                  refreshOpenAPIToken();
                  return ChannelsService.getChannelChannelsChannelIdGet(channel.id);
                },
                staleTime: 15 * 60 * 1000,
                gcTime: 2 * 60 * 60 * 1000,
              });
            }
          }, index * 200); // 200ms 간격으로 순차 실행
        });
      };

      // 페이지 로드 후 1초 뒤에 백그라운드 prefetch 시작
      const timer = setTimeout(prefetchChannels, 1000);
      return () => clearTimeout(timer);
    }
  }, [channels, queryClient]);

  return (
    <div className={`space-y-1 ${className}`}>
      {showTitle && (
        <div className="px-3 py-1.5 lg:py-2 text-sm lg:text-sm font-medium text-zinc-400">
          {getTitle()}
        </div>
      )}

      {/* Channel list */}
      <div className="space-y-1">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-2 lg:gap-3 px-3 py-1.5 lg:py-2 rounded-lg animate-pulse"
            >
              <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-zinc-700 flex-shrink-0" />
              <div className="flex-1 h-3 lg:h-4 bg-zinc-700 rounded" />
              <div className="w-6 lg:w-8 h-2 lg:h-3 bg-zinc-700 rounded" />
            </div>
          ))
        ) : error ? (
          // Error state
          <div className="px-3 py-1.5 lg:py-2 text-sm lg:text-sm text-zinc-500">
            {t.sidebar.loadError()}
          </div>
        ) : channels.length === 0 && !shouldUseTrending ? (
          // Empty state (only when showing subscribed channels and they're empty)
          <div className="px-3 py-1.5 lg:py-2 text-sm lg:text-sm text-zinc-500">
            {getEmptyMessage()}
          </div>
        ) : channels.length === 0 ? (
          // Empty state for trending channels
          <div className="px-3 py-1.5 lg:py-2 text-sm lg:text-sm text-zinc-500">
            {t.sidebar.trendingEmpty()}
          </div>
        ) : (
          // Channel list
          <>
            {channels.map((channel) => (
              <SidebarChannelItem
                key={channel.id}
                channel={channel}
                isActive={pathname === `/channels/${channel.id}`}
              />
            ))}

            {/* More channels link */}
            <Link
              href="/channels"
              className="flex items-center gap-2 px-3 py-1.5 lg:py-2 rounded-lg text-sm lg:text-sm text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 transition-all duration-200 group cursor-pointer"
            >
              <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0">
                <ArrowRightIcon className="w-3 h-3 lg:w-3 lg:h-3" />
              </div>
              <span className="flex-1">{t.sidebar.viewMoreChannels()}</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
});
