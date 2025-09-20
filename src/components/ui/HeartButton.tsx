'use client';

import React, { memo } from 'react';
import { LoadingSpinner } from '@/domains/channels/components/common/LoadingStates';

// 좋아요 수 포맷팅 함수
const formatCount = (count: number): string => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
};

// HeartButton Props 인터페이스
export interface HeartButtonProps {
  /** 좋아요 상태 */
  isLiked: boolean;
  /** 좋아요 수 */
  likeCount?: number;
  /** 좋아요 토글 핸들러 */
  onLike: () => void;
  /** 버튼 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 좋아요 수 표시 여부 */
  showCount?: boolean;
  /** 로딩 상태 */
  isLoading?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 버튼 비활성화 */
  disabled?: boolean;
}

// 하트 아이콘 컴포넌트
const HeartIcon = ({ className }: { className: string }) => (
  <svg
    className={className}
    fill="currentColor"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

/**
 * 하트 모양의 좋아요 버튼 컴포넌트
 *
 * @example
 * ```tsx
 * <HeartButton
 *   isLiked={isLiked}
 *   likeCount={42}
 *   onLike={handleLike}
 *   size="md"
 *   showCount={true}
 * />
 * ```
 */
export const HeartButton = memo<HeartButtonProps>(
  ({
    isLiked,
    likeCount = 0,
    onLike,
    size = 'md',
    showCount = true,
    isLoading = false,
    className = '',
    disabled = false,
  }) => {
    // 크기별 스타일링
    const sizeStyles = {
      sm: {
        button: 'min-w-[2rem] h-8 px-2',
        icon: 'w-4 h-4',
        text: 'text-xs',
        gap: 'gap-1',
      },
      md: {
        button: 'min-w-[2.5rem] h-10 px-3',
        icon: 'w-5 h-5',
        text: 'text-sm',
        gap: 'gap-2',
      },
      lg: {
        button: 'min-w-[3rem] h-12 px-4',
        icon: 'w-6 h-6',
        text: 'text-base',
        gap: 'gap-2',
      },
    };

    const styles = sizeStyles[size];

    // 클릭 핸들러
    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!isLoading && !disabled) {
        onLike();
      }
    };

    // ARIA 라벨
    const ariaLabel = isLiked
      ? `Unlike this content. Currently has ${likeCount} likes.`
      : `Like this content. Currently has ${likeCount} likes.`;

    return (
      <button
        onClick={handleClick}
        disabled={isLoading || disabled}
        aria-label={ariaLabel}
        className={`
          group relative flex items-center justify-center
          ${styles.button} ${styles.gap}
          bg-black/70 backdrop-blur-sm rounded-full
          border border-white/20 
          transition-all duration-200
          hover:bg-black/80 hover:scale-110 hover:border-white/40
          focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:ring-offset-2 focus:ring-offset-transparent
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          ${className}
        `}
      >
        {/* 로딩 상태 */}
        {isLoading ? (
          <LoadingSpinner size={size} className="border-white border-t-transparent" />
        ) : (
          <>
            {/* 하트 아이콘 */}
            <HeartIcon
              className={`
                ${styles.icon} 
                transition-all duration-200
                ${
                  isLiked
                    ? 'text-red-500 fill-red-500 group-hover:scale-110'
                    : 'text-white/80 fill-none group-hover:text-red-400 group-hover:fill-red-400/20'
                }
              `}
            />

            {/* 좋아요 수 */}
            {showCount && likeCount > 0 && (
              <span className={`text-white font-medium ${styles.text}`}>
                {formatCount(likeCount)}
              </span>
            )}
          </>
        )}

        {/* 하트 펄스 애니메이션 (좋아요 시) */}
        {isLiked && !isLoading && (
          <div className="absolute inset-0 rounded-full">
            <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
          </div>
        )}
      </button>
    );
  },
  // 메모 최적화
  (prevProps, nextProps) => {
    return (
      prevProps.isLiked === nextProps.isLiked &&
      prevProps.likeCount === nextProps.likeCount &&
      prevProps.isLoading === nextProps.isLoading &&
      prevProps.disabled === nextProps.disabled &&
      prevProps.size === nextProps.size &&
      prevProps.showCount === nextProps.showCount
    );
  },
);

HeartButton.displayName = 'HeartButton';
