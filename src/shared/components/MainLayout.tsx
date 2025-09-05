'use client';

import { ReactNode } from 'react';
import { Sidebar } from './sidebar/Sidebar';
import { RightSidebar } from '@/domains/main/components/RightSidebar';
import { GlobalContentUploadModal } from '@/domains/channels/components/modal/global-content-upload/GlobalContentUploadModal';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex pt-[72px]">
      {/* 사이드바 - 모바일에서는 오버레이로 표시 */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* 메인 콘텐츠 - 모바일에서는 전체 너비 */}
      <main className="flex-1 w-full lg:ml-0">{children}</main>

      {/* 오른쪽 사이드바 - 데스크톱에서만 표시 */}
      <div className="hidden lg:block w-[320px] flex-shrink-0">
        <RightSidebar />
      </div>

      {/* 모바일 사이드바 - 오버레이로 표시 */}
      <div className="lg:hidden">
        <Sidebar />
      </div>

      {/* Global Content Upload Modal - 전역적으로 렌더링 */}
      <GlobalContentUploadModal />
    </div>
  );
}
