import { forwardRef } from 'react';
import { clsx } from 'clsx';

interface SafeTextProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  variant?: 'body' | 'caption' | 'title' | 'headline';
  balance?: boolean; // text-wrap: balance 지원
  children: React.ReactNode;
}

/**
 * 한국어/영어 혼용 텍스트를 위한 안전한 텍스트 컴포넌트
 * - 한국어: word-break: keep-all (자연스러운 줄바꿈)
 * - 영어/URL: overflow-wrap: anywhere (긴 텍스트 안전 처리)
 * - 제목: text-wrap: balance 지원 (균형잡힌 줄바꿈)
 */
export const SafeText = forwardRef<HTMLElement, SafeTextProps>(
  ({ as: Component = 'p', variant = 'body', balance = false, className, children, ...props }, ref) => {
    const baseClasses =
      "break-words [overflow-wrap:anywhere] [word-break:keep-all]";

    const balanceClasses = balance
      ? "[text-wrap:balance] md:[text-wrap:pretty]"
      : "";

    const variants = {
      body: "text-sm md:text-base leading-relaxed",
      caption: "text-xs md:text-sm leading-normal",
      title: "text-lg md:text-xl font-semibold leading-tight",
      headline: "text-xl md:text-2xl font-bold leading-tight",
    };

    return (
      <Component
        ref={ref as any}
        className={clsx(
          baseClasses,
          balanceClasses,
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

SafeText.displayName = 'SafeText';