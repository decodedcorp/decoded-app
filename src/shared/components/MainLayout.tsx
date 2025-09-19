'use client';

import { ReactNode, memo } from 'react';
import { usePathname } from 'next/navigation';
import { RightSidebar } from '@/domains/main/components/RightSidebar';

import { Sidebar } from './sidebar/Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = memo(function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();

  // Hide right sidebar on profile pages
  const isProfilePage = pathname.startsWith('/profile');

  return (
    <>
      {/* Left sidebar - Fixed position */}
      <aside className="sidebar-left">
        <div className="inner">
          <Sidebar />
        </div>
      </aside>

      {/* Right sidebar - Fixed position */}
      {!isProfilePage && (
        <aside className="sidebar-right">
          <div className="inner">
            <RightSidebar />
          </div>
        </aside>
      )}

      {/* Shell: Header 아래 전체 높이를 정확히 채우고 스크롤은 차단 */}
      <div className="shell">
        {/* 3열 컨테이너 */}
        <div className="cols">
          {/* Main content area - 유일한 스크롤 영역 */}
          <main className="main" id="main-content" data-role="primary">
            {children}
          </main>
        </div>
      </div>
    </>
  );
});
