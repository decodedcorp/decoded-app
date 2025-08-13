'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ChannelHero } from '../hero/ChannelHero';
import { AnimatedSection } from './AnimatedSection';
import MasonryGrid from '../masonry/MasonryGrid';
import { ChannelModal, ContentModal } from '../modal';
import { AddChannelModal } from '../modal/add-channel/AddChannelModal';

interface ChannelMainContentProps {
  className?: string;
}

export function ChannelMainContent({ className = '' }: ChannelMainContentProps) {
  const [isGridExpanded, setIsGridExpanded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [rowOpacities, setRowOpacities] = useState([1, 1, 1, 1]); // 각 라인의 투명도
  const [rowHeights, setRowHeights] = useState([46, 46, 46, 46]); // 각 라인의 높이
  const mainContentRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback(() => {
    if (!mainContentRef.current) return;

    const currentScrollY = mainContentRef.current.scrollTop;
    setScrollY(currentScrollY);

    // 캡슐 라인 자연스러운 축소 애니메이션
    const maxScrollForHero = 600; // 더 긴 스크롤 거리로 부드러운 전환
    const scrollRatio = Math.max(0, Math.min(1, currentScrollY / maxScrollForHero));

    // 각 라인별로 다른 시작점과 끝점 설정
    const newOpacities = [1, 1, 1, 1];
    const newHeights = [46, 46, 46, 46];

    // 라인 4 (맨 위): 가장 먼저 사라짐
    const line4Start = 0.1;
    const line4End = 0.4;
    if (scrollRatio > line4Start) {
      const line4Ratio = Math.min(1, (scrollRatio - line4Start) / (line4End - line4Start));
      newOpacities[3] = Math.max(0, 1 - line4Ratio);
      newHeights[3] = Math.max(0, 46 * (1 - line4Ratio * 0.8));
    }

    // 라인 3: 두 번째로 사라짐
    const line3Start = 0.2;
    const line3End = 0.6;
    if (scrollRatio > line3Start) {
      const line3Ratio = Math.min(1, (scrollRatio - line3Start) / (line3End - line3Start));
      newOpacities[2] = Math.max(0, 1 - line3Ratio);
      newHeights[2] = Math.max(0, 46 * (1 - line3Ratio * 0.8));
    }

    // 라인 2: 세 번째로 사라짐
    const line2Start = 0.4;
    const line2End = 0.8;
    if (scrollRatio > line2Start) {
      const line2Ratio = Math.min(1, (scrollRatio - line2Start) / (line2End - line2Start));
      newOpacities[1] = Math.max(0, 1 - line2Ratio);
      newHeights[1] = Math.max(0, 46 * (1 - line2Ratio * 0.8));
    }

    // 라인 1 (맨 아래): 마지막까지 유지 (최소 높이만 줄어듦)
    const line1Start = 0.6;
    const line1End = 1.0;
    if (scrollRatio > line1Start) {
      const line1Ratio = Math.min(1, (scrollRatio - line1Start) / (line1End - line1Start));
      newOpacities[0] = Math.max(0.3, 1 - line1Ratio * 0.7); // 최소 투명도 유지
      newHeights[0] = Math.max(20, 46 * (1 - line1Ratio * 0.6)); // 최소 높이 유지
    }

    setRowOpacities(newOpacities);
    setRowHeights(newHeights);
  }, []);

  useEffect(() => {
    const element = mainContentRef.current;
    if (!element) return;

    element.addEventListener('scroll', handleScroll, { passive: true });

    // 초기 상태 설정 (스크롤이 0일 때 모든 라인이 보이도록)
    setRowOpacities([1, 1, 1, 1]);
    setRowHeights([46, 46, 46, 46]);

    return () => element.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Grid 확장/축소 토글
  const toggleGridExpansion = useCallback(() => {
    setIsGridExpanded((prev) => !prev);
  }, []);

  // 안정적인 아이템 클릭 핸들러 (리렌더 방지)
  const handleItemClick = useCallback((item: any) => {
    console.log('Channel clicked:', item);
    // TODO: 채널 모달 열기 또는 라우팅
  }, []);

  // 간단한 테스트 데이터 생성 (나중에 API로 교체)
  const testItems = React.useMemo(() => {
    const categories = ['Business', 'Technology', 'Design', 'Marketing', 'Education'];
    const images = [
      '/images/sususupanova.jpg',
      '/images/karina01.jpg', 
      '/images/karina02.jpeg',
      '/images/karina_profile.webp',
      '/images/73032-1920x1200-desktop-hd-kanye-west-background.jpg',
      '/images/image-proxy.webp',
    ];

    return Array.from({ length: 20 }, (_, i) => ({
      id: `channel-${i + 1}`,
      img: images[i % images.length],
      url: `/channels/channel-${i + 1}`,
      title: `Channel ${i + 1}`,
      category: categories[i % categories.length],
      editors: [
        { name: `Editor ${i + 1}`, avatar: null },
        { name: `Editor ${i + 2}`, avatar: null },
      ],
      width: 300,
      height: 200,
    }));
  }, []);

  return (
    <div ref={mainContentRef} className={`relative h-full overflow-y-auto ${className}`}>
      {/* Hero Section with Scroll Animation */}
      <div ref={heroRef} className="relative z-10 overflow-hidden">
        <ChannelHero />
      </div>

      {/* Grid Section */}
      <AnimatedSection isExpanded={isGridExpanded} className="relative z-5">
        <MasonryGrid items={testItems} onItemClick={handleItemClick} />
      </AnimatedSection>

      {/* Global Channel Modal */}
      <ChannelModal />

      {/* Global Content Modal */}
      <ContentModal />

      {/* Global Add Channel Modal */}
      <AddChannelModal />
    </div>
  );
}
