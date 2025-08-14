import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import styles from '../ChannelHero.module.css';

// Register GSAP plugins
gsap.registerPlugin(CustomEase, SplitText, ScrambleTextPlugin);

// Types for better type safety
interface BackgroundImages {
  default: HTMLElement | null;
  focus: HTMLElement | null;
  presence: HTMLElement | null;
  feel: HTMLElement | null;
}

interface AnimationState {
  activeRowId: string | null;
  kineticAnimationActive: boolean;
  activeKineticAnimation: gsap.core.Timeline | null;
  textRevealAnimation: gsap.core.Timeline | null;
  transitionInProgress: boolean;
}

interface AlternativeTexts {
  [key: string]: {
    [key: string]: string;
  };
}

export function useChannelHeroAnimation() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Memoized custom ease functions
  const customEases = useMemo(() => ({
    customEase: '0.86, 0, 0.07, 1',
    mouseEase: '0.25, 0.1, 0.25, 1'
  }), []);

  // Memoized alternative texts
  const alternativeTexts: AlternativeTexts = useMemo(() => ({
    focus: {
      BE: 'BECOME',
      PRESENT: 'MINDFUL',
      LISTEN: 'HEAR',
      DEEPLY: 'INTENTLY',
      OBSERVE: 'NOTICE',
      '&': '+',
      FEEL: 'SENSE',
      MAKE: 'CREATE',
      BETTER: 'IMPROVED',
      DECISIONS: 'CHOICES',
      THE: 'YOUR',
      CREATIVE: 'ARTISTIC',
      PROCESS: 'JOURNEY',
      IS: 'FEELS',
      MYSTERIOUS: 'MAGICAL',
      S: 'START',
      I: 'INSPIRE',
      M: 'MAKE',
      P: 'PURE',
      L: 'LIGHT',
      C: 'CREATE',
      T: 'TRANSFORM',
      Y: 'YOURS',
      'IS THE KEY': 'UNLOCKS ALL',
      'FIND YOUR VOICE': 'SPEAK YOUR TRUTH',
      'TRUST INTUITION': 'FOLLOW INSTINCT',
      'EMBRACE SILENCE': 'WELCOME STILLNESS',
      'QUESTION EVERYTHING': 'CHALLENGE NORMS',
      TRUTH: 'HONESTY',
      WISDOM: 'INSIGHT',
      FOCUS: 'CONCENTRATE',
      ATTENTION: 'AWARENESS',
      AWARENESS: 'CONSCIOUSNESS',
      PRESENCE: 'BEING',
      SIMPLIFY: 'MINIMIZE',
      REFINE: 'PERFECT',
    },
    presence: {
      BE: 'EVOLVE',
      PRESENT: 'ENGAGED',
      LISTEN: 'ABSORB',
      DEEPLY: 'FULLY',
      OBSERVE: 'ANALYZE',
      '&': '→',
      FEEL: 'EXPERIENCE',
      MAKE: 'BUILD',
      BETTER: 'STRONGER',
      DECISIONS: 'SYSTEMS',
      THE: 'EACH',
      CREATIVE: 'ITERATIVE',
      PROCESS: 'METHOD',
      IS: 'BECOMES',
      MYSTERIOUS: 'REVEALING',
      S: 'STRUCTURE',
      I: 'ITERATE',
      M: 'METHOD',
      P: 'PRACTICE',
      L: 'LEARN',
      C: 'CONSTRUCT',
      T: 'TECHNIQUE',
      Y: 'YIELD',
      'IS THE KEY': 'DRIVES SUCCESS',
      'FIND YOUR VOICE': 'DEVELOP YOUR STYLE',
      'TRUST INTUITION': 'FOLLOW THE FLOW',
      'EMBRACE SILENCE': 'VALUE PAUSES',
      'QUESTION EVERYTHING': 'EXAMINE DETAILS',
      TRUTH: 'CLARITY',
      WISDOM: 'KNOWLEDGE',
      FOCUS: 'DIRECTION',
      ATTENTION: 'PRECISION',
      AWARENESS: 'UNDERSTANDING',
      PRESENCE: 'ENGAGEMENT',
      SIMPLIFY: 'STREAMLINE',
      REFINE: 'OPTIMIZE',
    },
    feel: {
      BE: 'SEE',
      PRESENT: 'FOCUSED',
      LISTEN: 'UNDERSTAND',
      DEEPLY: 'CLEARLY',
      OBSERVE: 'PERCEIVE',
      '&': '=',
      FEEL: 'KNOW',
      MAKE: 'ACHIEVE',
      BETTER: 'CLEARER',
      DECISIONS: 'VISION',
      THE: 'THIS',
      CREATIVE: 'INSIGHTFUL',
      PROCESS: 'THINKING',
      IS: 'BRINGS',
      MYSTERIOUS: 'ILLUMINATING',
      S: 'SHARP',
      I: 'INSIGHT',
      M: 'MINDFUL',
      P: 'PRECISE',
      L: 'LUCID',
      C: 'CLEAR',
      T: 'TRANSPARENT',
      Y: 'YES',
      'IS THE KEY': 'REVEALS TRUTH',
      'FIND YOUR VOICE': 'DISCOVER YOUR VISION',
      'TRUST INTUITION': 'BELIEVE YOUR EYES',
      'EMBRACE SILENCE': 'SEEK STILLNESS',
      'QUESTION EVERYTHING': 'CLARIFY ASSUMPTIONS',
      TRUTH: 'REALITY',
      WISDOM: 'PERCEPTION',
      FOCUS: 'CLARITY',
      ATTENTION: 'OBSERVATION',
      AWARENESS: 'RECOGNITION',
      PRESENCE: 'ALERTNESS',
      SIMPLIFY: 'DISTILL',
      REFINE: 'SHARPEN',
    },
  }), []);

  // Initialize custom ease functions
  const initializeCustomEases = useCallback(() => {
    CustomEase.create('customEase', customEases.customEase);
    CustomEase.create('mouseEase', customEases.mouseEase);
  }, [customEases]);

  // Get background images
  const getBackgroundImages = useCallback((): BackgroundImages => ({
    default: document.getElementById('default-bg'),
    focus: document.getElementById('focus-bg'),
    presence: document.getElementById('presence-bg'),
    feel: document.getElementById('feel-bg'),
  }), []);

  // Switch background image with animation
  const switchBackgroundImage = useCallback((id: string, backgroundImages: BackgroundImages) => {
    Object.values(backgroundImages).forEach((bg) => {
      if (bg) {
        gsap.to(bg, {
          opacity: 0,
          duration: 0.8,
          ease: 'customEase',
        });
      }
    });

    const targetBg = backgroundImages[id as keyof BackgroundImages];
    if (targetBg) {
      gsap.to(targetBg, {
        opacity: 1,
        duration: 0.8,
        ease: 'customEase',
        delay: 0.2,
      });
    } else {
      gsap.to(backgroundImages.default, {
        opacity: 1,
        duration: 0.8,
        ease: 'customEase',
        delay: 0.2,
      });
    }
  }, []);

  // Initialize animation
  const initializeAnimation = useCallback(() => {
    if (!sectionRef.current) return;

    const backgroundTextItems = document.querySelectorAll(`.${styles.textItem}`);
    const backgroundImages = getBackgroundImages();

    // Initialize background text items
    backgroundTextItems.forEach((item) => {
      item.setAttribute('data-original-text', item.textContent || '');
      item.setAttribute('data-text', item.textContent || '');
      gsap.set(item, { opacity: 1 });
    });

    // Initialize type lines
    const typeLines = document.querySelectorAll(`.${styles.typeLine}`);
    typeLines.forEach((line, index) => {
      if (index % 2 === 0) {
        line.classList.add(styles.odd);
      } else {
        line.classList.add(styles.even);
      }
    });

    // Initialize parallax
    initializeParallax();

    // Initialize text animations
    initializeTextAnimations(backgroundTextItems);

    // Initialize random text scrambling
    setTimeout(() => {
      initializeRandomTextScrambling(backgroundTextItems);
    }, 1000);

  }, [getBackgroundImages]);

  // Initialize parallax effects
  const initializeParallax = useCallback(() => {
    const container = document.querySelector('body');
    const backgroundElements = [
      ...document.querySelectorAll("[id$='-bg']"),
      ...document.querySelectorAll('.bg-text-container'),
    ];

    const parallaxLayers = [0.02, 0.03, 0.04, 0.05];
    backgroundElements.forEach((el, index) => {
      el.setAttribute(
        'data-parallax-speed',
        parallaxLayers[index % parallaxLayers.length].toString(),
      );

      gsap.set(el, {
        transformOrigin: 'center center',
        force3D: true,
      });
    });

    let lastParallaxTime = 0;
    const throttleParallax = 20;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastParallaxTime < throttleParallax) return;
      lastParallaxTime = now;

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const offsetX = (e.clientX - centerX) / centerX;
      const offsetY = (e.clientY - centerY) / centerY;

      backgroundElements.forEach((el) => {
        const speed = parseFloat(el.getAttribute('data-parallax-speed') || '0');

        if (el.id && el.id.endsWith('-bg') && (el as HTMLElement).style.opacity === '0') {
          return;
        }

        const moveX = offsetX * 100 * speed;
        const moveY = offsetY * 50 * speed;

        gsap.to(el, {
          x: moveX,
          y: moveY,
          duration: 1.0,
          ease: 'mouseEase',
          overwrite: 'auto',
        });
      });
    };

    const handleMouseLeave = () => {
      backgroundElements.forEach((el) => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 1.5,
          ease: 'customEase',
        });
      });
    };

    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    // Add floating animation
    backgroundElements.forEach((el, index) => {
      const delay = index * 0.2;
      const floatAmount = 5 + (index % 3) * 2;

      gsap.to(el, {
        y: `+=${floatAmount}`,
        duration: 3 + (index % 2),
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: delay,
      });
    });
  }, []);

  // Initialize text animations
  const initializeTextAnimations = useCallback((backgroundTextItems: NodeListOf<Element>) => {
    backgroundTextItems.forEach((item, index) => {
      const delay = index * 0.1;
      gsap.to(item, {
        opacity: 0.85,
        duration: 2 + (index % 3),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: delay,
      });
    });
  }, []);

  // Initialize random text scrambling
  const initializeRandomTextScrambling = useCallback((backgroundTextItems: NodeListOf<Element>) => {
    const scrambleRandomText = () => {
      if (!backgroundTextItems || backgroundTextItems.length === 0) {
        setTimeout(scrambleRandomText, 2000);
        return;
      }

      const randomIndex = Math.floor(Math.random() * backgroundTextItems.length);
      const randomItem = backgroundTextItems[randomIndex];

      if (!randomItem || !randomItem.getAttribute) {
        setTimeout(scrambleRandomText, 2000);
        return;
      }

      const originalText = randomItem.getAttribute('data-text') || '';

      if (!originalText) {
        setTimeout(scrambleRandomText, 2000);
        return;
      }

      gsap.to(randomItem, {
        duration: 1,
        scrambleText: {
          text: originalText,
          chars: '■▪▌▐▬',
          revealDelay: 0.5,
          speed: 0.3,
        },
        ease: 'none',
      });

      const delay = 0.5 + Math.random() * 2;
      setTimeout(scrambleRandomText, delay * 1000);
    };

    scrambleRandomText();
  }, []);

  useEffect(() => {
    if (!sectionRef.current || isInitialized) return;

    // Initialize custom ease functions
    initializeCustomEases();

    // Wait for fonts to load
    document.fonts.ready.then(() => {
      initializeAnimation();
      setIsInitialized(true);
    });

    // Cleanup function
    return () => {
      // Kill all GSAP animations
      gsap.killTweensOf('*');
    };
  }, [isInitialized, initializeCustomEases, initializeAnimation]);

  return { sectionRef };
}
