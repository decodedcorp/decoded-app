import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const spinnerVariants = cva(
  // 기본 스타일 - Design System v3 호환
  'inline-block rounded-full animate-spin border-2',
  {
    variants: {
      size: {
        xs: 'h-3 w-3',   // 12px - 인라인 텍스트
        sm: 'h-4 w-4',   // 16px - 버튼 내부
        md: 'h-6 w-6',   // 24px - 섹션 로딩
        lg: 'h-8 w-8',   // 32px - 페이지 로딩
        xl: 'h-12 w-12', // 48px - 전체 화면
      },
      variant: {
        primary: 'border-primary/20 border-t-primary',
        secondary: 'border-secondary/20 border-t-secondary',
        muted: 'border-muted/20 border-t-muted',
        // 기존 하드코딩된 스타일들도 지원
        blue: 'border-blue-200 border-t-blue-600',
        zinc: 'border-zinc-200 border-t-zinc-400',
        white: 'border-white/30 border-t-white',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'primary',
    },
  },
);

export interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
  label?: string;
  'aria-label'?: string;
}

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, variant, label, 'aria-label': ariaLabel, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(spinnerVariants({ size, variant }), className)}
        role="status"
        aria-live="polite"
        aria-label={ariaLabel || label || '로딩 중'}
        {...props}
      />
    );
  },
);

Spinner.displayName = 'Spinner';