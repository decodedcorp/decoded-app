'use client';

import React, { useCallback, useEffect, useState, useRef } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { ChannelHero } from '../hero/ChannelHero';
import { MasonryGrid } from '../category-grid/MasonryGrid';
import { AnimatedSection } from './AnimatedSection';
import { AnimatedSpacer } from './AnimatedSpacer';
import { useChannelExpansion } from '../../hooks/useChannelExpansion';

interface ChannelMainContentProps {
  className?: string;
}

export function ChannelMainContent({ className = '' }: ChannelMainContentProps) {
  const { isHeroExpanded, isGridExpanded, handleHeroExpandChange, handleGridExpandChange } =
    useChannelExpansion();

  const [scrollY, setScrollY] = useState(0);
  const [isHeroCollapsed, setIsHeroCollapsed] = useState(false);
  const [isHeroFullyCollapsed, setIsHeroFullyCollapsed] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);

  const handleChannelSelect = useCallback((channelName: string) => {
    console.log('Selected channel:', channelName);
    // TODO: Implement channel selection logic
    // - API calls, routing, state updates, etc.
  }, []);

  // Hero 완전 접기/펼치기 토글
  const toggleHeroFullCollapse = useCallback(() => {
    setIsHeroFullyCollapsed(!isHeroFullyCollapsed);
  }, [isHeroFullyCollapsed]);

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback(() => {
    if (mainContentRef.current) {
      const scrollTop = mainContentRef.current.scrollTop;
      setScrollY(scrollTop);

      // 스크롤이 100px 이상일 때 Hero 섹션 접기 (완전 접힘 상태가 아닐 때만)
      if (scrollTop > 100 && !isHeroCollapsed && !isHeroFullyCollapsed) {
        setIsHeroCollapsed(true);
      } else if (scrollTop <= 100 && isHeroCollapsed && !isHeroFullyCollapsed) {
        setIsHeroCollapsed(false);
      }
    }
  }, [isHeroCollapsed, isHeroFullyCollapsed]);

  // 스크롤 이벤트 리스너 등록
  useEffect(() => {
    const currentRef = mainContentRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
      return () => currentRef.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // 스크롤 위치에 따른 Hero 섹션 스타일 계산
  const getHeroStyles = () => {
    // 완전 접힘 상태일 때
    if (isHeroFullyCollapsed) {
      return {
        height: '60px', // 한 라인이 보이도록 최소 높이 설정
        opacity: 0.8, // 완전히 숨기지 않고 약간 투명하게
        transform: 'scale(0.95)',
        overflow: 'hidden',
        marginBottom: '0px',
      };
    }

    const maxScroll = 120; // 스크롤 거리 더 줄임
    const scrollProgress = Math.min(scrollY / maxScroll, 1);

    // 높이 계산 (더 작은 최대 높이로 조정)
    const minHeight = 80; // 최소 높이를 80px로 증가 (한 라인이 완전히 보이도록)
    const maxHeight = 220; // 최대 높이 더 줄임 (기존 280px → 220px)
    const currentHeight = maxHeight - scrollProgress * (maxHeight - minHeight);

    // 투명도 계산
    const opacity = 1 - scrollProgress * 0.2; // 투명도 변화 줄임

    // 스케일 계산
    const scale = 1 - scrollProgress * 0.03; // 스케일 변화 줄임

    return {
      height: `${currentHeight}px`,
      opacity: opacity,
      transform: `scale(${scale})`,
      overflow: 'hidden',
      marginBottom: `${scrollProgress * 8}px`, // 하단 여백 점진적 감소
    };
  };

  // 스크롤 진행률 계산
  const getScrollProgress = () => {
    const maxScroll = 120;
    return Math.min(scrollY / maxScroll, 1);
  };

  const heroStyles = getHeroStyles();
  const scrollProgress = getScrollProgress();

  return (
    <main className={`bg-black h-full flex flex-col overflow-hidden relative ${className}`}>
      {/* Hero 접기/펼치기 토글 버튼 - 더 명확한 위치와 배경 */}
      <button
        onClick={toggleHeroFullCollapse}
        className="absolute z-30 bg-black bg-opacity-80 hover:bg-opacity-90 text-white p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-xl backdrop-blur-md border border-gray-700"
        style={{
          top: isHeroFullyCollapsed ? '20px' : 'auto',
          bottom: isHeroFullyCollapsed ? 'auto' : '20px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
        title={isHeroFullyCollapsed ? 'Hero 펼치기' : 'Hero 접기'}
      >
        {isHeroFullyCollapsed ? (
          <ChevronDownIcon className="w-5 h-5" />
        ) : (
          <ChevronUpIcon className="w-5 h-5" />
        )}
      </button>

      {/* Hero Section - 스크롤에 따라 높이 조절 */}
      <div
        className="flex-shrink-0 transition-all duration-300 ease-out relative"
        style={heroStyles}
      >
        <AnimatedSection isExpanded={isGridExpanded}>
          <ChannelHero
            onChannelSelect={handleChannelSelect}
            onExpandChange={handleHeroExpandChange}
          />
        </AnimatedSection>
      </div>

      {/* Spacer - 히어로 확장 시 크기 조절 */}
      <AnimatedSpacer isExpanded={isHeroExpanded} />

      {/* Grid Section - Scrollable when content overflows */}
      <div ref={mainContentRef} className="flex-1 overflow-y-auto scroll-smooth">
        <AnimatedSection isExpanded={isHeroExpanded}>
          <MasonryGrid onExpandChange={handleGridExpandChange} />
        </AnimatedSection>
      </div>
    </main>
  );
}
