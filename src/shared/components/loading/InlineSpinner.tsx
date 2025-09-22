import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils/cn';

interface InlineSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  ariaLabel?: string;
}

/**
 * 인라인 스피너 컴포넌트
 * 버튼, 입력창 등에 사용
 *
 * @deprecated 새로운 통합 로딩 시스템 사용을 권장합니다:
 * - 간단한 스피너: <Spinner /> (@decoded/ui)
 * - 인라인 로딩: <InlineLoading />
 * - 복합 로딩: <LoadingState type="inline" />
 */
export function InlineSpinner({ size = 'md', className = '', ariaLabel }: InlineSpinnerProps) {
  const { t } = useTranslation('common');

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div
      className={cn(
        'inline-block border-2 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] rounded-full animate-spin',
        sizeClasses[size],
        className,
      )}
      role="status"
      aria-label={ariaLabel || t('status.loading')}
    />
  );
}
