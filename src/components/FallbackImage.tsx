'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

type FallbackType = 'avatar' | 'thumbnail' | 'banner' | 'content';
type Size = 'sm' | 'md' | 'lg' | 'xl';

interface FallbackImageProps {
  type: FallbackType;
  size?: Size;
  fallbackText?: string;
  className?: string;
  children?: React.ReactNode;
  disableHover?: boolean;
}

// 타입별 기본 설정
const typeConfig = {
  avatar: {
    aspectRatio: 'aspect-square',
    icon: 'user',
    defaultText: '?',
  },
  thumbnail: {
    aspectRatio: 'aspect-[4/5]',
    icon: null,
    defaultText: '',
  },
  banner: {
    aspectRatio: 'aspect-[16/9]',
    icon: null,
    defaultText: '',
  },
  content: {
    aspectRatio: 'aspect-video',
    icon: null,
    defaultText: '',
  },
} as const;

// 사이즈별 설정
const sizeConfig = {
  sm: {
    container: 'w-8 h-8',
    icon: 'w-3 h-3',
    text: 'text-xs',
  },
  md: {
    container: 'w-12 h-12',
    icon: 'w-4 h-4',
    text: 'text-sm',
  },
  lg: {
    container: 'w-16 h-16',
    icon: 'w-6 h-6',
    text: 'text-base',
  },
  xl: {
    container: 'w-24 h-24',
    icon: 'w-8 h-8',
    text: 'text-lg',
  },
} as const;

// 아이콘 컴포넌트들 (currentColor 사용)
const UserIcon = ({ className }: { className?: string }) => (
  <svg
    className={cn('text-current', className)}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const ImageIcon = ({ className }: { className?: string }) => (
  <svg
    className={cn('text-current', className)}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

export function FallbackImage({
  type,
  size = 'md',
  fallbackText,
  className,
  children,
  disableHover = false,
}: FallbackImageProps) {
  const config = typeConfig[type];
  const sizeClasses = sizeConfig[size];

  // 아바타는 고정 사이즈, 나머지는 aspect ratio 사용
  const isAvatar = type === 'avatar';
  const containerClass = isAvatar ? sizeClasses.container : config.aspectRatio;

  // 표시할 콘텐츠 결정
  const displayText = fallbackText || config.defaultText;
  const showIcon = !displayText && config.icon;

  // 아바타만 텍스트 표시, 나머지는 그라디언트만 표시
  const showText = type === 'avatar' && displayText;

  // 아이콘 컴포넌트 선택
  const IconComponent =
    config.icon === 'user' ? UserIcon : config.icon === 'image' ? ImageIcon : null;

  return (
    <div
      className={cn(
        // 기본 컨테이너 스타일
        'relative flex items-center justify-center overflow-hidden',

        // 디자인 시스템 v3 토큰 사용
        'bg-[rgb(var(--color-surface-2))]',
        // 배너와 콘텐츠는 테두리 없음
        type === 'banner' || type === 'content' ? '' : 'border border-[rgb(var(--color-border))]',
        'text-[rgb(var(--color-muted))]',

        // 타입별 모양
        isAvatar || type === 'thumbnail' ? 'rounded-full' : 'rounded-lg',

        // 사이즈 또는 비율
        containerClass,

        // 호버 효과 (선택사항)
        'transition-colors duration-200',
        !disableHover && 'hover:bg-[var(--color-primary-bg)]',
        !disableHover && 'hover:border-[var(--color-primary-bd)]',
        !disableHover && 'hover:text-[var(--color-primary)]',

        className,
      )}
      role="img"
      aria-label={`${type} image placeholder`}
    >
      {/* 배경 그라디언트 - 아바타는 subtle, 나머지는 회색 톤 그라디언트 */}
      {showText ? (
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[rgb(var(--color-surface))] opacity-30" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 opacity-70" />
      )}

      {/* 콘텐츠 */}
      <div className="relative z-10 flex items-center justify-center">
        {children ? (
          children
        ) : showText ? (
          <span className={cn('font-medium select-none', sizeClasses.text)}>{displayText}</span>
        ) : showIcon && IconComponent ? (
          <IconComponent className={sizeClasses.icon} />
        ) : null}
      </div>

      {/* Primary accent 하이라이트 (매우 subtle) */}
      <div className="absolute inset-0 bg-[var(--color-primary-bg)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}

// 타입별 편의 컴포넌트들
export function AvatarFallback({
  fallbackText,
  size = 'md',
  className,
  disableHover,
}: Omit<FallbackImageProps, 'type'>) {
  return (
    <FallbackImage
      type="avatar"
      size={size}
      fallbackText={fallbackText}
      className={className}
      disableHover={disableHover}
    />
  );
}

export function ThumbnailFallback({
  size = 'md',
  className,
}: Omit<FallbackImageProps, 'type' | 'fallbackText'>) {
  return <FallbackImage type="thumbnail" size={size} className={className} />;
}

export function BannerFallback({
  className,
}: Omit<FallbackImageProps, 'type' | 'size' | 'fallbackText'>) {
  return <FallbackImage type="banner" className={className} />;
}

export function ContentFallback({
  className,
}: Omit<FallbackImageProps, 'type' | 'size' | 'fallbackText'>) {
  return <FallbackImage type="content" className={className} />;
}
