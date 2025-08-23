import React from 'react';

import { ChannelData } from '@/store/channelModalStore';
import { formatDateByContext } from '@/lib/utils/dateUtils';

interface ChannelModalStatsProps {
  channel: ChannelData;
}

export function ChannelModalStats({ channel }: ChannelModalStatsProps) {
  return (
    <div className="mb-8">
      {/* Stats */}
      <div className="flex space-x-6 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {channel.subscriber_count ? channel.subscriber_count.toLocaleString() : '0'}
          </div>
          <div className="text-zinc-400 text-sm">Subscribers</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{channel.content_count || 0}</div>
          <div className="text-zinc-400 text-sm">Posts</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {channel.is_subscribed ? 'Subscribed' : 'Subscribe'}
          </div>
          <div className="text-zinc-400 text-sm">Status</div>
        </div>
      </div>

      {/* Creation Date */}
      {channel.created_at && (
        <div className="mb-4">
          <div className="text-zinc-400 text-sm">
            Created: {formatDateByContext(channel.created_at, 'detail')}
          </div>
        </div>
      )}

      {/* Last Updated */}
      {channel.updated_at && channel.updated_at !== channel.created_at && (
        <div className="mb-4">
          <div className="text-zinc-400 text-sm">
            Updated: {formatDateByContext(channel.updated_at, 'detail')}
          </div>
        </div>
      )}

      {/* Channel Info */}
      <div className="mb-4">
        <div className="text-zinc-400 text-sm">Owner ID: {channel.owner_id}</div>
      </div>
    </div>
  );
}
