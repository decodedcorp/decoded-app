'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from '../ChannelHero.module.css';

const trendingTags = [
  "minimalist lifestyle",
  "indie music discovery",
  "plant-based cooking",
  "digital art trends",
  "sustainable fashion",
  "mindful meditation",
  "urban photography",
  "craft beer culture",
  "vintage aesthetics",
  "tech productivity",
  "outdoor adventures",
  "cozy home vibes",
  "street food culture",
  "retro gaming",
  "wellness routines"
];

export function TrendingTags() {
  const router = useRouter();

  const handleTagClick = (tag: string) => {
    const searchParams = new URLSearchParams({
      q: tag,
      type: 'trending'
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
              animationDuration: `${2 + Math.random() * 2}s`
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
