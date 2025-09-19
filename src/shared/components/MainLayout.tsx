'use client';

import { ReactNode, memo } from 'react';
import { usePathname } from 'next/navigation';
import { RightSidebar } from '@/domains/main/components/RightSidebar';
import { getLayoutDomain, getLayoutCSSProperties, type LayoutDomain } from '@/utils/layout';

import { Sidebar } from './sidebar/Sidebar';

interface MainLayoutProps {
  children: ReactNode;
  maxWidth?: 'default' | 'wide' | 'full';
  domain?: LayoutDomain;
}

export const MainLayout = memo(function MainLayout({
  children,
  maxWidth = 'default',
  domain,
}: MainLayoutProps) {
  const pathname = usePathname();

  // Auto-detect domain if not provided
  const layoutDomain = domain || getLayoutDomain(pathname);

  // Hide right sidebar on profile pages
  const isProfilePage = pathname.startsWith('/profile');

  return (
    <div className="layout" data-domain={layoutDomain} style={getLayoutCSSProperties(layoutDomain)}>
      {/* Content wrapper - Single scroll root */}
      <div className="content-wrapper">
        {/* Left sidebar - Sticky positioning */}
        <aside className="sidebar-left">
          <div className="sidebar-inner">
            <Sidebar />
          </div>
        </aside>

        {/* Main content area - Flexible */}
        <main className="main" data-max-width={maxWidth} id="main-content" data-role="primary">
          {children}
        </main>

        {/* Right sidebar - Conditional + Sticky positioning */}
        {!isProfilePage && (
          <aside className="sidebar-right">
            <div className="sidebar-inner">
              <RightSidebar />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
});
