'use client';

import React, { useCallback } from 'react';
import { ChannelHero } from './components/hero/ChannelHero';
import { MasonryGrid } from './components/category-grid/MasonryGrid';
import { AnimatedSection } from './components/layout/AnimatedSection';
import { AnimatedSpacer } from './components/layout/AnimatedSpacer';
import { useChannelExpansion } from './hooks/useChannelExpansion';
import { PAGE_LAYOUT_CLASSES } from './constants/layoutConstants';

export default function ChannelPage() {
  const { isHeroExpanded, isGridExpanded, handleHeroExpandChange, handleGridExpandChange } =
    useChannelExpansion();

  const handleChannelSelect = useCallback((channelName: string) => {
    console.log('Selected channel:', channelName);
    // TODO: Implement channel selection logic
    // - API calls, routing, state updates, etc.
  }, []);

  return (
    <div className={PAGE_LAYOUT_CLASSES.container}>
      {/* ChannelHero - Grid expanded 시 크기 조절 */}
      <AnimatedSection isExpanded={isGridExpanded}>
        <ChannelHero
          onChannelSelect={handleChannelSelect}
          onExpandChange={handleHeroExpandChange}
        />
      </AnimatedSection>

      {/* Spacer - 히어로 확장 시 크기 조절 */}
      <AnimatedSpacer isExpanded={isHeroExpanded} />

      {/* MasonryGrid - 히어로 확장 시 크기 조절 */}
      <AnimatedSection isExpanded={isHeroExpanded}>
        <MasonryGrid onExpandChange={handleGridExpandChange} />
      </AnimatedSection>
    </div>
  );
}
