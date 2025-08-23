'use client';

import React, { useState, useCallback, useMemo } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import styles from './ChannelHero.module.css';
import { useChannelHeroAnimation } from './hooks/useChannelHeroAnimation';
import { SearchHero } from './components/SearchHero';
import { SimpleHero } from './components/SimpleHero';
import { FlowingQuestions } from './components/FlowingQuestions';
import { TrendingTags } from './components/TrendingTags';
import { BackgroundLayers } from './components/BackgroundLayers';
import { HeroDesignMode } from './types';

interface ChannelHeroProps {
  initialDesignMode?: HeroDesignMode;
  onDesignModeChange?: (mode: HeroDesignMode) => void;
  className?: string;
}

export function ChannelHero({ 
  initialDesignMode = 'complex',
  onDesignModeChange,
  className = ''
}: ChannelHeroProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { sectionRef } = useChannelHeroAnimation();
  
  // Get design mode from URL params or use initial value
  const [designMode, setDesignMode] = useState<HeroDesignMode>(() => {
    const urlMode = searchParams.get('hero-mode') as HeroDesignMode;
    return urlMode && ['complex', 'simple'].includes(urlMode) ? urlMode : initialDesignMode;
  });

  // Memoized design mode state
  const isComplexDesign = useMemo(() => designMode === 'complex', [designMode]);

  // Handle design mode toggle with URL sync
  const handleToggleDesign = useCallback(() => {
    const newMode: HeroDesignMode = designMode === 'complex' ? 'simple' : 'complex';
    setDesignMode(newMode);
    
    // Update URL params
    const params = new URLSearchParams(searchParams.toString());
    params.set('hero-mode', newMode);
    router.replace(`?${params.toString()}`, { scroll: false });
    
    // Notify parent component if callback provided
    onDesignModeChange?.(newMode);
  }, [designMode, searchParams, router, onDesignModeChange]);

  // Memoized background layers
  const backgroundLayers = useMemo(() => [
    { id: 'default', className: styles.default },
    { id: 'focus', className: styles.focus },
    { id: 'presence', className: styles.presence },
    { id: 'feel', className: styles.feel }
  ], []);

  return (
    <section 
      ref={sectionRef} 
      className={`relative h-[60vh] overflow-hidden w-full ${className}`}
      role="banner"
      aria-label="Channel discovery hero section"
    >
      {/* Background Elements */}
      <BackgroundLayers layers={backgroundLayers} />
      
      {/* Bottom Gradient Overlay */}
      <div 
        className={styles.bottomGradient}
        aria-hidden="true"
      />

      {/* Content based on design mode */}
      {isComplexDesign ? (
        <ComplexHeroContent onToggleDesign={handleToggleDesign} />
      ) : (
        <SimpleHeroContent onToggleDesign={handleToggleDesign} />
      )}
    </section>
  );
}

// Complex Hero Content Component
function ComplexHeroContent({ onToggleDesign }: { onToggleDesign: () => void }) {
  return (
    <>
      <FlowingQuestions />
      <SearchHero onToggleDesign={onToggleDesign} />
      <TrendingTags />
    </>
  );
}

// Simple Hero Content Component
function SimpleHeroContent({ onToggleDesign }: { onToggleDesign: () => void }) {
  return <SimpleHero onToggleDesign={onToggleDesign} />;
}
