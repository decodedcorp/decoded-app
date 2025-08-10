import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import styles from '../ChannelHero.module.css';

// Register GSAP plugins
gsap.registerPlugin(CustomEase, SplitText, ScrambleTextPlugin);

export function useChannelHeroAnimation() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!sectionRef.current || isInitialized) return;

    // Create custom ease functions
    CustomEase.create('customEase', '0.86, 0, 0.07, 1');
    CustomEase.create('mouseEase', '0.25, 0.1, 0.25, 1');

    // Wait for fonts to load
    document.fonts.ready.then(() => {
      initializeAnimation();
      setIsInitialized(true);
    });

    function initializeAnimation() {
      const backgroundTextItems = document.querySelectorAll(`.${styles.textItem}`);
      const backgroundImages = {
        default: document.getElementById('default-bg'),
        focus: document.getElementById('focus-bg'),
        presence: document.getElementById('presence-bg'),
        feel: document.getElementById('feel-bg'),
      };

      function switchBackgroundImage(id: string) {
        Object.values(backgroundImages).forEach((bg) => {
          if (bg) {
            gsap.to(bg, {
              opacity: 0,
              duration: 0.8,
              ease: 'customEase',
            });
          }
        });

        if (backgroundImages[id as keyof typeof backgroundImages]) {
          gsap.to(backgroundImages[id as keyof typeof backgroundImages], {
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
      }

      const alternativeTexts = {
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
      };

      backgroundTextItems.forEach((item) => {
        item.setAttribute('data-original-text', item.textContent || '');
        item.setAttribute('data-text', item.textContent || '');
        gsap.set(item, { opacity: 1 });
      });

      const typeLines = document.querySelectorAll(`.${styles.typeLine}`);
      typeLines.forEach((line, index) => {
        if (index % 2 === 0) {
          line.classList.add(styles.odd);
        } else {
          line.classList.add(styles.even);
        }
      });

      const oddLines = document.querySelectorAll(`.${styles.typeLine}.${styles.odd}`);
      const evenLines = document.querySelectorAll(`.${styles.typeLine}.${styles.even}`);
      const TYPE_LINE_OPACITY = 0.015;

      const state = {
        activeRowId: null as string | null,
        kineticAnimationActive: false,
        activeKineticAnimation: null as gsap.core.Timeline | null,
        textRevealAnimation: null as gsap.core.Timeline | null,
        transitionInProgress: false,
      };

      const textRows = document.querySelectorAll(`.${styles.textRow}`);
      const splitTexts: { [key: string]: SplitText } = {};

      textRows.forEach((row, index) => {
        const textElement = row.querySelector(`.${styles.textContent}`) as HTMLElement;
        const text = textElement.getAttribute('data-text') || '';
        const rowId = row.getAttribute('data-row-id') || '';

        splitTexts[rowId] = new SplitText(textElement, {
          type: 'chars' as const,
          charsClass: 'char',
          mask: 'chars' as const,
          reduceWhiteSpace: false,
          propIndex: true,
        });

        textElement.style.visibility = 'visible';
      });

      function updateCharacterWidths() {
        const isMobile = window.innerWidth < 1024;

        textRows.forEach((row, index) => {
          const rowId = row.getAttribute('data-row-id') || '';
          const textElement = row.querySelector(`.${styles.textContent}`) as HTMLElement;
          const computedStyle = window.getComputedStyle(textElement);
          const currentFontSize = computedStyle.fontSize;
          const chars = splitTexts[rowId].chars;

          chars.forEach((char, i) => {
            const charText =
              char.textContent ||
              (char.querySelector('.char-inner')
                ? char.querySelector('.char-inner')?.textContent || ''
                : '');
            if (!charText && i === 0) return;

            let charWidth;

            if (isMobile) {
              const fontSizeValue = parseFloat(currentFontSize);
              const standardCharWidth = fontSizeValue * 0.6;
              charWidth = standardCharWidth;

              if (!char.querySelector('.char-inner') && charText) {
                char.textContent = '';
                const innerSpan = document.createElement('span');
                innerSpan.className = 'char-inner';
                innerSpan.textContent = charText;
                char.appendChild(innerSpan);
                (innerSpan as HTMLElement).style.transform = 'translate3d(0, 0, 0)';
              }

              (char as HTMLElement).style.width = `${charWidth}px`;
              (char as HTMLElement).style.maxWidth = `${charWidth}px`;
              char.setAttribute('data-char-width', charWidth.toString());
              char.setAttribute('data-hover-width', charWidth.toString());
            } else {
              const tempSpan = document.createElement('span');
              tempSpan.style.position = 'absolute';
              tempSpan.style.visibility = 'hidden';
              tempSpan.style.fontSize = currentFontSize;
              tempSpan.style.fontFamily = 'Longsile, sans-serif';
              tempSpan.textContent = charText;
              document.body.appendChild(tempSpan);

              const actualWidth = tempSpan.offsetWidth;
              document.body.removeChild(tempSpan);

              const fontSizeValue = parseFloat(currentFontSize);
              const fontSizeRatio = fontSizeValue / 160;
              const padding = 10 * fontSizeRatio;

              charWidth = Math.max(actualWidth + padding, 30 * fontSizeRatio);

              if (!char.querySelector('.char-inner') && charText) {
                char.textContent = '';
                const innerSpan = document.createElement('span');
                innerSpan.className = 'char-inner';
                innerSpan.textContent = charText;
                char.appendChild(innerSpan);
                (innerSpan as HTMLElement).style.transform = 'translate3d(0, 0, 0)';
              }

              (char as HTMLElement).style.width = `${charWidth}px`;
              (char as HTMLElement).style.maxWidth = `${charWidth}px`;
              char.setAttribute('data-char-width', charWidth.toString());

              const hoverWidth = Math.max(charWidth * 1.8, 85 * fontSizeRatio);
              char.setAttribute('data-hover-width', hoverWidth.toString());
            }

            (char as HTMLElement).style.setProperty('--char-index', i.toString());
          });
        });
      }

      updateCharacterWidths();

      const handleResize = () => {
        clearTimeout((window as any).resizeTimer);
        (window as any).resizeTimer = setTimeout(() => {
          updateCharacterWidths();
        }, 250);
      };

      window.addEventListener('resize', handleResize);

      textRows.forEach((row, rowIndex) => {
        const rowId = row.getAttribute('data-row-id') || '';
        const chars = splitTexts[rowId].chars;

        gsap.set(chars, {
          opacity: 0,
          filter: 'blur(15px)',
        });

        gsap.to(chars, {
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.8,
          stagger: 0.09,
          ease: 'customEase',
          delay: 0.15 * rowIndex,
        });
      });

      function forceResetKineticAnimation() {
        if (state.activeKineticAnimation) {
          state.activeKineticAnimation.kill();
          state.activeKineticAnimation = null;
        }

        const kineticType = document.getElementById('kinetic-type');
        if (kineticType) {
          gsap.killTweensOf([kineticType, typeLines, oddLines, evenLines]);

          gsap.set(kineticType, {
            display: 'grid',
            scale: 1,
            rotation: 0,
            opacity: 1,
            visibility: 'visible',
          });

          gsap.set(typeLines, {
            opacity: TYPE_LINE_OPACITY,
            x: '0%',
          });

          state.kineticAnimationActive = false;
        }
      }

      function startKineticAnimation(text: string) {
        forceResetKineticAnimation();

        const kineticType = document.getElementById('kinetic-type');
        if (!kineticType) return;

        kineticType.style.display = 'grid';
        kineticType.style.opacity = '1';
        kineticType.style.visibility = 'visible';

        const repeatedText = `${text} ${text} ${text}`;

        typeLines.forEach((line) => {
          line.textContent = repeatedText;
        });

        setTimeout(() => {
          const timeline = gsap.timeline({
            onComplete: () => {
              state.kineticAnimationActive = false;
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

          state.kineticAnimationActive = true;
          state.activeKineticAnimation = timeline;
        }, 20);
      }

      function fadeOutKineticAnimation() {
        if (!state.kineticAnimationActive) return;

        if (state.activeKineticAnimation) {
          state.activeKineticAnimation.kill();
          state.activeKineticAnimation = null;
        }

        const kineticType = document.getElementById('kinetic-type');
        if (!kineticType) return;

        const fadeOutTimeline = gsap.timeline({
          onComplete: () => {
            gsap.set(kineticType, {
              scale: 1,
              rotation: 0,
              opacity: 1,
            });

            gsap.set(typeLines, {
              opacity: TYPE_LINE_OPACITY,
              x: '0%',
            });

            state.kineticAnimationActive = false;
          },
        });

        fadeOutTimeline.to(kineticType, {
          opacity: 0,
          scale: 0.8,
          duration: 0.5,
          ease: 'customEase',
        });
      }

      function transitionBetweenRows(fromRow: Element, toRow: Element) {
        if (state.transitionInProgress) return;

        state.transitionInProgress = true;

        const fromRowId = fromRow.getAttribute('data-row-id') || '';
        const toRowId = toRow.getAttribute('data-row-id') || '';

        fromRow.classList.remove(styles.active);
        const fromChars = splitTexts[fromRowId].chars;
        const fromInners = fromRow.querySelectorAll('.char-inner');

        gsap.killTweensOf(fromChars);
        gsap.killTweensOf(fromInners);

        toRow.classList.add(styles.active);
        state.activeRowId = toRowId;

        const toText =
          toRow.querySelector(`.${styles.textContent}`)?.getAttribute('data-text') || '';
        const toChars = splitTexts[toRowId].chars;
        const toInners = toRow.querySelectorAll('.char-inner');

        forceResetKineticAnimation();
        switchBackgroundImage(toRowId);
        startKineticAnimation(toText);

        if (state.textRevealAnimation) {
          state.textRevealAnimation.kill();
        }
        state.textRevealAnimation = createTextRevealAnimation(toRowId);

        gsap.set(fromChars, {
          maxWidth: (i, target) => parseFloat(target.getAttribute('data-char-width') || '0'),
        });

        gsap.set(fromInners, {
          x: 0,
        });

        const timeline = gsap.timeline({
          onComplete: () => {
            state.transitionInProgress = false;
          },
        });

        timeline.to(
          toChars,
          {
            maxWidth: (i, target) => parseFloat(target.getAttribute('data-hover-width') || '0'),
            duration: 0.64,
            stagger: 0.04,
            ease: 'customEase',
          },
          0,
        );

        timeline.to(
          toInners,
          {
            x: -35,
            duration: 0.64,
            stagger: 0.04,
            ease: 'customEase',
          },
          0.05,
        );
      }

      function createTextRevealAnimation(rowId: string) {
        const timeline = gsap.timeline();

        timeline.to(backgroundTextItems, {
          opacity: 0.3,
          duration: 0.5,
          ease: 'customEase',
        });

        timeline.call(() => {
          backgroundTextItems.forEach((item) => {
            item.classList.add(styles.highlight);
          });
        });

        timeline.call(
          () => {
            backgroundTextItems.forEach((item) => {
              const originalText = item.getAttribute('data-text');
              if (
                alternativeTexts[rowId as keyof typeof alternativeTexts] &&
                alternativeTexts[rowId as keyof typeof alternativeTexts][
                  originalText as keyof (typeof alternativeTexts)[keyof typeof alternativeTexts]
                ]
              ) {
                item.textContent =
                  alternativeTexts[rowId as keyof typeof alternativeTexts][
                    originalText as keyof (typeof alternativeTexts)[keyof typeof alternativeTexts]
                  ];
              }
            });
          },
          undefined,
          '+=0.5',
        );

        timeline.call(() => {
          backgroundTextItems.forEach((item) => {
            item.classList.remove(styles.highlight);
            item.classList.add(styles.highlightReverse);
          });
        });

        timeline.call(
          () => {
            backgroundTextItems.forEach((item) => {
              item.classList.remove(styles.highlightReverse);
            });
          },
          undefined,
          '+=0.5',
        );

        return timeline;
      }

      function resetBackgroundTextWithAnimation() {
        const timeline = gsap.timeline();

        timeline.call(() => {
          backgroundTextItems.forEach((item) => {
            item.classList.add(styles.highlight);
          });
        });

        timeline.call(
          () => {
            backgroundTextItems.forEach((item) => {
              item.textContent = item.getAttribute('data-original-text');
            });
          },
          undefined,
          '+=0.5',
        );

        timeline.call(() => {
          backgroundTextItems.forEach((item) => {
            item.classList.remove(styles.highlight);
            item.classList.add(styles.highlightReverse);
          });
        });

        timeline.call(
          () => {
            backgroundTextItems.forEach((item) => {
              item.classList.remove(styles.highlightReverse);
            });
          },
          undefined,
          '+=0.5',
        );

        timeline.to(backgroundTextItems, {
          opacity: 1,
          duration: 0.5,
          ease: 'customEase',
        });

        return timeline;
      }

      function activateRow(row: Element) {
        const rowId = row.getAttribute('data-row-id') || '';

        if (state.activeRowId === rowId) return;
        if (state.transitionInProgress) return;

        const activeRow = document.querySelector(`.${styles.textRow}.${styles.active}`);

        if (activeRow) {
          transitionBetweenRows(activeRow, row);
        } else {
          row.classList.add(styles.active);
          state.activeRowId = rowId;

          const text = row.querySelector(`.${styles.textContent}`)?.getAttribute('data-text') || '';
          const chars = splitTexts[rowId].chars;
          const innerSpans = row.querySelectorAll('.char-inner');

          switchBackgroundImage(rowId);
          startKineticAnimation(text);

          if (state.textRevealAnimation) {
            state.textRevealAnimation.kill();
          }
          state.textRevealAnimation = createTextRevealAnimation(rowId);

          const timeline = gsap.timeline();

          timeline.to(
            chars,
            {
              maxWidth: (i, target) => parseFloat(target.getAttribute('data-hover-width') || '0'),
              duration: 0.64,
              stagger: 0.04,
              ease: 'customEase',
            },
            0,
          );

          timeline.to(
            innerSpans,
            {
              x: -35,
              duration: 0.64,
              stagger: 0.04,
              ease: 'customEase',
            },
            0.05,
          );
        }
      }

      function deactivateRow(row: Element) {
        const rowId = row.getAttribute('data-row-id') || '';

        if (state.activeRowId !== rowId) return;
        if (state.transitionInProgress) return;

        state.activeRowId = null;
        row.classList.remove(styles.active);

        switchBackgroundImage('default');
        fadeOutKineticAnimation();

        if (state.textRevealAnimation) {
          state.textRevealAnimation.kill();
        }
        state.textRevealAnimation = resetBackgroundTextWithAnimation();

        const chars = splitTexts[rowId].chars;
        const innerSpans = row.querySelectorAll('.char-inner');

        const timeline = gsap.timeline();

        timeline.to(
          innerSpans,
          {
            x: 0,
            duration: 0.64,
            stagger: 0.03,
            ease: 'customEase',
          },
          0,
        );

        timeline.to(
          chars,
          {
            maxWidth: (i, target) => parseFloat(target.getAttribute('data-char-width') || '0'),
            duration: 0.64,
            stagger: 0.03,
            ease: 'customEase',
          },
          0.05,
        );
      }

      function initializeParallax() {
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
      }

      textRows.forEach((row) => {
        const interactiveArea = row.querySelector(`.${styles.interactiveArea}`);

        if (interactiveArea) {
          interactiveArea.addEventListener('mouseenter', () => {
            activateRow(row);
          });

          interactiveArea.addEventListener('mouseleave', () => {
            if (state.activeRowId === row.getAttribute('data-row-id')) {
              deactivateRow(row);
            }
          });

          row.addEventListener('click', () => {
            activateRow(row);
          });
        }
      });

      // Add global test function
      (window as any).testKineticAnimation = function (rowId: string) {
        const row = document.querySelector(`.${styles.textRow}[data-row-id="${rowId}"]`);
        if (row) {
          activateRow(row);
          setTimeout(() => {
            deactivateRow(row);
          }, 3000);
        }
      };

      function scrambleRandomText() {
        // Check if backgroundTextItems exists and has elements
        if (!backgroundTextItems || backgroundTextItems.length === 0) {
          // If no elements found, try again later
          setTimeout(scrambleRandomText, 2000);
          return;
        }

        const randomIndex = Math.floor(Math.random() * backgroundTextItems.length);
        const randomItem = backgroundTextItems[randomIndex];

        // Check if the selected item exists and is valid
        if (!randomItem || !randomItem.getAttribute) {
          // If invalid item, try again later
          setTimeout(scrambleRandomText, 2000);
          return;
        }

        const originalText = randomItem.getAttribute('data-text') || '';

        // Only proceed if we have valid text
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
      }

      setTimeout(scrambleRandomText, 1000);

      const simplicity = document.querySelector(`.${styles.textItem}[data-text="IS THE KEY"]`);
      if (simplicity) {
        const splitSimplicity = new SplitText(simplicity, {
          type: 'chars',
          charsClass: 'simplicity-char',
        });

        gsap.from(splitSimplicity.chars, {
          opacity: 0,
          scale: 0.5,
          duration: 1,
          stagger: 0.015,
          ease: 'customEase',
          delay: 1,
        });
      }

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

      initializeParallax();

      // Add CSS rules for kinetic type
      const style = document.createElement('style');
      style.textContent = `
        #kinetic-type {
          z-index: 200 !important;
          display: grid !important;
          visibility: visible !important;
          opacity: 1;
          pointer-events: none;
        }
      `;
      document.head.appendChild(style);
    }

    // Cleanup function
    return () => {
      // Kill all GSAP animations
      gsap.killTweensOf('*');
    };
  }, [isInitialized]);

  return { sectionRef };
}
