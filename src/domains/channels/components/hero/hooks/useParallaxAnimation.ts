import { useCallback, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function useParallaxAnimation() {
  const isActive = useRef(false);

  const initializeParallax = useCallback(() => {
    if (isActive.current) return;

    const backgroundElements = [
      ...document.querySelectorAll("[id$='-bg']"),
      ...document.querySelectorAll('.bg-text-container'),
    ];

    if (backgroundElements.length === 0) return;

    // Set parallax speeds for different layers
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

    isActive.current = true;
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isActive.current) return;

    const backgroundElements = document.querySelectorAll('[data-parallax-speed]');
    if (backgroundElements.length === 0) return;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const offsetX = (e.clientX - centerX) / centerX;
    const offsetY = (e.clientY - centerY) / centerY;

    backgroundElements.forEach((el) => {
      const speed = parseFloat(el.getAttribute('data-parallax-speed') || '0');

      // Skip hidden background images
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
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!isActive.current) return;

    const backgroundElements = document.querySelectorAll('[data-parallax-speed]');

    backgroundElements.forEach((el) => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 1.5,
        ease: 'customEase',
      });
    });
  }, []);

  useEffect(() => {
    // Initialize parallax after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initializeParallax();
    }, 100);

    // Add mouse event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);

      // Cleanup animations
      const backgroundElements = document.querySelectorAll('[data-parallax-speed]');
      backgroundElements.forEach((el) => {
        gsap.killTweensOf(el);
      });

      isActive.current = false;
    };
  }, [initializeParallax, handleMouseMove, handleMouseLeave]);

  return {
    isActive: isActive.current,
  };
}
