'use client';

import { ReactNode, memo, useCallback } from 'react';

import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { ChannelResponse } from '@/api/generated/models/ChannelResponse';
import { queryKeys } from '@/lib/api/queryKeys';
import { ChannelsService } from '@/api/generated';
import { refreshOpenAPIToken } from '@/api/hooks/useApi';

interface SidebarChannelItemProps {
  channel: ChannelResponse;
  isActive?: boolean;
  className?: string;
}

export const SidebarChannelItem = memo(function SidebarChannelItem({
  channel,
  isActive = false,
  className = '',
}: SidebarChannelItemProps) {
  const queryClient = useQueryClient();

  // 향상된 prefetch - 채널 데이터와 콘텐츠 모두 prefetch
  const handleMouseEnter = useCallback(() => {
    // 채널 데이터 prefetch
    const cachedChannelData = queryClient.getQueryData(queryKeys.channels.detail(channel.id));

    if (!cachedChannelData) {
      queryClient.prefetchQuery({
        queryKey: queryKeys.channels.detail(channel.id),
        queryFn: async () => {
          refreshOpenAPIToken();
          return ChannelsService.getChannelChannelsChannelIdGet(channel.id);
        },
        staleTime: 15 * 60 * 1000, // useChannel과 동일한 설정
        gcTime: 2 * 60 * 60 * 1000,
      });
    }

    // 채널 콘텐츠도 함께 prefetch (첫 페이지만)
    const cachedContentData = queryClient.getQueryData([
      'channelContents',
      channel.id,
      { page: 1, limit: 20 },
    ]);

    if (!cachedContentData) {
      // 콘텐츠 prefetch는 낮은 우선순위로 실행
      setTimeout(() => {
        queryClient.prefetchQuery({
          queryKey: ['channelContents', channel.id, { page: 1, limit: 20 }],
          queryFn: async () => {
            refreshOpenAPIToken();
            // 콘텐츠 API 호출 로직 필요시 추가
            return { contents: [], total: 0 };
          },
          staleTime: 5 * 60 * 1000,
          gcTime: 30 * 60 * 1000,
        });
      }, 100);
    }
  }, [queryClient, channel.id]);

  const baseClasses = `
    flex items-center gap-2 lg:gap-3 px-3 py-1.5 lg:py-2 rounded-lg
    text-xs lg:text-sm font-normal transition-all duration-200 cursor-pointer
    ${
      isActive ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
    }
    ${className}
  `;

  return (
    <Link href={`/channels/${channel.id}`} className={baseClasses} onMouseEnter={handleMouseEnter}>
      {/* Channel thumbnail */}
      <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-zinc-700 flex-shrink-0 overflow-hidden">
        {channel.thumbnail_url ? (
          <img
            src={channel.thumbnail_url}
            alt={channel.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-zinc-600 flex items-center justify-center">
            <span className="text-[10px] lg:text-xs font-medium text-zinc-300">
              {channel.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Channel name */}
      <span className="flex-1 truncate text-xs lg:text-sm">{channel.name}</span>
    </Link>
  );
});
