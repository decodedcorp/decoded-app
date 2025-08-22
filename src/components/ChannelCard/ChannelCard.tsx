'use client';

import React, { memo } from 'react';

// ChannelCard Props 인터페이스
export interface ChannelCardProps {
  channel: {
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
  variant?: 'default' | 'compact' | 'featured' | 'soft';
}

// 인증 배지 컴포넌트
const VerificationBadge = () => (
  <div className="ml-3 p-1 bg-green-500 rounded-full">
    <svg
      className="w-4 h-4 text-white"
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
  <div className="flex items-center gap-3 text-sm">
    <div className="w-5 h-5 text-gray-400 opacity-80">{icon}</div>
    <div className="flex flex-col">
      <span className="text-white font-semibold text-base">{value.toLocaleString()}</span>
      {label && <span className="text-gray-400 text-xs font-medium">{label}</span>}
    </div>
  </div>
);

// 팔로워 아이콘
const FollowerIcon = () => (
  <svg
    className="w-5 h-5"
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
    className="w-5 h-5"
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
  }: ChannelCardProps) => {
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
        onFollow(channel.id);
      }
    };

    // 구독 버튼 텍스트
    const followButtonText = isFollowing ? 'Subscribed' : 'Subscribe';
    const followButtonVariant = isFollowing
      ? 'bg-gray-700 hover:bg-gray-600 text-white'
      : 'bg-gray-800 hover:bg-gray-700 text-white';

    // 카드 크기 클래스
    const cardSizeClass = variant === 'compact' ? 'w-64' : variant === 'featured' ? 'w-80' : 'w-80';

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

    return (
      <div
        className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col ${cardSizeClass} ${className} ${
          isSoftVariant
            ? 'hover:shadow-2xl'
            : 'hover:transform hover:-translate-y-1 hover:shadow-3xl'
        }`}
        style={softUIProps}
        onClick={handleCardClick}
      >
        <div className="p-2 flex flex-col flex-1 pb-2 mb-3">
          {/* 상단 프로필 이미지 섹션 */}
          <div className="relative mb-2 flex-shrink-0">
            <div className="w-full h-72 bg-gray-700 rounded-2xl overflow-hidden">
              <img
                src={channel.profileImageUrl}
                alt={`${channel.name} profile`}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* 카테고리 태그 (있는 경우) */}
            {/* {channel.category && (
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 bg-black/70 backdrop-blur-md text-white text-xs font-medium rounded-full border border-white/20">
                  {channel.category}
                </span>
              </div>
            )} */}
          </div>

          {/* 하단 정보 섹션 */}
          <div className="mb-4 flex-shrink-0 py-3 px-4">
            {/* 이름과 인증 배지 */}
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-2xl font-semibold text-white">{channel.name}</h3>
              {channel.isVerified && <VerificationBadge />}
            </div>

            {/* 설명 */}
            {channel.description && (
              <p className="text-gray-400 text-base leading-relaxed line-clamp-2">
                {channel.description}
              </p>
            )}
          </div>

          {/* 통계와 팔로우 버튼 */}
          <div className="flex items-center justify-between flex-shrink-0 px-4">
            {/* 통계 정보 */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <FollowerIcon />
                <span className="text-white font-small text-sm">{channel.followerCount || 0}</span>
              </div>

              <div className="flex items-center gap-2">
                <ContentIcon />
                <span className="text-white font-small text-sm">{channel.contentCount || 0}</span>
              </div>
            </div>

            {/* 구독 버튼 */}
            <button
              onClick={handleFollowClick}
              disabled={isLoading}
              className={`flex items-center gap-2 px-6 py-3 rounded-4xl font-small text-sm transition-all duration-200 hover:transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed ${
                isFollowing
                  ? 'bg-gray-600 text-white hover:bg-gray-500'
                  : 'bg-white text-gray-900 hover:bg-gray-100'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Loading...
                </div>
              ) : (
                <>
                  <span>{followButtonText}</span>
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
          </div>

          {/* 호버 효과 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" />
        </div>
      </div>
    );
  },
  // 메모 최적화
  (prevProps, nextProps) => {
    return (
      prevProps.channel.id === nextProps.channel.id &&
      prevProps.isFollowing === nextProps.isFollowing &&
      prevProps.isLoading === nextProps.isLoading &&
      prevProps.variant === nextProps.variant
    );
  },
);

ChannelCard.displayName = 'ChannelCard';
