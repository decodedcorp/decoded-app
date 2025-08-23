import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';

import type { SpringOptions } from 'framer-motion';
import { motion, useMotionValue, useSpring } from 'framer-motion';


interface TiltedCardProps {
  imageSrc: React.ComponentProps<'img'>['src'];
  altText?: string;
  captionText?: string;
  containerHeight?: React.CSSProperties['height'];
  containerWidth?: React.CSSProperties['width'];
  imageHeight?: React.CSSProperties['height'];
  imageWidth?: React.CSSProperties['width'];
  scaleOnHover?: number;
  rotateAmplitude?: number;
  showMobileWarning?: boolean;
  showTooltip?: boolean;
  overlayContent?: React.ReactNode;
  displayOverlayContent?: boolean;
  // 픽셀 전환 관련 props
  secondImageSrc?: React.ComponentProps<'img'>['src'];
  secondAltText?: string;
  enablePixelTransition?: boolean;
  pixelTransitionTrigger?: boolean;
  gridSize?: number;
  pixelColor?: string;
  animationStepDuration?: number;
}

const springValues: SpringOptions = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

export default function TiltedCard({
  imageSrc,
  altText = 'Tilted card image',
  captionText = '',
  containerHeight = '300px',
  containerWidth = '100%',
  imageHeight = '300px',
  imageWidth = '300px',
  scaleOnHover = 1.1,
  rotateAmplitude = 14,
  showMobileWarning = true,
  showTooltip = true,
  overlayContent = null,
  displayOverlayContent = false,
  // 픽셀 전환 관련 props
  secondImageSrc,
  secondAltText = 'Second tilted card image',
  enablePixelTransition = false,
  pixelTransitionTrigger = false,
  gridSize = 12,
  pixelColor = '#ffffff',
  animationStepDuration = 0.4,
}: TiltedCardProps) {
  const ref = useRef<HTMLElement>(null);
  const pixelGridRef = useRef<HTMLDivElement | null>(null);
  const secondImageRef = useRef<HTMLImageElement | null>(null);
  const delayedCallRef = useRef<gsap.core.Tween | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1,
  });

  const [lastY, setLastY] = useState(0);
  const [isPixelTransitionActive, setIsPixelTransitionActive] = useState(false);

  // 픽셀 그리드 생성
  useEffect(() => {
    if (!enablePixelTransition || !pixelGridRef.current) return;

    const pixelGridEl = pixelGridRef.current;
    pixelGridEl.innerHTML = '';

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const pixel = document.createElement('div');
        pixel.classList.add('tilted-card__pixel');
        pixel.classList.add('absolute', 'hidden');
        pixel.style.backgroundColor = pixelColor;

        const size = 100 / gridSize;
        pixel.style.width = `${size}%`;
        pixel.style.height = `${size}%`;
        pixel.style.left = `${col * size}%`;
        pixel.style.top = `${row * size}%`;

        pixelGridEl.appendChild(pixel);
      }
    }
  }, [enablePixelTransition, gridSize, pixelColor]);

  // 픽셀 전환 애니메이션
  const animatePixelTransition = (activate: boolean): void => {
    if (!enablePixelTransition) return;

    setIsPixelTransitionActive(activate);

    const pixelGridEl = pixelGridRef.current;
    const secondImageEl = secondImageRef.current;
    if (!pixelGridEl || !secondImageEl) return;

    const pixels = pixelGridEl.querySelectorAll<HTMLDivElement>('.tilted-card__pixel');
    if (!pixels.length) return;

    gsap.killTweensOf(pixels);
    if (delayedCallRef.current) {
      delayedCallRef.current.kill();
    }

    gsap.set(pixels, { display: 'none' });

    const totalPixels = pixels.length;
    const staggerDuration = animationStepDuration / totalPixels;

    gsap.to(pixels, {
      display: 'block',
      duration: 0,
      stagger: {
        each: staggerDuration,
        from: 'random',
      },
    });

    delayedCallRef.current = gsap.delayedCall(animationStepDuration, () => {
      secondImageEl.style.display = activate ? 'block' : 'none';
    });

    gsap.to(pixels, {
      display: 'none',
      duration: 0,
      delay: animationStepDuration,
      stagger: {
        each: staggerDuration,
        from: 'random',
      },
    });
  };

  // 픽셀 전환 트리거 감지
  useEffect(() => {
    if (enablePixelTransition && pixelTransitionTrigger && !isPixelTransitionActive) {
      animatePixelTransition(true);
    }
  }, [pixelTransitionTrigger, enablePixelTransition]);

  function handleMouse(e: React.MouseEvent<HTMLElement>) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rotateX.set(rotationX);
    rotateY.set(rotationY);

    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);

    const velocityY = offsetY - lastY;
    rotateFigcaption.set(-velocityY * 0.6);
    setLastY(offsetY);
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
    opacity.set(1);
  }

  function handleMouseLeave() {
    opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
  }

  return (
    <figure
      ref={ref}
      className="relative w-full h-full [perspective:800px] flex flex-col items-center justify-center"
      style={{
        height: containerHeight,
        width: containerWidth,
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showMobileWarning && (
        <div className="absolute top-4 text-center text-sm block sm:hidden">
          This effect is not optimized for mobile. Check on desktop.
        </div>
      )}

      <motion.div
        className="relative [transform-style:preserve-3d]"
        style={{
          width: imageWidth,
          height: imageHeight,
          rotateX,
          rotateY,
          scale,
        }}
      >
        <motion.img
          src={imageSrc}
          alt={altText}
          className="absolute top-0 left-0 object-cover rounded-[15px] will-change-transform [transform:translateZ(0)]"
          style={{
            width: imageWidth,
            height: imageHeight,
          }}
        />

        {/* 두 번째 이미지 (픽셀 전환용) */}
        {enablePixelTransition && secondImageSrc && (
          <motion.img
            ref={secondImageRef}
            src={secondImageSrc}
            alt={secondAltText}
            className="absolute top-0 left-0 object-cover rounded-[15px] will-change-transform [transform:translateZ(0)]"
            style={{
              width: imageWidth,
              height: imageHeight,
              display: 'none',
            }}
          />
        )}

        {displayOverlayContent && overlayContent && (
          <motion.div className="absolute top-0 left-0 z-[2] will-change-transform [transform:translateZ(30px)]">
            {overlayContent}
          </motion.div>
        )}
      </motion.div>

      {/* 픽셀 그리드 */}
      {enablePixelTransition && (
        <div
          ref={pixelGridRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-[3]"
          style={{
            width: imageWidth,
            height: imageHeight,
          }}
        />
      )}

      {showTooltip && (
        <motion.figcaption
          className="pointer-events-none absolute left-0 top-0 rounded-[4px] bg-white px-[10px] py-[4px] text-[10px] text-[#2d2d2d] opacity-0 z-[3] hidden sm:block"
          style={{
            x,
            y,
            opacity,
            rotate: rotateFigcaption,
          }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  );
}
