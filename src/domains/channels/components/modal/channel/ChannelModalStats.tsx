import React, { useState } from 'react';

import { ChannelData } from '@/store/channelModalStore';
import { formatDateByContext } from '@/lib/utils/dateUtils';
import { ChannelEditorsStackedAvatars } from '@/shared/components/ChannelEditorsStackedAvatars';
import { EditorsListModal } from '@/shared/components/EditorsListModal';

interface ChannelModalStatsProps {
  channel: ChannelData;
}

export function ChannelModalStats({ channel }: ChannelModalStatsProps) {
  const [isEditorsModalOpen, setIsEditorsModalOpen] = useState(false);

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

      {/* Editors Section - Clickable */}
      {channel.managers && channel.managers.length > 0 && (
        <div className="mb-4 p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
          <button
            onClick={() => setIsEditorsModalOpen(true)}
            className="flex items-center justify-between w-full hover:bg-zinc-800/50 transition-colors rounded-lg p-1 -m-1"
          >
            <div className="flex items-center space-x-3">
              <span className="text-zinc-300 text-sm font-medium">Editors:</span>
              <ChannelEditorsStackedAvatars 
                editors={channel.managers}
                maxDisplay={5}
                size="md"
                showTooltip={true}
                className="ml-2"
              />
              <span className="text-zinc-400 text-sm">
                {channel.managers.length > 5 && `+${channel.managers.length - 5} more`}
              </span>
            </div>
            <svg
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              className="text-zinc-400"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}

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

      {/* Editors List Modal */}
      <EditorsListModal
        isOpen={isEditorsModalOpen}
        onClose={() => setIsEditorsModalOpen(false)}
        editors={channel.managers || []}
        channelName={channel.name}
        ownerId={channel.owner_id}
      />
    </div>
  );
}
