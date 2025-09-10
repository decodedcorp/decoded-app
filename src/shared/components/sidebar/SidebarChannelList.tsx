'use client';

import { useState, useMemo } from 'react';
import { ChevronDownIcon, ChevronRightIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { SidebarChannelItem } from './SidebarChannelItem';
import { useChannels } from '@/domains/channels/hooks/useChannels';
import { useSubscribedChannels } from '@/domains/interactions/hooks/useSubscribedChannels';
import { useAuthStore } from '@/store/authStore';
import { usePathname } from 'next/navigation';
import { ChannelResponse } from '@/api/generated/models/ChannelResponse';
import { useChannelTranslation } from '@/lib/i18n/hooks';
import Link from 'next/link';

interface SidebarChannelListProps {
  className?: string;
  showTitle?: boolean;
}

export function SidebarChannelList({ className = '', showTitle = false }: SidebarChannelListProps) {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const t = useChannelTranslation();

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

  const isLoading = shouldShowSubscribed ? isSubscribedLoading : isTrendingLoading;
  const error = shouldShowSubscribed ? subscribedError : trendingError;

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
    return shouldShowSubscribed ? t.sidebar.subscribedEmpty() : t.sidebar.trendingEmpty();
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {showTitle && <div className="px-3 py-2 text-sm font-medium text-zinc-400">{getTitle()}</div>}

      {/* Channel list */}
      <div className="space-y-1">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3 px-3 py-2 rounded-lg animate-pulse">
              <div className="w-6 h-6 rounded-full bg-zinc-700 flex-shrink-0" />
              <div className="flex-1 h-4 bg-zinc-700 rounded" />
              <div className="w-8 h-3 bg-zinc-700 rounded" />
            </div>
          ))
        ) : error ? (
          // Error state
          <div className="px-3 py-2 text-sm text-zinc-500">{t.sidebar.loadError()}</div>
        ) : channels.length === 0 ? (
          // Empty state
          <div className="px-3 py-2 text-sm text-zinc-500">{getEmptyMessage()}</div>
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
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 transition-all duration-200 group cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0">
                <ArrowRightIcon className="w-3 h-3" />
              </div>
              <span className="flex-1">{t.sidebar.viewMoreChannels()}</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
