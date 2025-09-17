import React from 'react';
import { cn } from '../lib/utils';

export interface AvatarProps {
  /** User ID or name for fallback text */
  userId: string;
  /** Profile image URL (optional) */
  src?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
  /** Alt text for the image */
  alt?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-12 h-12 text-base',
};

export const Avatar: React.FC<AvatarProps> = ({
  userId,
  src,
  size = 'md',
  className,
  alt,
}) => {
  const fallbackText = userId.charAt(0).toUpperCase();
  const sizeClass = sizeClasses[size];

  return (
    <div
      className={cn(
        'relative flex items-center justify-center flex-shrink-0 rounded-full overflow-hidden',
        'bg-zinc-800 border border-zinc-700',
        'transition-colors duration-200',
        sizeClass,
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt || `Profile of ${userId}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Hide image on error and show fallback
            e.currentTarget.style.display = 'none';
            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
      ) : null}
      
      {/* Fallback text - always present but hidden when image loads */}
      <span
        className={cn(
          'text-zinc-300 font-medium select-none',
          src ? 'hidden' : 'flex'
        )}
        style={{ display: src ? 'none' : 'flex' }}
      >
        {fallbackText}
      </span>
    </div>
  );
};

