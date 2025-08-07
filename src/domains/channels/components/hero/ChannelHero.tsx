'use client';

import React, { useState } from 'react';
import styles from './ChannelHero.module.css';
import { useChannelHeroAnimation } from './hooks/useChannelHeroAnimation';
import { SearchHero } from './components/SearchHero';
import { SimpleHero } from './components/SimpleHero';
import { FlowingQuestions } from './components/FlowingQuestions';
import { TrendingTags } from './components/TrendingTags';

export function ChannelHero() {
  const { sectionRef } = useChannelHeroAnimation();
  const [isSimpleDesign, setIsSimpleDesign] = useState(false);

  const handleToggleDesign = () => {
    setIsSimpleDesign(!isSimpleDesign);
  };

  return (
    <section ref={sectionRef} className="relative h-[60vh] overflow-hidden w-full">
      <div className={styles.backgroundFrame}></div>

      <div className={`${styles.backgroundImage} ${styles.default}`} id="default-bg"></div>
      <div className={`${styles.backgroundImage} ${styles.focus}`} id="focus-bg"></div>
      <div className={`${styles.backgroundImage} ${styles.presence}`} id="presence-bg"></div>
      <div className={`${styles.backgroundImage} ${styles.feel}`} id="feel-bg"></div>

      <div className={styles.bottomGradient}></div>

      {!isSimpleDesign && (
        <>
          <FlowingQuestions />
          <SearchHero onToggleDesign={handleToggleDesign} />
          <TrendingTags />
        </>
      )}

      {isSimpleDesign && <SimpleHero onToggleDesign={handleToggleDesign} />}
    </section>
  );
}
