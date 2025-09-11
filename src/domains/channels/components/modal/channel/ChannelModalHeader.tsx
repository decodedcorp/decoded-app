'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';
import { ChannelData } from '@/store/channelModalStore';
import { toast } from 'react-hot-toast';
import { ChannelEditorsStackedAvatars } from '@/shared/components/ChannelEditorsStackedAvatars';
import { EditorsListModal } from '@/shared/components/EditorsListModal';

interface ChannelModalHeaderProps {
  channel: ChannelData;
  onClose: () => void;
  onSearch?: (query: string) => void;
  onSubscribe?: () => void;
  onUnsubscribe?: () => void;
  isSubscribeLoading?: boolean;
  currentUserId?: string; // 현재 사용자 ID (소유자 확인용)
  subscriptionHook?: any; // useChannelSubscription hook return value
}

export function ChannelModalHeader({
  channel,
  onClose,
  onSearch,
  onSubscribe,
  onUnsubscribe,
  isSubscribeLoading = false,
  currentUserId,
  subscriptionHook,
}: ChannelModalHeaderProps) {
  const router = useRouter();
  const [isEditorsModalOpen, setIsEditorsModalOpen] = useState(false);

  // 소유자 권한 확인
  const isOwner = currentUserId && channel.owner_id && currentUserId === channel.owner_id;

  const handleFullscreen = () => {
    router.push(`/channels/${channel.id}`);
  };

  const handleSubscribe = () => {
    if (subscriptionHook?.toggleSubscription) {
      try {
        subscriptionHook.toggleSubscription();
      } catch (error) {
        console.error('Error toggling subscription:', error);
      }
    } else {
      toast.error('Subscription feature not available');
    }
  };

  return (
    <div>
      {/* 상단 배너 섹션 */}
      <div className="h-32 bg-zinc-800 relative overflow-hidden">
        {/* 배너 이미지 - 읽기 전용 */}
        <img
          src={channel.banner_url || channel.thumbnail_url || ''}
          alt={`${channel.name} banner`}
          className="w-full h-full opacity-60 object-cover"
        />
        {/* 그라디언트 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-800/60 to-zinc-700/60 pointer-events-none" />

        {/* 상단 우측 버튼들 */}
        <div className="absolute top-4 right-4 flex items-center space-x-3">
          {/* Fullscreen button */}
          <button
            onClick={handleFullscreen}
            className="p-2 rounded-full bg-zinc-800/70 hover:bg-zinc-700/70 transition-colors backdrop-blur-sm"
            aria-label="Open in fullscreen"
            title="전체화면으로 보기"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path
                d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-zinc-800/70 hover:bg-zinc-700/70 transition-colors backdrop-blur-sm"
            aria-label="Close modal"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 하단 정보 섹션 */}
      <div className="bg-zinc-900/95 backdrop-blur-sm px-4 py-4">
        <div className="flex items-center justify-between">
          {/* 왼쪽: 아바타 + 채널 정보 */}
          <div className="flex items-center">
            {/* 큰 아바타 - 배너에서 튀어나오게 */}
            <div className="relative -mt-10">
              <img
                src={channel.thumbnail_url || ''}
                alt={`${channel.name} avatar`}
                className="w-20 h-20 rounded-full border-4 border-black bg-black object-cover"
              />
            </div>

            {/* 채널 정보 */}
            <div className="ml-4">
              <h1 id="channel-modal-title" className="text-2xl font-bold text-white">
                {channel.name}
              </h1>
              <div
                id="channel-modal-description"
                className="flex items-center space-x-3 text-sm text-zinc-400 mt-1"
              >
                <span>{channel.subscriber_count || 0} followers</span>
                <span>•</span>
                {/* Editors with stacked avatars - Clickable */}
                {channel.managers && channel.managers.length > 0 ? (
                  <button
                    onClick={() => setIsEditorsModalOpen(true)}
                    className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                  >
                    <ChannelEditorsStackedAvatars
                      editors={channel.managers}
                      maxDisplay={5}
                      size="sm"
                      showTooltip={true}
                    />
                    {channel.managers.length > 5 && (
                      <>
                        <span>•••</span>
                        <span>{channel.managers.length - 5}+ editors</span>
                      </>
                    )}
                    {channel.managers.length <= 5 && (
                      <span>{channel.managers.length} editor{channel.managers.length > 1 ? 's' : ''}</span>
                    )}
                  </button>
                ) : (
                  <span>0 editors</span>
                )}
              </div>
              {/* Category/Subcategory Tags */}
              {(channel.category || channel.subcategory) && (
                <div className="flex items-center space-x-1.5 mt-2">
                  {channel.category && (
                    <span className="px-2 py-0.5 bg-zinc-600/30 text-zinc-300 text-xs rounded-full border border-zinc-500/30">
                      {channel.category}
                    </span>
                  )}
                  {channel.subcategory && (
                    <span className="px-2 py-0.5 bg-zinc-600/30 text-zinc-300 text-xs rounded-full border border-zinc-500/30">
                      {channel.subcategory}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 오른쪽: 액션 버튼들 */}
          <div className="flex items-center space-x-3">
            {/* Subscribe 버튼 - 소유자가 아닌 경우에만 표시 */}
            {!isOwner && (
              <button
                onClick={handleSubscribe}
                disabled={subscriptionHook?.isLoading}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  subscriptionHook?.isSubscribed
                    ? 'bg-zinc-600 text-white hover:bg-zinc-500'
                    : 'bg-white text-gray-900 hover:bg-gray-100'
                } ${subscriptionHook?.isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {subscriptionHook?.isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">
                      {subscriptionHook?.isSubscribed ? 'Unsubscribing...' : 'Subscribing...'}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm">
                    {subscriptionHook?.isSubscribed ? 'Subscribed' : 'Subscribe'}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
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
