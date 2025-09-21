import React from 'react';
import { cn } from '../lib/utils';
import { AvatarFallback } from '@/components/FallbackImage';

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
  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const fallbackText = userId.charAt(0).toUpperCase();
  const sizeClass = sizeClasses[size];

  // 이미지 상태가 변경될 때 리셋
  React.useEffect(() => {
    if (src) {
      setImageError(false);
      setImageLoaded(false);
    }
  }, [src]);

  const showFallback = !src || imageError || !imageLoaded;

  return (
    <div
      className={cn(
        'relative flex-shrink-0 overflow-hidden',
        sizeClass,
        className
      )}
    >
      {/* 이미지 */}
      {src && !imageError && (
        <img
          src={src}
          alt={alt || `Profile of ${userId}`}
          className={cn(
            'w-full h-full object-cover rounded-full transition-opacity duration-200',
            imageLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      )}

      {/* Fallback */}
      {showFallback && (
        <AvatarFallback
          size={size}
          fallbackText={fallbackText}
          className="w-full h-full"
        />
      )}
    </div>
  );
};

