'use client';

import React from 'react';

import { ContentModal } from '@/domains/channels/components/modal/content/ContentModal';

import { MainFeed } from './MainFeed';

export function MainPage() {
  return (
    <div className="w-full min-h-screen bg-black">
      {/* 메인 콘텐츠 영역 */}
      <div className="w-full min-h-screen">
        <MainFeed />
      </div>

      {/* Content Modal */}
      <ContentModal />
    </div>
  );
}
