'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useChannels } from '@/domains/channels/hooks/useChannels';
import { useAddChannelStore } from '@/domains/create/store/addChannelStore';
import { useGlobalContentUploadStore } from '@/store/globalContentUploadStore';
import { useLeftSidebarStore } from '@/store/leftSidebarStore';
import { AddChannelModal } from '@/domains/create/components/modal/add-channel/AddChannelModal';

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
  const openGlobalContentUploadModal = useGlobalContentUploadStore((state) => state.openModal);
  const { isCollapsed, toggleCollapse, setCollapsed } = useLeftSidebarStore();

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, callback: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  };

  // Auto-collapse on mobile orientation change
  React.useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile && !isCollapsed) {
        setCollapsed(true);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isCollapsed, setCollapsed]);

  const channels = channelsData?.channels || [];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleCreateChannel = () => {
    openAddChannelModal();
  };

  const handleCreatePost = () => {
    openGlobalContentUploadModal();
  };

  return (
    <div
      className={`
        h-screen bg-zinc-900 border-r border-zinc-700 sticky top-0 flex flex-col
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-full'}
      `}
    >
      {/* Toggle Button */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-700 flex-shrink-0">
        {!isCollapsed && <div className="text-white text-sm font-medium">Menu</div>}
        <button
          onClick={toggleCollapse}
          onKeyDown={(e) => handleKeyDown(e, toggleCollapse)}
          className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800 focus:bg-zinc-800 focus:text-white rounded-lg transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#eafd66] focus:ring-opacity-50"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${
              isCollapsed ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      <div
        className="p-4 overflow-y-auto flex-1 min-h-0"
        style={{ scrollBehavior: 'smooth' }}
        role="navigation"
        aria-label="Sidebar navigation and channels"
        tabIndex={-1}
      >
        {/* 네비게이션 섹션 */}
        <div className="mb-6">
          {!isCollapsed && <div className="text-white text-sm font-medium mb-4">Navigation</div>}
          <div className="space-y-1">
            <div
              className={`p-2 text-gray-400 hover:text-white hover:bg-zinc-800 focus:bg-zinc-800 focus:text-white rounded cursor-pointer transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-[#eafd66] focus:ring-opacity-50 ${
                isCollapsed ? 'justify-center' : 'gap-2'
              }`}
              onClick={() => handleNavigation('/')}
              onKeyDown={(e) => handleKeyDown(e, () => handleNavigation('/'))}
              title={isCollapsed ? 'Home' : ''}
              tabIndex={0}
              role="button"
              aria-label="Navigate to Home"
            >
              🏠 {!isCollapsed && <span>Home</span>}
            </div>
            <div
              className={`p-2 text-gray-400 hover:text-white hover:bg-zinc-800 focus:bg-zinc-800 focus:text-white rounded cursor-pointer transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-[#eafd66] focus:ring-opacity-50 ${
                isCollapsed ? 'justify-center' : 'gap-2'
              }`}
              onClick={() => handleNavigation('/channels')}
              onKeyDown={(e) => handleKeyDown(e, () => handleNavigation('/channels'))}
              title={isCollapsed ? 'Popular' : ''}
              tabIndex={0}
              role="button"
              aria-label="Navigate to Popular"
            >
              🔥 {!isCollapsed && <span>Popular</span>}
            </div>
            <div
              className={`p-2 text-gray-400 hover:text-white hover:bg-zinc-800 focus:bg-zinc-800 focus:text-white rounded cursor-pointer transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-[#eafd66] focus:ring-opacity-50 ${
                isCollapsed ? 'justify-center' : 'gap-2'
              }`}
              onClick={() => handleNavigation('/explore')}
              onKeyDown={(e) => handleKeyDown(e, () => handleNavigation('/explore'))}
              title={isCollapsed ? 'Explore' : ''}
              tabIndex={0}
              role="button"
              aria-label="Navigate to Explore"
            >
              🌍 {!isCollapsed && <span>Explore</span>}
            </div>
          </div>
        </div>

        {/* 구분선 */}
        {!isCollapsed && <div className="h-px bg-zinc-700 my-4"></div>}

        {/* 커뮤니티 섹션 */}
        <div className="mb-6">
          {!isCollapsed && (
            <div className="flex items-center justify-between mb-4">
              <div className="text-white text-sm font-medium">Channels</div>
              {isLoading && (
                <div className="w-4 h-4 border-2 border-[#eafd66] border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
          )}

          {!isCollapsed && isError && (
            <div className="text-red-400 text-xs mb-2">Failed to load channels</div>
          )}

          <div className="space-y-1" role="list" aria-label="Channel list">
            {isLoading ? (
              // 로딩 스켈레톤
              [...Array(isCollapsed ? 3 : 5)].map((_, i) => (
                <div
                  key={i}
                  className={`p-2 bg-zinc-800 rounded animate-pulse ${isCollapsed ? 'h-8' : ''}`}
                >
                  {!isCollapsed && <div className="h-4 bg-zinc-700 rounded w-3/4"></div>}
                </div>
              ))
            ) : channels.length > 0 ? (
              <div
                className={`space-y-1 ${
                  channels.length > (isCollapsed ? 6 : 10) ? 'max-h-64 overflow-y-auto' : ''
                }`}
                style={{ scrollBehavior: 'smooth' }}
              >
                {channels.slice(0, isCollapsed ? 6 : channels.length).map((channel: any) => (
                  <div
                    key={channel.id}
                    className={`p-2 text-gray-400 hover:text-white hover:bg-zinc-800 focus:bg-zinc-800 focus:text-white rounded cursor-pointer transition-colors text-sm flex items-center group focus:outline-none focus:ring-2 focus:ring-[#eafd66] focus:ring-opacity-50 ${
                      isCollapsed ? 'justify-center' : 'gap-2'
                    }`}
                    onClick={() => handleNavigation(`/channels/${channel.id}`)}
                    onKeyDown={(e) =>
                      handleKeyDown(e, () => handleNavigation(`/channels/${channel.id}`))
                    }
                    title={isCollapsed ? channel.name : ''}
                    tabIndex={0}
                    role="listitem"
                    aria-label={`Navigate to ${channel.name} channel`}
                  >
                    {channel.thumbnail_url ? (
                      <img
                        src={channel.thumbnail_url}
                        alt={channel.name}
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-4 h-4 bg-zinc-600 rounded-full flex-shrink-0"></div>
                    )}
                    {!isCollapsed && (
                      <>
                        <span className="truncate group-hover:text-[#eafd66]">{channel.name}</span>
                        {channel.subscriber_count && (
                          <span className="text-xs text-gray-600 ml-auto">
                            {channel.subscriber_count > 1000
                              ? `${(channel.subscriber_count / 1000).toFixed(1)}k`
                              : channel.subscriber_count}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : !isCollapsed ? (
              <div className="text-gray-500 text-xs">No communities found</div>
            ) : null}
          </div>
        </div>

        {/* 구분선 */}
        {!isCollapsed && <div className="h-px bg-zinc-700 my-4"></div>}

        {/* 빠른 액션 */}
        <div className="space-y-3 flex-shrink-0 mt-auto">
          {isCollapsed ? (
            <>
              <button
                className="w-full p-2 bg-[#eafd66] text-black font-medium rounded-lg hover:bg-[#d4e755] focus:bg-[#d4e755] transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                onClick={handleCreateChannel}
                onKeyDown={(e) => handleKeyDown(e, handleCreateChannel)}
                title="Create Channel"
                aria-label="Create new channel"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
              <button
                className="w-full p-2 bg-zinc-800 text-white font-medium rounded-lg hover:bg-zinc-700 focus:bg-zinc-700 transition-colors border border-zinc-600 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#eafd66] focus:ring-opacity-50"
                onClick={handleCreatePost}
                onKeyDown={(e) => handleKeyDown(e, handleCreatePost)}
                title="Create Post"
                aria-label="Create new post"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            </>
          ) : (
            <>
              <button
                className="w-full p-3 bg-[#eafd66] text-black font-medium rounded-lg hover:bg-[#d4e755] focus:bg-[#d4e755] transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                onClick={handleCreateChannel}
                onKeyDown={(e) => handleKeyDown(e, handleCreateChannel)}
                aria-label="Create new channel"
              >
                Create Channel
              </button>
              <button
                className="w-full p-3 bg-zinc-800 text-white font-medium rounded-lg hover:bg-zinc-700 focus:bg-zinc-700 transition-colors border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#eafd66] focus:ring-opacity-50"
                onClick={handleCreatePost}
                onKeyDown={(e) => handleKeyDown(e, handleCreatePost)}
                aria-label="Create new post"
              >
                + Create Post
              </button>
            </>
          )}
        </div>
      </div>

      {/* Add Channel Modal */}
      <AddChannelModal />
    </div>
  );
}
