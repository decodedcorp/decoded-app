'use client';

import { ReactNode, memo } from 'react';
import { usePathname } from 'next/navigation';
import { RightSidebar } from '@/domains/main/components/RightSidebar';

import { Sidebar } from './sidebar/Sidebar';

interface MainLayoutProps {
  children: ReactNode;
  maxWidth?: 'default' | 'wide' | 'full';
}

export const MainLayout = memo(function MainLayout({
  children,
  maxWidth = 'default',
}: MainLayoutProps) {
  const pathname = usePathname();

  // Hide right sidebar on profile pages
  const isProfilePage = pathname.startsWith('/profile');
  return (
    <div className="min-h-dvh">
      {/* 사이드바를 별도로 렌더링 (fixed positioning) */}
      <Sidebar />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr_1fr] pt-[var(--header-h)]">
        {/* 왼쪽 사이드바 공간 확보 - 데스크톱에서만 */}
        <div className="hidden lg:block" />

        {/* 메인 콘텐츠 영역 - 모바일: layout-edge만, 데스크톱: 사이드바 간격 추가 */}
        <div className="px-1 lg:ml-1 lg:mr-1">
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

        {/* 오른쪽 사이드바 공간 확보 - 데스크톱에서만 */}
        <div className="hidden lg:block" />
      </div>

      {/* 오른쪽 사이드바 - 별도로 렌더링 (fixed positioning), 프로필 페이지에서는 숨김 */}
      {!isProfilePage && (
        <aside
          id="sidebar-right"
          className="hidden lg:block fixed top-[60px] md:top-[72px] right-0 w-[260px] h-[calc(100dvh-60px)] md:h-[calc(100dvh-72px)] overflow-auto z-[var(--z-sidebar)]"
        >
          <RightSidebar />
        </aside>
      )}
    </div>
  );
});
