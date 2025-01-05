'use client';

import { cn } from '@/lib/utils/style';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Box {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
}

export function GridBackground() {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const newBoxes: Box[] = [];
    const numBoxes = 10;

    // 박스 크기 범위 설정
    const sizes = {
      small: { min: 60, max: 80 }, // 작은 박스
      medium: { min: 90, max: 120 }, // 중간 박스
      large: { min: 300, max: 400 }, // 큰 박스
    };

    for (let i = 0; i < numBoxes; i++) {
      // 랜덤하게 박스 크기 타입 선택
      const sizeType =
        Math.random() < 0.3
          ? 'large'
          : Math.random() < 0.6
          ? 'medium'
          : 'small';

      const sizeRange = sizes[sizeType];
      const size =
        Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min;

      // 화면 가장자리에 치우치지 않도록 위치 조정
      const margin = size / 2; // 박스 크기에 따른 여백
      const x = Math.random() * (80 - margin * 2) + margin;
      const y = Math.random() * (80 - margin * 2) + margin;

      newBoxes.push({
        id: i,
        x,
        y,
        size,
        rotation: Math.random() * 20 - 10, // -10도 ~ 10도 회전
      });
    }

    setBoxes(newBoxes);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* 기본 그리드 배경 */}
      <div
        className={cn(
          'absolute inset-0',
          'bg-[linear-gradient(to_right,#232323_1px,transparent_1px),linear-gradient(to_bottom,#232323_1px,transparent_1px)]',
          'bg-[size:4rem_4rem]',
          '[mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000,transparent)]'
        )}
      />

      {/* 전기 효과를 위한 그리드 오버레이 */}
      {hoveredId !== null && (
        <div
          className={cn(
            'absolute inset-0 z-[1]', // z-index 추가
            'pointer-events-none', // 마우스 이벤트 방지
            'bg-[linear-gradient(to_right,#EAFD6630_1px,transparent_1px),linear-gradient(to_bottom,#EAFD6630_1px,transparent_1px)]',
            'bg-[size:4rem_4rem]',
            'transition-opacity duration-300',
            'animate-grid-flash'
          )}
          style={{
            maskImage: `radial-gradient(circle 20rem at ${mousePos.x}px ${mousePos.y}px, black, transparent)`,
            WebkitMaskImage: `radial-gradient(circle 20rem at ${mousePos.x}px ${mousePos.y}px, black, transparent)`,
          }}
        />
      )}

      {/* 랜덤 박스들 */}
      {boxes.map((box) => (
        <motion.div
          key={box.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.7,
            delay: box.id * 0.1,
            ease: 'easeOut',
          }}
          style={{
            left: `${box.x}%`,
            top: `${box.y}%`,
            width: box.size,
            height: box.size,
            transform: `translate(-50%, -50%) rotate(${box.rotation}deg)`,
          }}
          className={cn(
            'absolute',
            'rounded-2xl',
            'bg-zinc-900/50 backdrop-blur-sm',
            'cursor-pointer',
            'transition-all duration-300',
            hoveredId === box.id && 'z-10'
          )}
          onMouseEnter={() => setHoveredId(box.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          {/* 네온 테두리 효과 */}
          <div
            className={cn(
              'absolute inset-0 rounded-2xl',
              'transition-all duration-300',
              hoveredId === box.id
                ? [
                    'border-[1px] border-[#EAFD66]',
                    'shadow-[0_0_10px_#EAFD66,inset_0_0_10px_#EAFD66]',
                    'animate-pulse-subtle',
                  ]
                : 'border border-zinc-800/50'
            )}
          />

          {/* 물음표 아이콘 */}
          <div
            className={cn(
              'absolute inset-0',
              'flex items-center justify-center',
              'transition-all duration-300',
              hoveredId === box.id
                ? ['text-[#EAFD66]', 'text-shadow-neon', 'animate-pulse-subtle']
                : 'text-zinc-700',
              // 박스 크기에 따른 물음표 크기 조정
              box.size < 90
                ? 'text-xl'
                : box.size < 140
                ? 'text-2xl'
                : 'text-3xl',
              'font-bold'
            )}
          >
            ?
          </div>
        </motion.div>
      ))}
    </div>
  );
}
