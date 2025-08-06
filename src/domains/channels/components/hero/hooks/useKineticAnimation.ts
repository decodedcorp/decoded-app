import { useCallback, useRef } from 'react';
import { gsap } from 'gsap';
import styles from '../ChannelHero.module.css';

export function useKineticAnimation() {
  const activeAnimation = useRef<gsap.core.Timeline | null>(null);

  const startKineticAnimation = useCallback((text: string) => {
    // Kill any existing animation
    if (activeAnimation.current) {
      activeAnimation.current.kill();
      activeAnimation.current = null;
    }

    const kineticType = document.getElementById('kinetic-type');
    if (!kineticType) return;

    const typeLines = document.querySelectorAll(`.${styles.typeLine}`);
    const oddLines = document.querySelectorAll(`.${styles.typeLine}.${styles.odd}`);
    const evenLines = document.querySelectorAll(`.${styles.typeLine}.${styles.even}`);

    // Reset state
    gsap.killTweensOf([kineticType, typeLines, oddLines, evenLines]);
    gsap.set(kineticType, {
      display: 'grid',
      scale: 1,
      rotation: 0,
      opacity: 1,
      visibility: 'visible',
    });
    gsap.set(typeLines, {
      opacity: 0.015,
      x: '0%',
    });

    // Set text content
    const repeatedText = `${text} ${text} ${text}`;
    typeLines.forEach((line) => {
      line.textContent = repeatedText;
    });

    // Create animation timeline
    setTimeout(() => {
      const timeline = gsap.timeline({
        onComplete: () => {
          activeAnimation.current = null;
        },
      });

      timeline.to(kineticType, {
        duration: 1.4,
        ease: 'customEase',
        scale: 2.7,
        rotation: -90,
      });

      timeline.to(
        oddLines,
        {
          keyframes: [
            { x: '20%', duration: 1, ease: 'customEase' },
            { x: '-200%', duration: 1.5, ease: 'customEase' },
          ],
          stagger: 0.08,
        },
        0,
      );

      timeline.to(
        evenLines,
        {
          keyframes: [
            { x: '-20%', duration: 1, ease: 'customEase' },
            { x: '200%', duration: 1.5, ease: 'customEase' },
          ],
          stagger: 0.08,
        },
        0,
      );

      timeline.to(
        typeLines,
        {
          keyframes: [
            { opacity: 1, duration: 1, ease: 'customEase' },
            { opacity: 0, duration: 1.5, ease: 'customEase' },
          ],
          stagger: 0.05,
        },
        0,
      );

      activeAnimation.current = timeline;
    }, 20);
  }, []);

  const fadeOutKineticAnimation = useCallback(() => {
    if (activeAnimation.current) {
      activeAnimation.current.kill();
      activeAnimation.current = null;
    }

    const kineticType = document.getElementById('kinetic-type');
    if (!kineticType) return;

    const typeLines = document.querySelectorAll(`.${styles.typeLine}`);

    const fadeOutTimeline = gsap.timeline({
      onComplete: () => {
        gsap.set(kineticType, {
          scale: 1,
          rotation: 0,
          opacity: 1,
        });

        gsap.set(typeLines, {
          opacity: 0.015,
          x: '0%',
        });
      },
    });

    fadeOutTimeline.to(kineticType, {
      opacity: 0,
      scale: 0.8,
      duration: 0.5,
      ease: 'customEase',
    });
  }, []);

  return {
    startKineticAnimation,
    fadeOutKineticAnimation,
  };
}
