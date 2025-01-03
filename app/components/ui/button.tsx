import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
}

export function Button({
  className,
  variant = 'primary',
  size = 'default',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        'rounded-xl h-10 px-6',
        'font-semibold text-sm tracking-wide',
        'transition-all duration-200 ease-out',
        'hover:scale-105',
        'shadow-lg',
        'flex items-center justify-center',
        
        // Variant styles
        variant === 'primary' && [
          'bg-[#EAFD66]/90 hover:bg-[#EAFD66]',
          'border-2 border-[#EAFD66]/20 hover:border-[#EAFD66]/40',
          'text-black',
          'shadow-[#EAFD66]/20',
        ],
        variant === 'secondary' && [
          'bg-white/10 hover:bg-white/20',
          'border-2 border-white/20 hover:border-white/40',
          'text-white',
          'shadow-white/10',
        ],

        // Size styles
        size === 'sm' && 'text-xs px-4 h-8',
        size === 'lg' && 'text-base px-8 h-12',
        
        className
      )}
      {...props}
    />
  );
} 