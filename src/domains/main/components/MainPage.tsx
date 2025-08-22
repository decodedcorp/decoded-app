'use client';

import React from 'react';
import { SimpleThiingsGrid } from './SimpleThiingsGrid';
import { ChannelModal } from '@/domains/channels/components/modal/channel/ChannelModal';
import { ContentModal } from '@/domains/channels/components/modal/content/ContentModal';
import { ContentSidebar } from '@/domains/channels/components/sidebar/ContentSidebar';
import { useContentSidebarStore } from '@/store/contentSidebarStore';

export function MainPage() {
  const { isOpen: isSidebarOpen, selectedContent, closeSidebar } = useContentSidebarStore();

  // 사이드바 상태 변화 로깅
  React.useEffect(() => {
    console.log('🎯 [MainPage] Sidebar state changed:', {
      isOpen: isSidebarOpen,
      hasContent: !!selectedContent,
      contentId: selectedContent?.id,
      contentTitle: selectedContent?.title,
    });
  }, [isSidebarOpen, selectedContent]);

  return (
    <main className="w-full min-h-screen bg-black">
      <SimpleThiingsGrid />

      {/* 채널 모달 - 카드 클릭 시 열림 */}
      <ChannelModal />

      {/* 콘텐츠 모달 - 콘텐츠 클릭 시 열림 */}
      <ContentModal />

      {/* 콘텐츠 사이드바 - 우측에 표시 */}
      <ContentSidebar isOpen={isSidebarOpen} content={selectedContent} onClose={closeSidebar} />
    </main>
  );
}
