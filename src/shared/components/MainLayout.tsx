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
      <Sidebar />
      <main className="flex-1 lg:ml-0">{children}</main>
      {/* 오른쪽 사이드바 - 데스크톱에서만 표시 */}
      <div className="hidden lg:block w-[320px] flex-shrink-0">
        <RightSidebar />
      </div>
      
      {/* Global Content Upload Modal - 전역적으로 렌더링 */}
      <GlobalContentUploadModal />
    </div>
  );
}
