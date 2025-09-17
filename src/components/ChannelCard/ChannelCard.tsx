'use client';

import React, { memo } from 'react';

import { ChannelResponse } from '@/api/generated/models/ChannelResponse';
import { useChannelSubscription } from '@/domains/interactions/hooks/useChannelSubscription';
import { HeartButton } from '@/components/ui/HeartButton';
import { useChannelLike } from '@/domains/interactions/hooks/useChannelLike';
import { ChannelEditorsStackedAvatars } from '@/shared/components/ChannelEditorsStackedAvatars';
import { useCommonTranslation } from '@/lib/i18n/hooks';

// Base channel data interface
interface BaseChannel {
  id: string;
  name: string;
  description?: string;
  profileImageUrl: string;
  isVerified?: boolean;
  followerCount?: number;
  contentCount?: number;
  category?: string;
  subcategory?: string;
  managers?: import('@/api/generated/models/UserProfileResponse').UserProfileResponse[];
  manager_ids?: string[];
}

// Masonry-specific event handlers
interface MasonryProps {
  item?: any;
  onItemClick?: (item: any) => void;
  onKeyDown?: (e: React.KeyboardEvent, item: any) => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
}

// Main ChannelCard Props - Optimized from 46 to 25 props
export interface ChannelCardProps {
  // Core props
  channel: ChannelResponse | BaseChannel;
  className?: string;

  // Size and display
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'compact' | 'featured' | 'soft' | 'magazine';

  // Features
  showLikeButton?: boolean;
  highlightCategory?: boolean;
  useSubscriptionHook?: boolean;

  // Events
  onCardClick?: (channel: any) => void;

  // Legacy support (deprecated)
  onFollow?: (channelId: string) => void;
  isFollowing?: boolean;
  isLoading?: boolean;

  // Masonry integration
  masonry?: MasonryProps;
}

// 인증 배지 컴포넌트
const VerificationBadge = () => (
  <div className="ml-3 p-1.5 bg-green-500 rounded-full">
    <svg
      className="w-5 h-5 text-white"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  </div>
);

// 통계 아이템 컴포넌트
const StatItem = ({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label?: string;
}) => (
  <div className="flex items-center gap-3 text-base">
    <div className="w-6 h-6 text-gray-400 opacity-80">{icon}</div>
    <div className="flex flex-col">
      <span className="text-white font-semibold text-lg">{value.toLocaleString()}</span>
      {label && <span className="text-gray-400 text-sm font-medium">{label}</span>}
    </div>
  </div>
);

// 팔로워 아이콘
const FollowerIcon = () => (
  <svg
    className="w-6 h-6"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
  </svg>
);

// 콘텐츠 아이콘
const ContentIcon = () => (
  <svg
    className="w-6 h-6"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

// 날짜 포맷팅 함수
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
};

// 숫자 포맷팅 함수
const formatCount = (count: number | undefined) => {
  if (!count) return '0';
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
};

