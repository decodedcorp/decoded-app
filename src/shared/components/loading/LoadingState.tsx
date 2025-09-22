import React from 'react';
import { cn } from '@/lib/utils/cn';
import { InlineSpinner } from './InlineSpinner';
import { LoadingSkeleton } from './LoadingSkeleton';
import { useLoadingDelay } from '@/hooks/useLoadingDelay';

interface LoadingStateProps {
  /**
   * 로딩 표시 방식
   * - spinner: 중앙 스피너 + 텍스트
   * - skeleton: 스켈레톤 UI 표시
   * - inline: 인라인 스피너 (버튼 등)
   * - overlay: 전체 화면 오버레이
   */
  type: 'spinner' | 'skeleton' | 'inline' | 'overlay';

  /** 로딩 상태 */
  isLoading: boolean;

  /** 스피너 설정 */
  spinner?: {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
  };

  /** 스켈레톤 설정 */
  skeleton?: {
    kind: 'grid' | 'card' | 'text' | 'list' | 'profile' | 'feed' | 'channel' | 'comment' | 'tab';
    rows?: number;
    columns?: number;
    compact?: boolean;
  };

  /** 오버레이 설정 */
  overlay?: {
    backdrop?: boolean;
    message?: string;
    fullScreen?: boolean;
  };

  /** 텍스트 메시지 */
  message?: string;
  subtitle?: string;

  /** 로딩 지연 (깜빡임 방지) */
  delay?: number;

  /** 스타일링 */
  className?: string;

  /** 자식 요소 (로딩 중이 아닐 때 표시) */
  children?: React.ReactNode;
}

/**
 * 통합 로딩 상태 컴포넌트
 * 모든 로딩 패턴을 하나의 컴포넌트로 통합
 */
export function LoadingState({
  type,
  isLoading,
  spinner = { size: 'lg' },
  skeleton = { kind: 'card', rows: 3 },
  overlay = { backdrop: true, fullScreen: false },
  message,
  subtitle,
  delay = 300,
  className,
  children,
}: LoadingStateProps) {
  const { shouldRender } = useLoadingDelay(isLoading, { delay });

  // 로딩 중이 아니면 자식 요소 렌더링
  if (!isLoading) {
    return <>{children}</>;
  }

  // 로딩 지연 처리 (깜빡임 방지)
  if (!shouldRender) {
    return <>{children}</>;
  }

  const renderLoadingContent = () => {
    switch (type) {
      case 'spinner':
        return (
          <div className="flex flex-col items-center justify-center space-y-4">
            <InlineSpinner
              size={spinner.size}
              className={spinner.className}
              ariaLabel={message || '로딩 중'}
            />
            {message && (
              <div className="text-center">
                <p className="text-muted-foreground">{message}</p>
                {subtitle && (
                  <p className="text-sm text-muted-foreground/70 mt-1">{subtitle}</p>
                )}
              </div>
            )}
          </div>
        );

      case 'skeleton':
        return (
          <LoadingSkeleton
            kind={skeleton.kind}
            rows={skeleton.rows}
            columns={skeleton.columns}
            compact={skeleton.compact}
            className="w-full"
          />
        );

      case 'inline':
        return (
          <div className="flex items-center space-x-2">
            <InlineSpinner
              size={spinner.size || 'sm'}
              className={spinner.className}
              ariaLabel={message || '로딩 중'}
            />
            {message && (
              <span className="text-sm text-muted-foreground">{message}</span>
            )}
          </div>
        );

      case 'overlay':
        return (
          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center z-50',
              overlay.backdrop && 'bg-background/80 backdrop-blur-sm',
              overlay.fullScreen && 'fixed'
            )}
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <InlineSpinner
                size={spinner.size || 'lg'}
                className={spinner.className}
                ariaLabel={overlay.message || message || '로딩 중'}
              />
              {(overlay.message || message) && (
                <div className="text-center">
                  <p className="text-foreground font-medium">
                    {overlay.message || message}
                  </p>
                  {subtitle && (
                    <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn('relative', className)} role="status" aria-live="polite">
      {renderLoadingContent()}
    </div>
  );
}

// 편의 컴포넌트들
export const SpinnerLoading = (props: Omit<LoadingStateProps, 'type'>) => (
  <LoadingState {...props} type="spinner" />
);

export const SkeletonLoading = (props: Omit<LoadingStateProps, 'type'>) => (
  <LoadingState {...props} type="skeleton" />
);

export const InlineLoading = (props: Omit<LoadingStateProps, 'type'>) => (
  <LoadingState {...props} type="inline" />
);

export const OverlayLoading = (props: Omit<LoadingStateProps, 'type'>) => (
  <LoadingState {...props} type="overlay" />
);