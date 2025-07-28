'use client';

import React from 'react';
import styles from './ChannelHero.module.css';
import { useChannelHeroAnimation } from './hooks/useChannelHeroAnimation';
import { BackgroundText } from './components/BackgroundText';
import { MainText } from './components/MainText';
import { KineticType } from './components/KineticType';

export function ChannelHero() {
  const { sectionRef } = useChannelHeroAnimation();

  return (
    <section ref={sectionRef} className="relative h-[60vh] overflow-hidden">
      <div className={styles.backgroundFrame}></div>

      <div className={`${styles.backgroundImage} ${styles.default}`} id="default-bg"></div>
      <div className={`${styles.backgroundImage} ${styles.focus}`} id="focus-bg"></div>
      <div className={`${styles.backgroundImage} ${styles.presence}`} id="presence-bg"></div>
      <div className={`${styles.backgroundImage} ${styles.feel}`} id="feel-bg"></div>

      <div className={styles.bottomGradient}></div>

      <BackgroundText />
      <MainText />
      <KineticType />
    </section>
  );
}
