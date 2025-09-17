import React from 'react';
import { useMobileOptimization } from '@/lib/hooks/useMobileOptimization';

interface MobileTouchTargetProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: 'button' | 'link' | 'div';
  size?: 'sm' | 'md' | 'lg';
  as?: keyof React.JSX.IntrinsicElements;
}

/**
 * Mobile-optimized touch target component ensuring minimum 44px touch area
 */
export const MobileTouchTarget: React.FC<MobileTouchTargetProps> = ({
  children,
  onClick,
  className = '',
  disabled = false,
  variant = 'button',
  size = 'md',
  as: Component = 'button',
}) => {
  const { isMobile } = useMobileOptimization();

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'min-h-[44px] min-w-[44px] px-3 py-2 text-sm';
      case 'lg':
        return 'min-h-[48px] min-w-[48px] px-6 py-4 text-lg';
      default: // md
        return 'min-h-[44px] min-w-[44px] px-4 py-3 text-base';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'button':
        return `
          bg-blue-600 text-white rounded-lg
          hover:bg-blue-700 active:bg-blue-800
          disabled:bg-gray-300 disabled:cursor-not-allowed
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        `;
      case 'link':
        return `
          text-blue-600 underline
          hover:text-blue-800 active:text-blue-900
          disabled:text-gray-400 disabled:cursor-not-allowed
          transition-colors duration-200
        `;
      default: // div
        return `
          cursor-pointer
          hover:bg-gray-100 active:bg-gray-200
          disabled:cursor-not-allowed disabled:opacity-50
          transition-colors duration-200
        `;
    }
  };

  const baseClasses = `
    inline-flex items-center justify-center
    ${getSizeClasses()}
    ${getVariantClasses()}
    ${isMobile ? 'mobile-touch-target touch-manipulation' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `;

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  const ComponentElement = Component as React.ElementType;

  return (
    <ComponentElement
      className={baseClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      role={variant === 'div' ? 'button' : undefined}
      aria-disabled={disabled}
    >
      {children}
    </ComponentElement>
  );
};
