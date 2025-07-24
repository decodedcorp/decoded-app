'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { ExpandedChannel } from './ExpandedChannel';
import { MarqueeRow } from './MarqueeRow';
import { capsules, HERO_CAPSULE_ROWS } from './heroData';
import { marqueeStyles } from './heroStyles';

interface ChannelHeroProps {
  onChannelSelect?: (channelName: string) => void;
  onExpandChange?: (isExpanded: boolean) => void;
}

export function ChannelHero({ onChannelSelect, onExpandChange }: ChannelHeroProps) {
  const [expandedChannel, setExpandedChannel] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // ESC 키로 확장된 상태 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        handleCloseExpanded();
      }
    };

    if (isExpanded) {
      document.addEventListener('keydown', handleKeyDown);
      // 히어로 섹션으로 스크롤
      const heroSection = document.querySelector('[data-hero-section]');
      if (heroSection) {
        heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded]);

  // 확장 상태 변경 시 부모에게 알림
  useEffect(() => {
    onExpandChange?.(isExpanded);
  }, [isExpanded, onExpandChange]);

  const handleCapsuleClick = useCallback(
    (channelName: string) => {
      if (expandedChannel === channelName) {
        // 이미 확장된 채널을 다시 클릭하면 축소
        setExpandedChannel(null);
        setIsExpanded(false);
      } else {
        // 새로운 채널을 클릭하면 확장
        setExpandedChannel(channelName);
        setIsExpanded(true);
        onChannelSelect?.(channelName);
      }
    },
    [expandedChannel, onChannelSelect],
  );

  const handleCloseExpanded = useCallback(() => {
    setExpandedChannel(null);
    setIsExpanded(false);
  }, []);

  // 현재 확장된 채널 정보 가져오기
  const currentChannel = capsules.find((c) => c.name === expandedChannel);

  return (
    <section
      data-hero-section
      className={`
        bg-black w-full relative overflow-x-hidden transition-all duration-700 ease-in-out
        ${isExpanded ? 'py-12 px-4' : 'py-6 px-0'}
      `}
    >
      <style>{marqueeStyles}</style>

      {/* 기본 마퀴 캡슐들 */}
      <div
        className={`
        flex flex-col gap-1 w-full transition-all duration-700
        ${isExpanded ? 'opacity-0 scale-75 max-h-0 overflow-hidden' : 'opacity-100 scale-100'}
      `}
      >
        {HERO_CAPSULE_ROWS.map((rowCapsules, rowIdx) => (
          <MarqueeRow
            key={rowIdx}
            capsules={rowCapsules}
            rowIndex={rowIdx}
            onCapsuleClick={handleCapsuleClick}
            expandedChannel={expandedChannel}
          />
        ))}
      </div>

      {/* 확장된 채널 컨텐츠 */}
      {isExpanded && currentChannel && (
        <ExpandedChannel channel={currentChannel} onClose={handleCloseExpanded} />
      )}
    </section>
  );
}
