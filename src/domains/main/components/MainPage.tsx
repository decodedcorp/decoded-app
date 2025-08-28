'use client';

import React from 'react';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { MainFeed } from './MainFeed';
import { ContentModal } from '@/domains/channels/components/modal/content/ContentModal';

export function MainPage() {
  return (
    <div className="w-full min-h-screen bg-black">
      {/* 헤더 높이만큼 상단 여백 */}
      <div 
        className="w-full"
        style={{ 
          paddingTop: 'var(--header-height, 72px)' 
        }}
      >
        {/* 메인 그리드 레이아웃 */}
        <div className="
          grid w-full min-h-screen
          grid-cols-1
          md:grid-cols-[240px_1fr]
          lg:grid-cols-[240px_1fr_320px]
          gap-0
        ">
          {/* 왼쪽 사이드바 - 태블릿 이상에서 표시 */}
          <div className="hidden md:block">
            <LeftSidebar />
          </div>
          
          {/* 중앙 메인 피드 */}
          <div className="w-full">
            <MainFeed />
          </div>
          
          {/* 오른쪽 사이드바 - 데스크톱에서만 표시 */}
          <div className="hidden lg:block">
            <RightSidebar />
          </div>
        </div>
      </div>
      
      {/* Content Modal */}
      <ContentModal />
    </div>
  );
}