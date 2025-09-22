'use client';

import React from 'react';
import { useLoadingDelay } from '../../../../hooks/useLoadingDelay';
import { LoadingSkeleton } from '../../../../shared/components/loading/LoadingSkeleton';
import { InlineSpinner } from '../../../../shared/components/loading/InlineSpinner';
import { useCommonTranslation, useErrorTranslation } from '../../../../lib/i18n/hooks';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div
      className={`animate-spin border-2 border-white/30 border-t-white rounded-full ${sizeClasses[size]} ${className}`}
    />
  );
}

interface LoadingStateProps {
  title?: string;
  subtitle?: string;
  className?: string;
  useSkeleton?: boolean;
  skeletonKind?: 'grid' | 'card' | 'text' | 'list' | 'profile';
  skeletonRows?: number;
}

export function LoadingState({
  title,
  subtitle,
  className = '',
  useSkeleton = false,
  skeletonKind = 'card',
  skeletonRows = 3,
}: LoadingStateProps) {
  const { status } = useCommonTranslation();
  const { shouldRender } = useLoadingDelay(true);

  if (!shouldRender) return null;

  // 스켈레톤 사용 시 (섹션 로딩)
  if (useSkeleton) {
    return (
      <div className={className}>
        <LoadingSkeleton kind={skeletonKind} rows={skeletonRows} className="w-full" />
      </div>
    );
  }

  // 전체 화면 로딩 (스피너 + 텍스트)
  const defaultTitle = title || status.loading();
  return (
    <div className={`h-full flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center">
        <LoadingSpinner size="lg" className="mb-4" />
        <div className="text-gray-400 text-lg">{defaultTitle}</div>
        {subtitle && <div className="text-gray-500 text-sm mt-2">{subtitle}</div>}
      </div>
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  subtitle?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ title, subtitle, onRetry, className = '' }: ErrorStateProps) {
  const { general, actions } = useErrorTranslation();
  const defaultTitle = title || general.server();
  const defaultSubtitle = subtitle || actions.retry();
  return (
    <div className={`h-full flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center text-center">
        <svg
          className="w-16 h-16 text-red-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.664 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <div className="text-red-500 text-lg mb-2">{defaultTitle}</div>
        <div className="text-gray-500">{defaultSubtitle}</div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-gray-400 hover:text-gray-300 rounded-lg transition-colors duration-200"
          >
            {actions.retry()}
          </button>
        )}
      </div>
    </div>
  );
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, subtitle, action, className = '' }: EmptyStateProps) {
  const defaultIcon = (
    <svg
      className="w-16 h-16 text-zinc-600 mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
      />
    </svg>
  );

  return (
    <div className={`h-full flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center text-center">
        {icon || defaultIcon}
        <div className="text-gray-400 text-lg mb-2">{title}</div>
        {subtitle && <div className="text-gray-500">{subtitle}</div>}
        {action && <div className="mt-4">{action}</div>}
      </div>
    </div>
  );
}
