'use client';

import { ReactNode, memo } from 'react';
import { usePathname } from 'next/navigation';
import { RightSidebar } from '@/domains/main/components/RightSidebar';
import { GlobalContentUploadModal } from '@/domains/channels/components/modal/global-content-upload/GlobalContentUploadModal';

import { Sidebar } from './sidebar/Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = memo(function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  
  // Hide right sidebar on profile pages
  const isProfilePage = pathname.startsWith('/profile');

  return (
    <div className="flex pt-[72px] overflow-hidden">
      {/* 사이드바 - 데스크톱과 모바일에서 모두 렌더링하되 CSS로 제어 */}
      <Sidebar />

      {/* 메인 콘텐츠 - 모바일에서는 전체 너비 */}
      <main className="flex-1 min-w-0 lg:ml-0">{children}</main>

      {/* 오른쪽 사이드바 - 데스크톱에서만 표시, 프로필 페이지에서는 숨김 */}
      {!isProfilePage && (
        <div className="hidden lg:block w-[320px] flex-shrink-0">
          <RightSidebar />
        </div>
      )}

      {/* Global Content Upload Modal - 전역적으로 렌더링 */}
      <GlobalContentUploadModal />
    </div>
  );
});
