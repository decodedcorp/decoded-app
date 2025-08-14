'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ChannelHero } from '../hero/ChannelHero';
import { AnimatedSection } from './AnimatedSection';
import MasonryGrid from '../masonry/MasonryGrid';
import { ChannelModal, ContentModal } from '../modal';
import { AddChannelModal } from '../modal/add-channel/AddChannelModal';
import { useChannels } from '../../hooks/useChannels';
import { mapChannelsToItems } from '../../utils/channelMapper';
import { Item } from '../masonry/types';
import { useChannelModalStore } from '../../../../store/channelModalStore';
import { ChannelResponse } from '../../../../api/generated/models/ChannelResponse';

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

  // 채널 모달 스토어
  const openChannelModal = useChannelModalStore((state) => state.openModal);

  // 채널 데이터 가져오기
  const {
    data: channelsData,
    isLoading,
    error,
  } = useChannels({
    limit: 50, // 더 많은 채널 로드
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  // API 데이터를 Item 타입으로 변환
  const channelItems: Item[] = React.useMemo(() => {
    if (!channelsData?.channels) return [];
    return mapChannelsToItems(channelsData.channels);
  }, [channelsData]);

  // 원본 채널 데이터를 저장 (모달에서 사용)
  const originalChannels = React.useMemo(() => {
    return channelsData?.channels || [];
  }, [channelsData]);

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
  const handleItemClick = useCallback(
    (item: Item) => {
      console.log('Channel clicked:', item);

      // 원본 채널 데이터 찾기
      const originalChannel = originalChannels.find((channel) => channel.id === item.id);
      if (originalChannel) {
        // 모달 열기
        openChannelModal(originalChannel);
      }
    },
    [originalChannels, openChannelModal],
  );

  // 로딩 상태 렌더링
  if (isLoading) {
    return (
      <div className={`relative h-full overflow-y-auto ${className}`}>
        <div className="h-full flex items-center justify-center">
          <div className="text-white text-lg">Loading channels...</div>
        </div>
      </div>
    );
  }

  // 에러 상태 렌더링
  if (error) {
    return (
      <div className={`relative h-full overflow-y-auto ${className}`}>
        <div className="h-full flex items-center justify-center">
          <div className="text-red-500 text-lg">Failed to load channels. Please try again.</div>
        </div>
      </div>
    );
  }

  // 채널이 없는 경우
  if (!channelItems.length) {
    return (
      <div className={`relative h-full overflow-y-auto ${className}`}>
        <div className="h-full flex items-center justify-center">
          <div className="text-gray-400 text-lg">No channels found.</div>
        </div>
      </div>
    );
  }

  return (
    <div ref={mainContentRef} className={`relative h-full overflow-y-auto ${className}`}>
      {/* Hero Section with Scroll Animation */}
      <div ref={heroRef} className="relative z-10 overflow-hidden">
        <ChannelHero />
      </div>

      {/* Grid Section */}
      <AnimatedSection isExpanded={isGridExpanded} className="relative z-5">
        <MasonryGrid items={channelItems} onItemClick={handleItemClick} />
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
