'use client';

import React, { useCallback } from 'react';
import { useChannelModalStore } from '@/store/channelModalStore';
import { MarqueeRow } from './MarqueeRow';
import { capsules, HERO_CAPSULE_ROWS } from './heroData';

interface ChannelHeroProps {
  onChannelSelect?: (channelName: string) => void;
  rowOpacities?: number[];
  rowHeights?: number[];
}

export function ChannelHero({
  onChannelSelect,
  rowOpacities = [1, 1, 1, 1],
  rowHeights = [46, 46, 46, 46],
}: ChannelHeroProps) {
  const openModal = useChannelModalStore((state) => state.openModal);

  const handleChannelClick = useCallback(
    (channelName: string) => {
      // Hero에서 채널 클릭 시 해당 채널 데이터 찾기
      const channel = capsules.find((cap) => cap.name === channelName);
      if (channel) {
        openModal(channel);
      }

      // 기존 콜백도 호출
      if (onChannelSelect) {
        onChannelSelect(channelName);
      }
    },
    [openModal, onChannelSelect],
  );

  return (
    <section data-hero-section className="bg-black w-full relative overflow-x-hidden py-6 px-0">
      {/* 마퀴 캡슐들 */}
      <div className="flex flex-col gap-1 w-full">
        {HERO_CAPSULE_ROWS.map((rowCapsules, rowIdx) => (
          <div
            key={rowIdx}
            style={{
              opacity: rowOpacities[rowIdx] || 1,
              height: `${rowHeights[rowIdx] || 46}px`,
              overflow: 'hidden',
              transition: 'opacity 0.2s ease-out, height 0.2s ease-out',
            }}
          >
            <MarqueeRow
              capsules={rowCapsules}
              rowIndex={rowIdx}
              onCapsuleClick={handleChannelClick}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
