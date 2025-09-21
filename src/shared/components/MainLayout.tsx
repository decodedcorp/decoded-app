'use client';

import { ReactNode, memo, lazy, Suspense } from 'react';
import { usePathname } from 'next/navigation';

// Lazy load sidebars for better performance
const RightSidebar = lazy(() =>
  import('@/domains/main/components/RightSidebar').then((module) => ({
    default: module.RightSidebar,
  })),
);
const Sidebar = lazy(() =>
  import('./sidebar/Sidebar').then((module) => ({ default: module.Sidebar })),
);

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = memo(function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Left sidebar - Fixed position */}
      <aside className="sidebar-left">
        <div className="inner">
          <Suspense fallback={<div className="h-full bg-black animate-pulse" />}>
            <Sidebar />
          </Suspense>
        </div>
      </aside>

      {/* Right sidebar - Fixed position */}
      <aside className="sidebar-right">
        <div className="inner">
          <Suspense fallback={<div className="h-full bg-black animate-pulse" />}>
            <RightSidebar />
          </Suspense>
        </div>
      </aside>

      {/* Shell: Header 아래 전체 높이를 정확히 채우고 스크롤은 차단 */}
      <div className="shell">
        {/* 3열 컨테이너 */}
        <div className="cols">
          {/* Main content area - 유일한 스크롤 영역 */}
          <main
            className="main"
            id="main-content"
            data-role="primary"
            // Performance optimizations
            style={{
              contentVisibility: 'auto',
              containIntrinsicSize: '1000px',
            }}
          >
            {children}
          </main>
        </div>
      </div>
    </>
  );
});
