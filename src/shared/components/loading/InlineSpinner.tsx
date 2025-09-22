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
