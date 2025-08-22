'use client';

import React, { memo } from 'react';
import { ChannelResponse } from '@/api/generated/models/ChannelResponse';

// ChannelCard Props 인터페이스 - ChannelResponse 직접 지원 추가
export interface ChannelCardProps {
  // ChannelResponse를 직접 받을 수 있도록 확장
  channel:
    | ChannelResponse
    | {
        id: string;
        name: string;
        description?: string;
        profileImageUrl: string;
        isVerified?: boolean;
        followerCount?: number;
        contentCount?: number;
        category?: string;
      };
  onFollow?: (channelId: string) => void;
  onCardClick?: (channel: any) => void;
  isFollowing?: boolean;
  isLoading?: boolean;
  className?: string;
  // explore의 크기 variant 추가
  variant?: 'default' | 'compact' | 'featured' | 'soft' | 'small' | 'medium' | 'large';
  // explore 전용 props
  size?: 'small' | 'medium' | 'large';
  highlightCategory?: boolean;
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
    onFollow,
    onCardClick,
    isFollowing = false,
    isLoading = false,
    className = '',
    variant = 'default',
    size,
    highlightCategory = false,
  }: ChannelCardProps) => {
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
          category: undefined, // API에서 제공하지 않음
          created_at: channel.created_at,
          updated_at: channel.updated_at,
          is_subscribed: channel.is_subscribed,
        }
      : channel;

    // 카드 클릭 핸들러
    const handleCardClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (onCardClick) {
        onCardClick(channel);
      }
    };

    // 구독 버튼 클릭 핸들러
    const handleFollowClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (onFollow) {
        onFollow(channelData.id);
      }
    };

    // 구독 버튼 텍스트
    const followButtonText = isFollowing ? 'Subscribed' : 'Subscribe';
    const followButtonVariant = isFollowing
      ? 'bg-gray-700 hover:bg-gray-600 text-white'
      : 'bg-gray-800 hover:bg-gray-700 text-white';

    // 크기 variant 결정 (size prop 우선, 없으면 variant 사용)
    const effectiveSize = size || variant;

    // 카드 크기 클래스 결정
    const cardSizeClass = (() => {
      switch (effectiveSize) {
        case 'small':
          return 'w-full h-[320px]'; // 고정 높이로 설정
        case 'medium':
          return 'w-full h-[360px]'; // 고정 높이로 설정
        case 'large':
          return 'w-full h-[400px]'; // 고정 높이로 설정
        case 'compact':
          return 'w-full h-[280px]'; // 고정 높이로 설정
        case 'featured':
        case 'default':
        case 'soft':
        default:
          return 'w-full h-[360px]'; // 기본값도 고정 높이로
      }
    })();

    // 이미지 높이 클래스 결정
    const imageHeightClass = (() => {
      switch (effectiveSize) {
        case 'small':
          return 'h-32'; // 카드 높이의 약 40%
        case 'medium':
          return 'h-40'; // 카드 높이의 약 40%
        case 'large':
          return 'h-48'; // 카드 높이의 약 40%
        case 'compact':
          return 'h-28'; // 카드 높이의 약 40%
        default:
          return 'h-40'; // 기본값도 카드 높이의 약 40%
      }
    })();

    // 소프트 UI 스타일 계산
    const isSoftVariant = variant === 'soft';
    const softUIProps = isSoftVariant
      ? {
          backgroundColor: '#2f2f2f',
          boxShadow: '14px 14px 28px rgba(0,0,0,0.5), -14px -14px 28px rgba(255,255,255,0.06)',
        }
      : {
          backgroundColor: '#1f1f1f',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 8px 16px rgba(0, 0, 0, 0.3)',
        };

    // explore 스타일인지 확인
    const isExploreStyle = size && ['small', 'medium', 'large'].includes(size);

    return (
      <div
        className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col ${cardSizeClass} ${className} ${
          isSoftVariant
            ? 'hover:shadow-2xl'
            : 'hover:transform hover:-translate-y-1 hover:shadow-3xl'
        }`}
        style={isExploreStyle ? undefined : softUIProps}
        onClick={handleCardClick}
      >
        <div
          className={`p-3 flex flex-col flex-1 ${
            isExploreStyle ? 'bg-zinc-900/50 border border-zinc-800/50 rounded-xl' : ''
          }`}
        >
          {/* 상단 프로필 이미지 섹션 */}
          <div className="relative mb-3 flex-shrink-0">
            <div
              className={`w-full ${imageHeightClass} ${
                isExploreStyle ? 'bg-gradient-to-br from-zinc-800 to-zinc-900' : 'bg-gray-700'
              } rounded-2xl overflow-hidden`}
            >
              {channelData.profileImageUrl ? (
                <img
                  src={channelData.profileImageUrl}
                  alt={`${channelData.name} profile`}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                  <span className="font-bold text-white/80 text-3xl">
                    {channelData.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* 콘텐츠 수 배지 (explore 스타일) */}
            {isExploreStyle && channelData.contentCount && channelData.contentCount > 0 && (
              <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <span className="text-white text-sm font-medium">
                  {formatCount(channelData.contentCount)} items
                </span>
              </div>
            )}

            {/* 카테고리 태그 (있는 경우) */}
            {channelData.category && (
              <div className="absolute top-4 left-4">
                <span className="px-4 py-2 bg-black/70 backdrop-blur-md text-white text-sm font-medium rounded-full border border-white/20">
                  {channelData.category}
                </span>
              </div>
            )}
          </div>

          {/* 하단 정보 섹션 - flex-1로 남은 공간 채움 */}
          <div className="flex-1 flex flex-col justify-between py-2 px-3">
            {/* 상단 정보 */}
            <div className="mb-3">
              {/* 이름과 인증 배지 */}
              <div className="flex items-center gap-2 mb-2">
                <h3
                  className={`font-semibold text-white ${isExploreStyle ? 'text-lg' : 'text-xl'}`}
                >
                  {channelData.name}
                </h3>
                {channelData.isVerified && <VerificationBadge />}
              </div>

              {/* 설명 */}
              {channelData.description ? (
                <p
                  className={`text-gray-400 leading-relaxed line-clamp-2 ${
                    isExploreStyle ? 'text-sm' : 'text-base'
                  }`}
                >
                  {channelData.description}
                </p>
              ) : isExploreStyle ? (
                <p className="text-gray-600 text-sm italic">
                  {channelData.contentCount || 0}개의 엄선된 콘텐츠
                </p>
              ) : null}
            </div>

            {/* 하단 통계 정보 */}
            <div className="flex items-center justify-between">
              {/* 통계 정보 */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <FollowerIcon />
                  <span
                    className={`text-white font-medium ${isExploreStyle ? 'text-xs' : 'text-sm'}`}
                  >
                    {formatCount(channelData.followerCount)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <ContentIcon />
                  <span
                    className={`text-white font-medium ${isExploreStyle ? 'text-xs' : 'text-sm'}`}
                  >
                    {formatCount(channelData.contentCount)}
                  </span>
                </div>
              </div>

              {/* Subscribe 버튼 (explore 스타일이 아닐 때만 표시) */}
              {!isExploreStyle && (
                <button
                  onClick={handleFollowClick}
                  disabled={isLoading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 hover:transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isFollowing
                      ? 'bg-gray-600 text-white hover:bg-gray-500'
                      : 'bg-white text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs">Loading...</span>
                    </div>
                  ) : (
                    <>
                      <span className="text-xs">{followButtonText}</span>
                      {!isFollowing && (
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
              )}

              {/* 화살표 아이콘 (explore 스타일) */}
              {isExploreStyle && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              )}
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
      prevProps.variant === nextProps.variant &&
      prevProps.size === nextProps.size
    );
  },
);

ChannelCard.displayName = 'ChannelCard';