// ChannelCard 메인 컴포넌트
export const ChannelCard = memo(
  ({
    channel,
    className = '',
    size,
    variant = 'default',
    showLikeButton = false,
    highlightCategory = false,
    useSubscriptionHook = true,
    onCardClick,
    // Legacy support (deprecated)
    onFollow,
    isFollowing = false,
    isLoading = false,
    // Masonry integration
    masonry,
  }: ChannelCardProps) => {
    const t = useCommonTranslation();

    // ChannelResponse인지 확인
    const isChannelResponse = 'owner_id' in channel;

    // 데이터 추출 (ChannelResponse 또는 커스텀 데이터)
    const channelData = isChannelResponse
      ? {
          id: channel.id,
          name: channel.name,
          description: channel.description || undefined,
          profileImageUrl: channel.thumbnail_url || '',
          isVerified: false, // API에서 제공하지 않음
          followerCount: channel.subscriber_count || 0,
          contentCount: channel.content_count || 0,
          category: channel.category,
          subcategory: channel.subcategory,
          created_at: channel.created_at,
          updated_at: channel.updated_at,
          is_subscribed: channel.is_subscribed,
          managers: channel.managers,
          manager_ids: channel.manager_ids,
        }
      : channel;

    // Use new subscription hook - always call hook but with conditional id
    const subscriptionHook = useChannelSubscription(channelData.id);

    // 좋아요 기능
    const {
      isLiked,
      likeCount,
      toggleLike,
      isLoading: isLikeLoading,
    } = useChannelLike(channelData.id);

    // Use subscription stats if available
    const effectiveFollowerCount =
      useSubscriptionHook && subscriptionHook.subscriptionStats
        ? subscriptionHook.subscriptionStats.total_subscribers
        : channelData.followerCount;

    // Use subscription state from hook if available, otherwise fallback to props
    const effectiveIsSubscribed =
      subscriptionHook?.isSubscribed !== undefined
        ? subscriptionHook.isSubscribed
        : isFollowing || (isChannelResponse && channel.is_subscribed);

    const effectiveIsLoading =
      subscriptionHook?.isLoading !== undefined || subscriptionHook?.isInitialLoading !== undefined
        ? subscriptionHook.isLoading || subscriptionHook.isInitialLoading
        : isLoading;

    // 카드 클릭 핸들러 - masonry와 일반 클릭 모두 지원
    const handleCardClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Masonry item 클릭 핸들러 우선
      if (masonry?.onItemClick && masonry.item) {
        masonry.onItemClick(masonry.item);
      } else if (onCardClick) {
        onCardClick(channel);
      }
    };

    // 구독 버튼 클릭 핸들러
    const handleFollowClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (subscriptionHook?.toggleSubscription) {
        // Use subscription hook if available
        try {
          subscriptionHook.toggleSubscription();
        } catch (error) {
          console.error('Error toggling subscription:', error);
        }
      } else if (onFollow) {
        // Use legacy callback
        onFollow(channelData.id);
      } else {
        console.warn('ChannelCard: No subscription handler available');
      }
    };

    // 구독 버튼 텍스트
    const followButtonText = effectiveIsSubscribed ? t.states.subscribed() : t.actions.subscribe();

    // 크기 결정 로직 단순화 - size 우선, 없으면 variant에서 크기 추출
    const effectiveSize =
      size || (variant === 'compact' ? 'small' : variant === 'featured' ? 'large' : 'medium');

    // 카드 크기 클래스 결정 - 고정 높이 제거하고 최소/최대 높이로 변경
    const cardSizeClass = (() => {
      switch (effectiveSize) {
        case 'small':
          return 'w-full min-h-[300px]';
        case 'medium':
          return 'w-full min-h-[360px]';
        case 'large':
          return 'w-full min-h-[420px]';
        default:
          return 'w-full min-h-[360px]';
      }
    })();

    // 이미지 컨테이너 비율 클래스 추가 - 이미지 왜곡 방지
    const imageContainerClass = (() => {
      switch (effectiveSize) {
        case 'small':
          return 'aspect-[4/3]';
        case 'medium':
          return 'aspect-[3/2]';
        case 'large':
          return 'aspect-[16/10]';
        default:
          return 'aspect-[3/2]';
      }
    })();

    // 소프트 UI 스타일 계산
    const isSoftVariant = variant === 'soft';
    const isMagazineVariant = variant === 'magazine';

    const softUIProps = isSoftVariant
      ? {
          backgroundColor: '#2f2f2f',
          boxShadow: '14px 14px 28px rgba(0,0,0,0.5), -14px -14px 28px rgba(255,255,255,0.06)',
        }
      : {
          backgroundColor: '#1f1f1f',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 8px 16px rgba(0, 0, 0, 0.3)',
        };

    // Magazine variant - completely different layout
    if (isMagazineVariant) {
      return (
        <article
          className={`bg-zinc-900/50 border border-zinc-800/50 rounded-lg overflow-hidden cursor-pointer hover:shadow-xl hover:border-zinc-700 hover:bg-zinc-800/50 transition-all duration-300 ${className}`}
          onClick={handleCardClick}
          aria-label={`Channel ${channelData.name}`}
        >
          {/* Top metadata section */}
          <div className="p-4">
            <div className="flex items-center justify-between min-h-[20px]">
              {/* Creation date - left side */}
              <div className="text-zinc-400 text-xs">
                {'created_at' in channelData && channelData.created_at && (
                  <span>{formatDate(channelData.created_at)}</span>
                )}
              </div>

              {/* Subcategory only - right side */}
              <div className="flex flex-wrap gap-1 justify-end">
                {channelData.subcategory && (
                  <span className="px-1.5 py-0.5 bg-zinc-700/60 text-zinc-300 text-xs font-medium rounded-full border border-zinc-600/40">
                    {channelData.subcategory}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Channel Image */}
          <div className="aspect-[4/3] bg-gradient-to-br from-zinc-800 to-zinc-900 overflow-hidden mx-3 mb-3 rounded">
            {channelData.profileImageUrl ? (
              <img
                src={channelData.profileImageUrl}
                alt={`${channelData.name} thumbnail`}
                className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-800">
                <span className="font-bold text-white/90 text-3xl">
                  {channelData.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="px-3 pb-3">
            {/* Channel Title */}
            <h3 className="font-bold text-white text-base mb-1.5 line-clamp-1">
              {channelData.name}
            </h3>

            {/* Channel Description */}
            {channelData.description && (
              <p className="text-zinc-400 text-sm line-clamp-2 mb-3 leading-relaxed">
                {channelData.description}
              </p>
            )}

            {/* Stats */}
            <div className="flex items-center justify-between text-xs text-zinc-400 border-t border-zinc-700/50 pt-2.5 mt-3">
              <div className="flex items-center space-x-3">
                <span className="flex items-center">
                  <svg className="w-3 h-3 mr-1 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                  {formatCount(effectiveFollowerCount)}
                </span>
                <span className="flex items-center">
                  <svg className="w-3 h-3 mr-1 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {formatCount(channelData.contentCount)}
                </span>
                {channelData.managers && channelData.managers.length > 0 && (
                  <span className="flex items-center">
                    <svg
                      className="w-3 h-3 mr-1 opacity-60"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {channelData.managers.length}
                  </span>
                )}
              </div>

              {/* Subscribe button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFollowClick(e);
                }}
                disabled={effectiveIsLoading}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  effectiveIsSubscribed
                    ? 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                    : 'bg-[#eafd66] text-black hover:bg-[#eafd66]/90'
                }`}
              >
                {effectiveIsLoading
                  ? '...'
                  : effectiveIsSubscribed
                  ? t.states.subscribed()
                  : t.actions.subscribe()}
              </button>
            </div>
          </div>
        </article>
      );
    }

    // Original card layout
    return (
      <div
        className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col ${cardSizeClass} ${className} ${
          isSoftVariant
            ? 'hover:shadow-2xl'
            : 'hover:transform hover:-translate-y-1 hover:shadow-3xl'
        }`}
        style={softUIProps}
        onClick={handleCardClick}
        onMouseEnter={masonry?.onMouseEnter}
        onMouseLeave={masonry?.onMouseLeave}
        onKeyDown={
          masonry?.onKeyDown && masonry.item
            ? (e) => masonry.onKeyDown?.(e, masonry.item)
            : undefined
        }
        tabIndex={masonry?.onKeyDown ? 0 : undefined}
        role={masonry?.onKeyDown ? 'button' : undefined}
        aria-label={`Channel ${channelData.name}`}
      >
        <div className="p-3 flex flex-col flex-1 bg-zinc-900/50 border border-zinc-800/50 rounded-xl">
          {/* 상단 프로필 이미지 섹션 - 비율 기반으로 변경 */}
          <div className="relative mb-3 flex-shrink-0">
            <div
              className={`w-full ${imageContainerClass} bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl overflow-hidden`}
            >
              {channelData.profileImageUrl ? (
                <img
                  src={channelData.profileImageUrl}
                  alt={`${channelData.name} profile`}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  loading="lazy"
                  decoding="async"
                  // 이미지 품질 최적화 속성 추가
                  style={{
                    imageRendering: 'auto',
                    backfaceVisibility: 'hidden',
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-gray-600/20">
                  <span className="font-bold text-white/80 text-lg">
                    {channelData.name && channelData.name.length > 0
                      ? channelData.name.charAt(0).toUpperCase()
                      : '?'}
                  </span>
                </div>
              )}
            </div>

            {/* 좋아요 버튼 - 상단 우측 우선 배치 */}
            {showLikeButton && (
              <div className="absolute top-4 right-4 z-10">
                <HeartButton
                  isLiked={isLiked}
                  likeCount={likeCount}
                  onLike={toggleLike}
                  size="sm"
                  showCount={false}
                  isLoading={isLikeLoading}
                />
              </div>
            )}

            {/* 콘텐츠 수 배지 - 좋아요 버튼이 있으면 왼쪽으로 이동 */}
            {(channelData.contentCount ?? 0) > 0 && highlightCategory && (
              <div
                className={`absolute top-4 ${
                  showLikeButton ? 'left-4' : 'right-4'
                } bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full`}
              >
                <span className="text-white text-sm font-medium">
                  {formatCount(channelData.contentCount)} {t.ui.items()}
                </span>
              </div>
            )}

            {/* 카테고리 태그 (있는 경우) */}
            {(channelData.category || channelData.subcategory) && (
              <div className="absolute top-3 left-3">
                <div className="flex flex-col space-y-1">
                  {channelData.category && (
                    <span className="px-2 py-0.5 bg-zinc-600/30 text-zinc-300 text-xs rounded-full border border-zinc-500/30">
                      {channelData.category}
                    </span>
                  )}
                  {channelData.subcategory && (
                    <span className="px-2 py-0.5 bg-zinc-600/30 text-zinc-300 text-xs rounded-full border border-zinc-500/30">
                      {channelData.subcategory}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 하단 정보 섹션 - flex-1로 남은 공간 채움 */}
          <div className="flex-1 flex flex-col justify-between py-2 px-3">
            {/* 상단 정보 */}
            <div className="mb-3">
              {/* 이름과 인증 배지 */}
              <div className="flex items-center gap-2 mb-2">
                <h3 className={`font-semibold text-white text-2xl`}>{channelData.name}</h3>
                {channelData.isVerified && <VerificationBadge />}
              </div>

              {/* 설명 */}
              {channelData.description ? (
                <p className="text-gray-400 leading-relaxed line-clamp-2 text-base">
                  {channelData.description}
                </p>
              ) : null}
            </div>

            {/* 하단 통계 정보 */}
            <div className="flex items-center justify-between">
              {/* 통계 정보 */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <FollowerIcon />
                  <span className="text-white font-medium text-sm">
                    {formatCount(effectiveFollowerCount)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <ContentIcon />
                  <span className="text-white font-medium text-sm">
                    {formatCount(channelData.contentCount)}
                  </span>
                </div>

                {/* Editors */}
                {channelData.managers && channelData.managers.length > 0 && (
                  <div className="flex items-center">
                    <ChannelEditorsStackedAvatars
                      editors={channelData.managers}
                      maxDisplay={3}
                      size="sm"
                      showTooltip={true}
                    />
                  </div>
                )}
              </div>

              {/* 오른쪽 버튼 영역 - 여백 없이 오른쪽 끝에 배치 */}
              <div
                className="flex items-center gap-2 ml-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                {/* Subscribe 버튼 - 항상 표시 */}
                <button
                  onClick={handleFollowClick}
                  disabled={effectiveIsLoading}
                  type="button"
                  style={{ pointerEvents: 'auto', zIndex: 10 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 hover:transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed ${
                    effectiveIsSubscribed
                      ? 'bg-gray-600 text-white hover:bg-gray-500'
                      : 'bg-white text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {effectiveIsLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs">
                        {effectiveIsSubscribed ? t.states.unsubscribing() : t.states.subscribing()}
                      </span>
                    </div>
                  ) : (
                    <>
                      <span className="text-xs">{followButtonText}</span>
                      {!effectiveIsSubscribed && (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 호버 효과 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" />
      </div>
    );
  },
  // 메모 최적화
  (prevProps, nextProps) => {
    return (
      prevProps.channel.id === nextProps.channel.id &&
      prevProps.isFollowing === nextProps.isFollowing &&
      prevProps.isLoading === nextProps.isLoading &&
      prevProps.useSubscriptionHook === nextProps.useSubscriptionHook &&
      prevProps.variant === nextProps.variant &&
      prevProps.size === nextProps.size &&
      prevProps.showLikeButton === nextProps.showLikeButton
    );
  },
);

ChannelCard.displayName = 'ChannelCard';
