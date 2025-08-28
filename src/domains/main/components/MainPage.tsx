'use client';

import React from 'react';
import { MainFeed } from './MainFeed';
import { ContentModal } from '@/domains/channels/components/modal/content/ContentModal';

export function MainPage() {
  return (
    <div className="w-full min-h-screen bg-black">
      {/* 헤더 높이만큼 상단 여백 */}
      <div
        className="w-full"
        style={{
          paddingTop: 'var(--header-height, 72px)',
        }}
      >
        {/* 메인 콘텐츠 영역 */}
        <div className="w-full min-h-screen">
          <MainFeed />
        </div>
      </div>

      {/* Content Modal */}
      <ContentModal />
    </div>
  );
}
