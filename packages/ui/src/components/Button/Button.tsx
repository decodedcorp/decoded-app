import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Icon } from '../Icon';
import type { IconName } from '../Icon';

const buttonVariants = cva(
  // 기본 스타일 (프로젝트 테마 컬러 적용)
  'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        // 프로젝트 테마 컬러 적용 - primary는 테마 컬러 사용
        primary:
          'bg-gray-900 text-[#EAFD66] hover:bg-[#EAFD66] hover:text-black shadow-sm hover:shadow-md',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 shadow-sm hover:shadow-md',
        outline:
          'border border-gray-300 bg-transparent text-gray-900 hover:bg-gray-100 hover:border-gray-400',
        ghost: 'bg-transparent text-gray-900 hover:bg-gray-100',
        destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md',
        // 테마 컬러를 사용한 새로운 variant들
        accent: 'bg-[#EAFD66] text-black hover:bg-[#EAFD66]/90 shadow-sm hover:shadow-md',
        'accent-outline':
          'border border-[#EAFD66] bg-transparent text-[#EAFD66] hover:bg-[#EAFD66] hover:text-black',
        // 로그인 버튼 전용 variant - 더 명확한 테마 컬러 적용
        login:
          'bg-gray-900 text-[#EAFD66] hover:bg-[#EAFD66] hover:text-black border border-[#EAFD66]/20 hover:border-[#EAFD66]/40 shadow-sm hover:shadow-md',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
        xl: 'h-14 px-8 text-xl',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  icon?: IconName;
  iconPosition?: 'left' | 'right';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading,
      icon,
      iconPosition = 'left',
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={isDisabled}
        aria-busy={loading}
        ref={ref}
        {...props}
      >
        {loading && <Icon name="loader-2" className="h-4 w-4 animate-spin" aria-hidden="true" />}

        {!loading && icon && iconPosition === 'left' && (
          <Icon name={icon} className="h-4 w-4" aria-hidden="true" />
        )}

        {children}

        {!loading && icon && iconPosition === 'right' && (
          <Icon name={icon} className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
