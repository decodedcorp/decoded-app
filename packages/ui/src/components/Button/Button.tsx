import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Icon } from '../Icon';
import type { IconName } from '../Icon';

const buttonVariants = cva(
  // 기본 스타일 (기존 LoginButton 패턴 활용)
  'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        // 기존 스타일 재활용
        primary: 'bg-neutral-900 text-primary hover:bg-primary hover:text-black',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        outline: 'border border-gray-300 bg-transparent hover:bg-gray-100',
        ghost: 'bg-transparent hover:bg-gray-100',
        destructive: 'bg-red-600 text-white hover:bg-red-700', // 기존 패턴
      },
      size: {
        sm: 'h-8 px-3 text-sm', // 기존 py-1.5 패턴
        md: 'h-10 px-4 text-base', // 기존 py-2 패턴  
        lg: 'h-12 px-6 text-lg',
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps 
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  icon?: IconName;
  iconPosition?: 'left' | 'right';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, icon, iconPosition = 'left', disabled, children, ...props }, ref) => {
    const isDisabled = disabled || loading;
    
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={isDisabled}
        aria-busy={loading}
        ref={ref}
        {...props}
      >
        {loading && (
          <Icon
            name="loader-2" 
            className="h-4 w-4 animate-spin"
            aria-hidden="true"
          />
        )}
        
        {!loading && icon && iconPosition === 'left' && (
          <Icon
            name={icon}
            className="h-4 w-4"
            aria-hidden="true"
          />
        )}
        
        {children}
        
        {!loading && icon && iconPosition === 'right' && (
          <Icon
            name={icon}
            className="h-4 w-4" 
            aria-hidden="true"
          />
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';