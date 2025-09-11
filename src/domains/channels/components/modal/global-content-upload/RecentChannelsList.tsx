'use client';

import React, { useState, useEffect } from 'react';

import { useChannels } from '@/domains/channels/hooks/useChannels';
import { useCommonTranslation } from '@/lib/i18n/centralizedHooks';

interface RecentChannelsListProps {
  onChannelSelect: (channel: any) => void;
}

export function RecentChannelsList({ onChannelSelect }: RecentChannelsListProps) {
  const t = useCommonTranslation();
  const [recentChannels, setRecentChannels] = useState<any[]>([]);

  // 최근 사용한 채널들 가져오기 (최신 순)
  const { data: channelsData, isLoading } = useChannels({
    limit: 5,
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  useEffect(() => {
    if (channelsData?.channels) {
      setRecentChannels(channelsData.channels);
    }
  }, [channelsData]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-400">
          {t.globalContentUpload.recentChannels.title()}
        </div>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-3 bg-zinc-800 rounded-lg animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-zinc-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-zinc-700 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-zinc-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recentChannels.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-400">
        {t.globalContentUpload.recentChannels.title()}
      </div>
      <div className="space-y-2">
        {recentChannels.map((channel) => (
          <div
            key={channel.id}
            onClick={() => onChannelSelect(channel)}
            className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg cursor-pointer transition-colors flex items-center gap-3"
          >
            {channel.thumbnail_url ? (
              <img
                src={channel.thumbnail_url}
                alt={channel.name}
                className="w-8 h-8 rounded-full flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 bg-zinc-600 rounded-full flex-shrink-0"></div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-white font-medium truncate">{channel.name}</div>
              {channel.description && (
                <div className="text-gray-400 text-sm truncate">{channel.description}</div>
              )}
            </div>
            {channel.subscriber_count && (
              <div className="text-gray-500 text-sm">
                {channel.subscriber_count > 1000
                  ? `${(channel.subscriber_count / 1000).toFixed(1)}k`
                  : channel.subscriber_count}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
