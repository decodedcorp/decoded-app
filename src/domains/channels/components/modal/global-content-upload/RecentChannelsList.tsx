'use client';

import React, { useState, useEffect } from 'react';

import { useMyChannels } from '@/domains/profile/hooks/useProfileActivity';
import { useCommonTranslation } from '@/lib/i18n/centralizedHooks';

interface RecentChannelsListProps {
  onChannelSelect: (channel: any) => void;
}

export function RecentChannelsList({ onChannelSelect }: RecentChannelsListProps) {
  const t = useCommonTranslation();
  const [recentChannels, setRecentChannels] = useState<any[]>([]);

  // 내가 관리하는 채널들 가져오기
  const { data: channelsData, isLoading } = useMyChannels();

  useEffect(() => {
    if (channelsData?.channels) {
      // 최대 5개까지만 표시
      setRecentChannels(channelsData.channels.slice(0, 5));
    }
  }, [channelsData]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-400">
          {t.globalContentUpload.myChannels.title()}
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
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-zinc-800 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">
          {t.globalContentUpload.myChannels.noChannels()}
        </h3>
        <p className="text-zinc-400 text-sm">
          {t.globalContentUpload.myChannels.noChannelsDescription()}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-400">
        {t.globalContentUpload.myChannels.title()}
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
