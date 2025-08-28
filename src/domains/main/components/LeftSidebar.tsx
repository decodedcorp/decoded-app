'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useChannels } from '@/domains/channels/hooks/useChannels';
import { useAddChannelStore } from '@/store/addChannelStore';
import { AddChannelModal } from '@/domains/channels/components/modal/add-channel/AddChannelModal';

export function LeftSidebar() {
  const router = useRouter();
  const {
    data: channelsData,
    isLoading,
    isError,
  } = useChannels({
    limit: 10,
    sortBy: 'created_at',
    sortOrder: 'desc',
  });
  const openAddChannelModal = useAddChannelStore((state) => state.openModal);

  const channels = channelsData?.channels || [];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleCreateChannel = () => {
    openAddChannelModal();
  };

  return (
    <div className="w-full h-screen bg-zinc-900 border-r border-zinc-700 p-4 sticky top-0 overflow-y-auto">
      {/* 네비게이션 섹션 */}
      <div className="mb-6">
        <div className="text-white text-sm font-medium mb-4">Navigation</div>
        <div className="space-y-1">
          <div
            className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded cursor-pointer transition-colors flex items-center gap-2"
            onClick={() => handleNavigation('/')}
          >
            🏠 <span>Home</span>
          </div>
          <div
            className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded cursor-pointer transition-colors flex items-center gap-2"
            onClick={() => handleNavigation('/channels')}
          >
            🔥 <span>Popular</span>
          </div>
          <div
            className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded cursor-pointer transition-colors flex items-center gap-2"
            onClick={() => handleNavigation('/explore')}
          >
            🌍 <span>Explore</span>
          </div>
        </div>
      </div>

      {/* 구분선 */}
      <div className="h-px bg-zinc-700 my-4"></div>

      {/* 커뮤니티 섹션 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-white text-sm font-medium">Channels</div>
          {isLoading && (
            <div className="w-4 h-4 border-2 border-[#eafd66] border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>

        {isError && <div className="text-red-400 text-xs mb-2">Failed to load channels</div>}

        <div className="space-y-1">
          {isLoading ? (
            // 로딩 스켈레톤
            [...Array(5)].map((_, i) => (
              <div key={i} className="p-2 bg-zinc-800 rounded animate-pulse">
                <div className="h-4 bg-zinc-700 rounded w-3/4"></div>
              </div>
            ))
          ) : channels.length > 0 ? (
            channels.map((channel: any) => (
              <div
                key={channel.id}
                className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded cursor-pointer transition-colors text-sm flex items-center gap-2 group"
                onClick={() => handleNavigation(`/channels/${channel.id}`)}
              >
                {channel.thumbnail_url ? (
                  <img
                    src={channel.thumbnail_url}
                    alt={channel.name}
                    className="w-4 h-4 rounded-full flex-shrink-0"
                  />
                ) : (
                  <div className="w-4 h-4 bg-zinc-600 rounded-full flex-shrink-0"></div>
                )}
                <span className="truncate group-hover:text-[#eafd66]">{channel.name}</span>
                {channel.subscriber_count && (
                  <span className="text-xs text-gray-600 ml-auto">
                    {channel.subscriber_count > 1000
                      ? `${(channel.subscriber_count / 1000).toFixed(1)}k`
                      : channel.subscriber_count}
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-xs">No communities found</div>
          )}
        </div>
      </div>

      {/* 구분선 */}
      <div className="h-px bg-zinc-700 my-4"></div>

      {/* 빠른 액션 */}
      <div className="space-y-3">
        <button
          className="w-full p-3 bg-[#eafd66] text-black font-medium rounded-lg hover:bg-[#d4e755] transition-colors"
          onClick={handleCreateChannel}
        >
          Create Channel
        </button>
        <button
          className="w-full p-3 bg-zinc-800 text-white font-medium rounded-lg hover:bg-zinc-700 transition-colors border border-zinc-600"
          onClick={() => handleNavigation('/upload')}
        >
          + Create Post
        </button>
      </div>

      {/* Add Channel Modal */}
      <AddChannelModal />
    </div>
  );
}
