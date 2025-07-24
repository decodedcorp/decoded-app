'use client';

import React from 'react';
import { Capsule } from './Capsule';

interface MarqueeRowProps {
  capsules: Array<{ name: string; img?: string }>;
  rowIndex: number;
  onCapsuleClick: (channelName: string) => void;
}

export function MarqueeRow({ capsules, rowIndex, onCapsuleClick }: MarqueeRowProps) {
  const isReverse = rowIndex % 2 === 1;
  const animation = isReverse
    ? 'marquee-reverse 48s linear infinite'
    : 'marquee 48s linear infinite';

  const getRandomOffset = (rowIdx: number) => {
    const offsets = [-8, -4, 0, 4, 8];
    return offsets[rowIdx % offsets.length];
  };

  // 캡슐들을 복제하여 무한 스크롤 효과 생성
  const duplicatedCapsules = [...capsules, ...capsules];

  return (
    <div
      className="relative w-full overflow-x-hidden h-[46px]"
      style={{ transform: `translateY(${getRandomOffset(rowIndex)}px)` }}
    >
      <div className="flex flex-nowrap w-max" style={{ animation }}>
        {duplicatedCapsules.map((c, i) => (
          <Capsule
            key={c.name + i + rowIndex}
            name={c.name}
            img={c.img}
            onClick={() => onCapsuleClick(c.name)}
          />
        ))}
      </div>
    </div>
  );
}
