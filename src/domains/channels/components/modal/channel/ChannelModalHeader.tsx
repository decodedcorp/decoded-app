'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';
import { BannerFallback, AvatarFallback, ThumbnailFallback } from '@/components/FallbackImage';
import { ChannelData } from '@/store/channelModalStore';
import { toast } from 'react-hot-toast';
import { ChannelEditorsStackedAvatars } from '@/shared/components/ChannelEditorsStackedAvatars';
import { EditorsListModal } from '@/shared/components/EditorsListModal';
import { useCommonTranslation } from '@/lib/i18n/hooks';
import { useTranslations } from 'next-intl';

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
  const t = useCommonTranslation();
  const toastT = useTranslations('common.toast.general');
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
      toast.error(toastT('error'));
    }
  };

  return (
    <div>
      {/* 상단 배너 섹션 */}
      <div className="h-48 relative overflow-hidden">
        {/* Banner Image with Fallback */}
        {channel.banner_url || channel.thumbnail_url ? (
          <img
            src={(channel.banner_url || channel.thumbnail_url) ?? ''}
            alt={`${channel.name} banner`}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Hide broken image and show fallback
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'block';
            }}
          />
        ) : null}

        {/* Fallback Banner */}
        <BannerFallback
          className={`w-full h-full ${
            channel.banner_url || channel.thumbnail_url ? 'hidden' : 'block'
          }`}
        />
        {/* 그라디언트 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

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
      <div className="bg-black px-4 py-4">
        <div className="flex flex-col space-y-3">
          {/* 첫 번째 줄: 아바타 + 채널 정보 + 액션 버튼들 */}
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 md:gap-4">
            {/* 왼쪽: 아바타 */}
            <div className="relative -mt-16 shrink-0">
              {channel.thumbnail_url ? (
                <img
                  src={channel.thumbnail_url}
                  alt={`${channel.name} avatar`}
                  className="w-20 h-20 rounded-full border-4 border-black object-cover shadow-lg ring-1 ring-white/10"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    // Hide broken image and show fallback
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'block';
                  }}
                />
              ) : null}

              {/* Fallback Avatar */}
              <ThumbnailFallback
                size="xl"
                className={`w-20 h-20 border-4 border-black shadow-lg ring-1 ring-white/10 ${
                  channel.thumbnail_url ? 'hidden' : 'block'
                }`}
              />
            </div>

            {/* 가운데: 채널 정보 (min-w-0로 truncate 활성화) */}
            <div className="min-w-0">
              <h2 id="channel-modal-title" className="text-xl font-semibold text-zinc-300 truncate">
                {channel.name}
              </h2>
              <div
                id="channel-modal-description"
                className="flex items-center gap-3 text-sm text-zinc-400 mt-1 min-w-0"
              >
                <span className="whitespace-nowrap">
                  {channel.subscriber_count || 0} {t.ui.subscribers()}
                </span>
                <span className="opacity-60">•</span>

                {/* 편집자 영역이 길어져도 줄바꿈 방지 + 말줄임 */}
                {channel.managers && channel.managers.length > 0 ? (
                  <button
                    onClick={() => setIsEditorsModalOpen(true)}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity min-w-0"
                    aria-haspopup="dialog"
                    aria-expanded={isEditorsModalOpen ? 'true' : 'false'}
                  >
                    <ChannelEditorsStackedAvatars
                      editors={channel.managers}
                      maxDisplay={5}
                      size="sm"
                      showTooltip={true}
                    />
                    <span className="truncate">
                      {channel.managers.length} {t.ui.editors()}
                    </span>
                  </button>
                ) : (
                  <span className="truncate">0 {t.ui.editors()}</span>
                )}
              </div>
            </div>

            {/* 오른쪽: 액션 버튼들 */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Subscribe 버튼 - 소유자가 아닌 경우에만 표시 */}
              {!isOwner && (
                <button
                  onClick={handleSubscribe}
                  disabled={subscriptionHook?.isLoading}
                  className={`inline-flex items-center justify-center rounded-full px-3 py-2 text-sm transition-colors ${
                    subscriptionHook?.isSubscribed
                      ? 'bg-zinc-600 text-white hover:bg-zinc-500'
                      : 'bg-white text-gray-900 hover:bg-gray-100'
                  } ${subscriptionHook?.isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  aria-pressed={subscriptionHook?.isSubscribed ? 'true' : 'false'}
                >
                  {subscriptionHook?.isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs">
                        {subscriptionHook?.isSubscribed
                          ? t.states.unsubscribing()
                          : t.states.subscribing()}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs">
                      {subscriptionHook?.isSubscribed
                        ? t.states.subscribed()
                        : t.actions.subscribe()}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* 두 번째 줄: 카테고리/서브카테고리 태그 */}
          {(channel.category || channel.subcategory) && (
            <div className="flex items-center space-x-1.5">
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
