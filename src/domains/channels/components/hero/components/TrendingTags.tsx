'use client';

import React, { useMemo, useCallback } from 'react';

import { useRouter } from 'next/navigation';

import styles from '../ChannelHero.module.css';
import { TrendingTagsProps, TrendingTag } from '../types';

export function TrendingTags({
  className = '',
  maxTags = 15,
  showCategories = false,
  tags: customTags,
}: TrendingTagsProps) {
  const router = useRouter();

  // Memoized trending tags with enhanced metadata
  const trendingTags: TrendingTag[] = useMemo(
    () =>
      customTags || [
        { id: '1', text: 'minimalist lifestyle', category: 'lifestyle', popularity: 'high' },
        { id: '2', text: 'indie music discovery', category: 'entertainment', popularity: 'medium' },
        { id: '3', text: 'plant-based cooking', category: 'food', popularity: 'high' },
        { id: '4', text: 'digital art trends', category: 'culture', popularity: 'medium' },
        { id: '5', text: 'sustainable fashion', category: 'lifestyle', popularity: 'high' },
        { id: '6', text: 'mindful meditation', category: 'wellness', popularity: 'medium' },
        { id: '7', text: 'urban photography', category: 'culture', popularity: 'low' },
        { id: '8', text: 'craft beer culture', category: 'food', popularity: 'medium' },
        { id: '9', text: 'vintage aesthetics', category: 'lifestyle', popularity: 'high' },
        { id: '10', text: 'tech productivity', category: 'tech', popularity: 'high' },
        { id: '11', text: 'outdoor adventures', category: 'lifestyle', popularity: 'medium' },
        { id: '12', text: 'cozy home vibes', category: 'lifestyle', popularity: 'high' },
        { id: '13', text: 'street food culture', category: 'food', popularity: 'medium' },
        { id: '14', text: 'retro gaming', category: 'entertainment', popularity: 'low' },
        { id: '15', text: 'wellness routines', category: 'wellness', popularity: 'high' },
      ],
    [customTags],
  );

  // Pre-defined animation durations to avoid hydration mismatch
  const animationDurations = useMemo(
    () => [
      '2.4s',
      '2.8s',
      '3.2s',
      '2.6s',
      '3.0s',
      '2.7s',
      '3.1s',
      '2.9s',
      '2.5s',
      '3.3s',
      '2.3s',
      '2.8s',
      '3.0s',
      '2.6s',
      '2.9s',
    ],
    [],
  );

  // Filter tags based on maxTags prop
  const visibleTags = useMemo(() => trendingTags.slice(0, maxTags), [trendingTags, maxTags]);

  // Handle tag click with enhanced analytics
  const handleTagClick = useCallback(
    (tag: TrendingTag) => {
      const searchParams = new URLSearchParams({
        q: tag.text,
        type: 'trending',
        category: tag.category,
        popularity: tag.popularity,
        source: 'hero-trending-tags',
      });

      router.push(`/channels?${searchParams.toString()}`);
    },
    [router],
  );

  // Handle keyboard navigation
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent, tag: TrendingTag) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleTagClick(tag);
      }
    },
    [handleTagClick],
  );

  // Get category color for visual distinction
  const getCategoryColor = useCallback((category: TrendingTag['category']) => {
    const colors = {
      lifestyle: 'border-lifestyle',
      entertainment: 'border-entertainment',
      wellness: 'border-wellness',
      culture: 'border-culture',
      tech: 'border-tech',
      food: 'border-food',
    };
    return colors[category] || 'border-gray-400';
  }, []);

  // Get popularity indicator
  const getPopularityIndicator = useCallback((popularity: TrendingTag['popularity']) => {
    const indicators = {
      high: '🔥',
      medium: '⭐',
      low: '✨',
    };
    return indicators[popularity] || '✨';
  }, []);

  return (
    <div className={`${styles.trendingTagsContainer} ${className}`}>
      <div
        className={styles.trendingTags}
        role="list"
        aria-label="Trending topics and interests to explore"
      >
        {visibleTags.map((tag, index) => (
          <div
            key={tag.id}
            className={`${styles.trendingTag} ${getCategoryColor(tag.category)}`}
            style={{
              animationDelay: `${index * 0.1}s`,
              animationDuration: animationDurations[index % animationDurations.length],
            }}
            onClick={() => handleTagClick(tag)}
            role="listitem"
            tabIndex={0}
            aria-label={`Click to explore ${tag.text} (${tag.category} category, ${tag.popularity} popularity)`}
            onKeyPress={(e) => handleKeyPress(e, tag)}
            data-category={tag.category}
            data-popularity={tag.popularity}
          >
            <span className="flex items-center gap-2">
              {showCategories && (
                <span className="text-xs opacity-60">{getPopularityIndicator(tag.popularity)}</span>
              )}
              <span>{tag.text}</span>
            </span>
          </div>
        ))}
      </div>

      {/* Screen reader description */}
      <div className="sr-only">
        Trending topics include lifestyle, entertainment, wellness, culture, tech, and food
        categories. Click on any tag to explore related channels and content.
      </div>
    </div>
  );
}
