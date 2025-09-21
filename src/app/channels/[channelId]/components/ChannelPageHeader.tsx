'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';
import { ChannelEditorsStackedAvatars } from '@/shared/components/ChannelEditorsStackedAvatars';
import { EditorsListModal } from '@/shared/components/EditorsListModal';
import { ChannelData } from '@/store/channelModalStore';
import { useContentUploadStore } from '@/store/contentUploadStore';
import { toast } from 'react-hot-toast';
import { useUser } from '@/domains/auth/hooks/useAuth';
import { canManageChannelManagers } from '@/lib/utils/channelPermissions';
import { useChannelSubscription } from '@/domains/interactions/hooks/useChannelSubscription';
import { useCommonTranslation } from '@/lib/i18n/hooks';

interface ChannelPageHeaderProps {
  channel: ChannelData;
  onGoBack: () => void;
  onSubscribe?: (channelId: string) => void;
  onUnsubscribe?: (channelId: string) => void;
  isSubscribeLoading?: boolean;
  onMobileFiltersToggle?: () => void;
}

export function ChannelPageHeader({
  channel,
  onGoBack,
  onSubscribe,
  onUnsubscribe,
  isSubscribeLoading = false,
  onMobileFiltersToggle,
}: ChannelPageHeaderProps) {
  const router = useRouter();
  const openContentUploadModal = useContentUploadStore((state) => state.openModal);
  const [isEditorsModalOpen, setIsEditorsModalOpen] = useState(false);
  const t = useCommonTranslation();

  // 현재 사용자 정보
  const { user } = useUser();

  // 구독 기능
  const subscriptionHook = useChannelSubscription(channel.id);

  const handleAddContent = () => {
    if (channel.id) {
      openContentUploadModal(channel.id);
    }
  };

  const handleSubscribe = () => {
    if (subscriptionHook?.toggleSubscription) {
      try {
        subscriptionHook.toggleSubscription();
      } catch (error) {
        console.error('Error toggling subscription:', error);
      }
    } else {
      toast.error(t.status.error());
    }
  };

  const handleSettings = () => {
    router.push(`/channels/${channel.id}/settings`);
  };

  // 소유자 권한 확인
  const isOwner = user?.doc_id && channel.owner_id && user.doc_id === channel.owner_id;
  const canManageSettings = canManageChannelManagers(user, channel);

  return (
    <div>
      {/* 상단 배너 섹션 */}
      <div className="h-48 bg-zinc-800 relative overflow-hidden">
        {/* Banner Image - 읽기 전용 */}
        <img
          src={channel.banner_url || channel.thumbnail_url || ''}
          alt={`${channel.name} banner`}
          className="w-full h-full object-cover"
        />

        {/* 그라디언트 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* 하단 정보 섹션 */}
      <div className="bg-black px-4 py-4">
        <div className="flex items-center justify-between">
          {/* 왼쪽: 아바타 + 채널 정보 */}
          <div className="flex items-center">
            {/* Mobile filters button */}
            {/* {onMobileFiltersToggle && (
              <button
                onClick={onMobileFiltersToggle}
                className="md:hidden p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
                aria-label={t.actions.filter()}
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )} */}

            {/* 큰 아바타 - 배너에서 튀어나오게 */}
            <div className="relative -mt-16">
              <img
                src={channel.thumbnail_url || ''}
                alt={`${channel.name} avatar`}
                className="w-20 h-20 rounded-full border-4 border-black bg-black object-cover"
              />
            </div>

            {/* 채널 정보 */}
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-zinc-300">{channel.name}</h2>
              <div className="flex items-center space-x-3 text-sm text-zinc-400 mt-1">
                <span>
                  {channel.subscriber_count || 0} {t.ui.subscribers()}
                </span>
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
                        <span>
                          {channel.managers.length - 5}+ {t.ui.editors()}
                        </span>
                      </>
                    )}
                    {channel.managers.length <= 5 && (
                      <span>
                        {channel.managers.length} {t.ui.editors()}
                      </span>
                    )}
                  </button>
                ) : (
                  <span>0 {t.ui.editors()}</span>
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
            {/* Add Content 버튼 - owner이거나 manager인 경우에만 표시 */}
            {(isOwner || channel.is_manager) && (
              <button
                onClick={handleAddContent}
                className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-full text-white font-medium transition-colors"
              >
                + {t.create.createNewContent()}
              </button>
            )}
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
                      {subscriptionHook?.isSubscribed
                        ? `${t.actions.unsubscribe()}...`
                        : `${t.actions.subscribe()}...`}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm">
                    {subscriptionHook?.isSubscribed ? t.states.subscribed() : t.actions.subscribe()}
                  </span>
                )}
              </button>
            )}
            {canManageSettings && (
              <button
                onClick={handleSettings}
                className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-white transition-colors"
                title={t.navigation.settings()}
                aria-label={t.navigation.settings()}
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Banner Edit Modal - EditableImage에서 처리하므로 제거 */}

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
