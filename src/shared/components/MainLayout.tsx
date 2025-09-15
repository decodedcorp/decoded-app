'use client';

import { ReactNode, memo } from 'react';

import { RightSidebar } from '@/domains/main/components/RightSidebar';
import { GlobalContentUploadModal } from '@/domains/channels/components/modal/global-content-upload/GlobalContentUploadModal';

import { Sidebar } from './sidebar/Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = memo(function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex pt-[60px] md:pt-[72px] overflow-visible">
      {/* 사이드바 - 데스크톱과 모바일에서 모두 렌더링하되 CSS로 제어 */}
      <Sidebar />

      {/* Reddit-style centered container - wider for better content display */}
      <div className="flex-1 min-w-0 flex justify-center">
        <div className="w-full max-w-7xl flex">
          {/* 메인 콘텐츠 - Reddit 스타일 최대 너비 제한 */}
          <main className="flex-1 min-w-0 page-x-spacing">{children}</main>

          {/* 오른쪽 사이드바 - 데스크톱에서만 표시 */}
          <div className="hidden lg:block w-[280px] flex-shrink-0">
            <RightSidebar />
          </div>
        </div>
      </div>

      {/* Global Content Upload Modal - 전역적으로 렌더링 */}
      <GlobalContentUploadModal />
    </div>
  );
});
