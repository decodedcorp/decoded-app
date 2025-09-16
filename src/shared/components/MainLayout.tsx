'use client';

import { ReactNode, memo } from 'react';

import { RightSidebar } from '@/domains/main/components/RightSidebar';
import { GlobalContentUploadModal } from '@/domains/channels/components/modal/global-content-upload/GlobalContentUploadModal';

import { Sidebar } from './sidebar/Sidebar';

interface MainLayoutProps {
  children: ReactNode;
  maxWidth?: 'default' | 'wide' | 'full';
}

export const MainLayout = memo(function MainLayout({
  children,
  maxWidth = 'default',
}: MainLayoutProps) {
  return (
    <div className="min-h-dvh pt-[var(--header-h)]">
      <div className="grid grid-cols-1 lg:grid-cols-[var(--sidebar-w)_minmax(0,1fr)_var(--sidebar-right-w)]">
        {/* 왼쪽 사이드바 - 데스크톱에서만 표시, 화면 끝에 붙음 */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* 메인 콘텐츠 영역 - 모바일: layout-edge만, 데스크톱: 사이드바 간격 추가 */}
        <div className="layout-edge lg:ml-[var(--main-gap)]">
          <main
            id="main"
            data-role="primary"
            className={`min-w-0 ${
              maxWidth === 'wide' ? 'max-w-8xl' : maxWidth === 'full' ? 'max-w-none' : 'max-w-7xl'
            } ${maxWidth === 'full' ? '' : 'mx-auto'}`}
          >
            {children}
          </main>
        </div>

        {/* 오른쪽 사이드바 - 데스크톱에서만 표시 */}
        <aside
          id="sidebar-right"
          className="hidden lg:block sticky top-[var(--header-h)] h-[calc(100dvh-var(--header-h))] overflow-auto lg:ml-[var(--main-gap)]"
        >
          <RightSidebar />
        </aside>
      </div>

      {/* 모바일 사이드바 - 오버레이로 렌더링 */}
      <div className="lg:hidden">
        <Sidebar />
      </div>

      {/* Global Content Upload Modal - 전역적으로 렌더링 */}
      <GlobalContentUploadModal />
    </div>
  );
});
