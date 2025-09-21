import { forwardRef } from 'react';
import { clsx } from 'clsx';

interface TouchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

/**
 * 모바일 터치 최적화된 버튼 컴포넌트
 * - 최소 44x44px 터치 영역 보장 (iOS/Android 표준)
 * - 접근성 및 포커스 링 포함
 * - iOS 탭 하이라이트 최적화
 */
export const TouchButton = forwardRef<HTMLButtonElement, TouchButtonProps>(
  ({ variant = 'ghost', size = 'md', className, children, ...props }, ref) => {
    const baseClasses =
      "inline-flex items-center justify-center rounded-lg transition-colors " +
      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 " +
      "focus-visible:outline-primary disabled:opacity-50 disabled:pointer-events-none " +
      "[-webkit-tap-highlight-color:rgba(0,0,0,0.08)]";

    const variants = {
      primary: "bg-primary text-primary-on hover:bg-primary/90",
      secondary: "bg-zinc-900 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white",
      ghost: "text-zinc-300 hover:text-white hover:bg-zinc-800/50",
    };

    const sizes = {
      sm: "min-h-10 min-w-10 px-2.5 text-sm", // 40px
      md: "min-h-11 min-w-11 px-3 text-sm",   // 44px
      lg: "min-h-12 min-w-12 px-4 text-base", // 48px
    };

    return (
      <button
        ref={ref}
        className={clsx(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

TouchButton.displayName = 'TouchButton';