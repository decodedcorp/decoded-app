'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';
import { BannerFallback, AvatarFallback, ThumbnailFallback } from '@/components/FallbackImage';
import { ChannelData } from '@/store/channelModalStore';
import { toast } from 'react-hot-toast';
import { ChannelEditorsStackedAvatars } from '@/shared/components/ChannelEditorsStackedAvatars';
import { EditorsListModal } from '@/shared/components/EditorsListModal';
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

interface ChannelModalHeaderProps {
  channel: ChannelData;
  onClose: () => void;
  onSearch?: (query: string) => void;
  onSubscribe?: () => void;
  onUnsubscribe?: () => void;
  isSubscribeLoading?: boolean;
  currentUserId?: string; // 현재 사용자 ID (소유자 확인용)
  subscriptionHook?: any; // useChannelSubscription hook return value
  ownerId?: string | null; // 채널 작성자 ID (명시적 전달)
  createdAt?: string | null; // 채널 작성시간 (명시적 전달)
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
  ownerId,
  createdAt,
}: ChannelModalHeaderProps) {
  const t = useCommonTranslation();
  const router = useRouter();
  const [isEditorsModalOpen, setIsEditorsModalOpen] = useState(false);

  // 소유자 권한 확인 - 명시적으로 전달된 ownerId 우선 사용
  const effectiveOwnerId = ownerId || channel.owner_id;
  const isOwner = currentUserId && effectiveOwnerId && currentUserId === effectiveOwnerId;

  // 디버깅을 위한 로그
  React.useEffect(() => {
    console.log('🎯 [ChannelModalHeader] Props received:', {
      channelOwnerId: channel.owner_id,
      passedOwnerId: ownerId,
      effectiveOwnerId,
      channelCreatedAt: channel.created_at,
      passedCreatedAt: createdAt,
      isOwner,
    });
  }, [channel.owner_id, ownerId, effectiveOwnerId, channel.created_at, createdAt, isOwner]);

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
      toast.error(t.status.error());
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
              <h2 id="channel-modal-title" className="text-lg font-bold text-white truncate">
                {channel.name}
              </h2>

              {/* 채널 설명 */}
              {channel.description && (
                <p className="text-zinc-400 text-xs mb-3 line-clamp-2 leading-relaxed">
                  {channel.description}
                </p>
              )}

              {/* 통계 정보 */}
              <div className="">
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

            {/* 오른쪽: 액션 버튼들 */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Subscribe 버튼 - 소유자가 아닌 경우에만 표시 */}
              {!isOwner && (
                <button
                  onClick={handleSubscribe}
                  disabled={subscriptionHook?.isLoading}
                  className={`inline-flex items-center justify-center rounded-md px-1.5 py-1 md:px-3 md:py-1.5 text-xs md:text-sm transition-colors border ${
                    subscriptionHook?.isSubscribed
                      ? 'bg-zinc-800 text-gray-400 hover:bg-zinc-700 hover:text-white border-zinc-700 hover:border-zinc-600'
                      : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700 hover:text-white border-zinc-700 hover:border-zinc-600'
                  } ${subscriptionHook?.isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  aria-pressed={subscriptionHook?.isSubscribed ? 'true' : 'false'}
                >
                  {subscriptionHook?.isLoading ? (
                    <div className="flex items-center gap-1 md:gap-2">
                      <InlineSpinner size="sm" className="text-gray-400" />
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
        ownerId={effectiveOwnerId}
      />
    </div>
  );
}
