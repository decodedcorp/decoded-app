'use client';

import React, { memo } from 'react';

import { HighlightItem } from '@/lib/types/highlightTypes';
import { ProxiedImage } from '@/components/ProxiedImage';

interface HighlightCardProps {
  highlight: HighlightItem;
  onClick: () => void;
  size?: 'small' | 'medium' | 'large';
}

const HighlightCard = memo(function HighlightCard({
  highlight,
  onClick,
  size = 'medium',
}: HighlightCardProps) {
  // Size configurations
  const sizeClasses = {
    small: 'w-64 h-32',
    medium: 'w-80 h-40',
    large: 'w-96 h-48',
  };

  const textSizes = {
    small: { title: 'text-sm', description: 'text-xs', badge: 'text-xs' },
    medium: { title: 'text-base', description: 'text-sm', badge: 'text-xs' },
    large: { title: 'text-lg', description: 'text-base', badge: 'text-sm' },
  };

  const currentSizeClasses = sizeClasses[size];
  const currentTextSizes = textSizes[size];

  // Badge styling based on highlight type
  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'weekly_thread':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'announcement':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'popular':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'ai_summary':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'recent':
        return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
      default:
        return 'bg-zinc-600/20 text-zinc-400 border-zinc-600/30';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`
        ${currentSizeClasses}
        relative overflow-hidden rounded-xl bg-zinc-800/50 border border-zinc-700/50 
        cursor-pointer group transition-all duration-300 
        hover:scale-[1.02] hover:shadow-xl hover:border-zinc-600/50
        flex-shrink-0
      `}
    >
      {/* Background image */}
      {highlight.imageUrl && (
        <div className="absolute inset-0">
          <ProxiedImage
            src={highlight.imageUrl}
            alt={highlight.title}
            width={400}
            height={200}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            quality={90}
            loading="lazy"
            fallbackSrc=""
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
      )}

      {/* Content overlay */}
      <div className="absolute inset-0 p-4 flex flex-col justify-between">
        {/* Top section - Badge */}
        <div className="flex justify-between items-start">
          {highlight.badge && (
            <span
              className={`
              px-2 py-1 rounded-full font-medium border backdrop-blur-sm
              ${currentTextSizes.badge}
              ${getBadgeStyle(highlight.type)}
            `}
            >
              {highlight.badge}
            </span>
          )}
        </div>

        {/* Bottom section - Content */}
        <div className="space-y-1">
          {/* Date */}
          {highlight.date && (
            <p className={`text-zinc-300 ${currentTextSizes.badge}`}>{highlight.date}</p>
          )}

          {/* Title */}
          <h4
            className={`
            text-white font-semibold leading-tight
            ${currentTextSizes.title}
            ${
              size === 'small'
                ? 'line-clamp-2'
                : size === 'medium'
                ? 'line-clamp-2'
                : 'line-clamp-3'
            }
          `}
          >
            {highlight.title}
          </h4>

          {/* Description (only for larger sizes) */}
          {size !== 'small' && highlight.description && (
            <p
              className={`
              text-zinc-300 leading-snug line-clamp-2
              ${currentTextSizes.description}
            `}
            >
              {highlight.description}
            </p>
          )}
        </div>
      </div>

      {/* Loading state overlay */}
      {highlight.isLoading && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Error state indicator */}
      {highlight.hasError && (
        <div className="absolute top-2 right-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
        </div>
      )}

      {/* Hover effect indicator */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300 pointer-events-none" />
    </div>
  );
});

HighlightCard.displayName = 'HighlightCard';

export default HighlightCard;
