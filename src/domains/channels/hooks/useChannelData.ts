'use client';

import { useMemo } from 'react';
import { ChannelResponse } from '@/api/generated/models/ChannelResponse';
import { ChannelData } from '@/store/channelModalStore';
import { useChannel, useChannels } from './useChannels';

/**
 * 통일된 채널 데이터 관리 훅
 * ChannelModal과 ChannelMainContent에서 일관된 데이터 처리를 위해 사용
 */
export function useChannelData(channelId?: string | null) {
  // API에서 채널 데이터 가져오기
  const { data: apiChannel, isLoading, error } = useChannel(channelId || '');

  // 채널 데이터를 통일된 형식으로 변환
  const channelData = useMemo((): ChannelData | null => {
    if (apiChannel) {
      return apiChannel;
    }
    return null;
  }, [apiChannel]);

  return {
    channel: channelData,
    isLoading,
    error,
    hasData: !!channelData,
  };
}

/**
 * 채널 목록 데이터 관리 훅
 * 여러 채널을 처리할 때 사용
 */
export function useChannelsData(options?: {
  limit?: number;
  sortBy?: 'created_at' | 'subscriber_count' | 'content_count';
  sortOrder?: 'asc' | 'desc';
}) {
  const {
    data: channelsData,
    isLoading,
    error,
  } = useChannels({
    limit: options?.limit || 100,
    sortBy: options?.sortBy || 'created_at',
    sortOrder: options?.sortOrder || 'desc',
  });

  const channels = useMemo(() => {
    return channelsData?.channels || [];
  }, [channelsData]);

  return {
    channels,
    isLoading,
    error,
    hasData: channels.length > 0,
  };
}
