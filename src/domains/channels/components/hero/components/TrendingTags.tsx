'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from '../ChannelHero.module.css';

const trendingTags = [
  'minimalist lifestyle',
  'indie music discovery',
  'plant-based cooking',
  'digital art trends',
  'sustainable fashion',
  'mindful meditation',
  'urban photography',
  'craft beer culture',
  'vintage aesthetics',
  'tech productivity',
  'outdoor adventures',
  'cozy home vibes',
  'street food culture',
  'retro gaming',
  'wellness routines',
];

// Pre-defined animation durations to avoid hydration mismatch
const animationDurations = [
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
];

export function TrendingTags() {
  const router = useRouter();

  const handleTagClick = (tag: string) => {
    const searchParams = new URLSearchParams({
      q: tag,
      type: 'trending',
    });

    router.push(`/channels?${searchParams.toString()}`);
  };

  return (
    <div className={styles.trendingTagsContainer}>
      <div className={styles.trendingTags}>
        {trendingTags.map((tag, index) => (
          <div
            key={index}
            className={styles.trendingTag}
            style={{
              animationDelay: `${index * 0.1}s`,
              animationDuration: animationDurations[index % animationDurations.length],
            }}
            onClick={() => handleTagClick(tag)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTagClick(tag);
              }
            }}
          >
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
}
