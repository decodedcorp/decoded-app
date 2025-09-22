'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';
import { BannerFallback, AvatarFallback, ThumbnailFallback } from '@/components/FallbackImage';
import { ChannelEditorsStackedAvatars } from '@/shared/components/ChannelEditorsStackedAvatars';
import { EditorsListModal } from '@/shared/components/EditorsListModal';
import { ChannelData } from '@/store/channelModalStore';
import { useContentUploadStore } from '@/store/contentUploadStore';
import { toast } from 'react-hot-toast';
import { useUser } from '@/domains/auth/hooks/useAuth';
import { canManageChannelManagers } from '@/lib/utils/channelPermissions';
import { useChannelSubscription } from '@/domains/interactions/hooks/useChannelSubscription';
import { useCommonTranslation } from '@/lib/i18n/hooks';
import { InlineSpinner } from '@/shared/components/loading/InlineSpinner';

// TagRow 컴포넌트
function TagRow({ tags, mobileLimit = 3 }: { tags: string[]; mobileLimit?: number }) {
  const visible = Math.min(tags.length, mobileLimit);

  return (
    <div className="mt-2">
      {/* 모바일: N개 + +N, 데스크탑: wrap */}
      <div className="flex flex-wrap gap-2 md:gap-2">
        {/* 모바일 가시 영역 */}
        <div className="flex gap-2 md:hidden">
          {tags.slice(0, visible).map((t, i) => (
            <span
              key={i}
              className={`px-2 py-1 bg-zinc-600/30 text-xs rounded-full border border-zinc-500/30
                         max-w-[40vw] truncate ${i === 0 ? 'text-[#eafd66]' : 'text-zinc-300'}`}
              title={t}
            >
              {t}
            </span>
          ))}
          {tags.length > visible && (
            <button
              className="px-2 py-1 text-xs rounded-full border border-zinc-500/40 text-zinc-300/90 hover:bg-zinc-700/30 transition-colors"
              onClick={() => {
                /* TODO: open a modal or bottom sheet with full tag list */
              }}
              aria-label="Show all categories"
            >
              +{tags.length - visible}
            </button>
          )}
        </div>

        {/* 데스크탑: 전부 보여주되 wrap + truncate */}
        <div className="hidden md:flex md:flex-wrap md:gap-2">
          {tags.map((t, i) => (
            <span
              key={i}
              className={`px-2 py-1 bg-zinc-600/30 text-xs rounded-full border border-zinc-500/30
                         max-w-[12rem] truncate ${i === 0 ? 'text-[#eafd66]' : 'text-zinc-300'}`}
              title={t}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

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
      </div>

      {/* 하단 정보 섹션 */}
      <div className="bg-black px-4 py-4">
        <div className="flex flex-col space-y-4">
          {/* 첫 번째 줄: 아바타 + 채널 정보 + 액션 버튼들 */}
          <div className="grid grid-cols-[auto_1fr_auto] items-start gap-4 md:gap-6">
            {/* 왼쪽: 채널 썸네일 */}
            <div className="relative -mt-16 shrink-0">
              {channel.thumbnail_url ? (
                <img
                  src={channel.thumbnail_url}
                  alt={`${channel.name} thumbnail`}
                  className="w-24 h-24 rounded-full border-4 border-black object-cover shadow-lg ring-1 ring-white/10"
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
                className={`w-24 h-24 border-4 border-black shadow-lg ring-1 ring-white/10 ${
                  channel.thumbnail_url ? 'hidden' : 'block'
                }`}
              />
            </div>

            {/* 가운데: 채널 정보 */}
            <div className="min-w-0 flex-1">
              {/* 채널 이름 */}
              <h1 className="text-lg font-bold text-white mb-2 truncate">{channel.name}</h1>

              {/* 채널 설명 */}
              {channel.description && (
                <p className="text-zinc-400 text-sm mb-3 line-clamp-2 leading-relaxed">
                  {channel.description}
                </p>
              )}

              {/* 통계 정보 */}
              <div className="flex items-center gap-1 text-sm text-zinc-400 min-w-0">
                <span className="whitespace-nowrap">
                  {channel.subscriber_count || 0} {t.ui.subscribers()}
                </span>
                <span className="opacity-60">•</span>

                {/* 편집자 영역 */}
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

            {/* 오른쪽: 액션 (아이콘/텍스트 스위치로 좁은 화면 대비) */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Add Content 버튼 */}
              {(isOwner || channel.is_manager) && (
                <button
                  onClick={handleAddContent}
                  className="inline-flex items-center justify-center rounded-full bg-zinc-700 hover:bg-zinc-600 text-white transition-colors px-3 py-2 text-sm sm:px-3 sm:py-2 sm:text-sm w-8 h-8 sm:w-auto sm:h-auto"
                >
                  <span className="hidden sm:inline">+ {t.create.createNewContent()}</span>
                  <span className="sm:hidden">+</span>
                </button>
              )}

              {/* Subscribe 버튼 */}
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
                      <InlineSpinner size="sm" className="text-white" />
                      <span className="text-xs">
                        {subscriptionHook?.isSubscribed
                          ? `${t.actions.unsubscribe()}...`
                          : `${t.actions.subscribe()}...`}
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

              {/* Settings 버튼 */}
              {canManageSettings && (
                <button
                  onClick={handleSettings}
                  className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
                  aria-label={t.navigation.settings()}
                  title={t.navigation.settings()}
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" aria-hidden="true">
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

          {/* 두 번째 줄: 카테고리/서브카테고리 태그 */}
          {(channel.category || channel.subcategory) && (
            <TagRow
              tags={[channel.category, channel.subcategory].filter(Boolean) as string[]}
              mobileLimit={3}
            />
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
