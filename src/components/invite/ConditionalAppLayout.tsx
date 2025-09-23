'use client';

import { usePathname } from 'next/navigation';
import { Header } from '../../shared/components/Header';
import { MainLayout } from '../../shared/components/MainLayout';
import { GlobalContentUploadModal } from '../../domains/channels/components/modal/global-content-upload/GlobalContentUploadModal';
import { CommentsRoot } from '../../domains/comments/components/CommentsRoot';

interface ConditionalAppLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

// Routes that should not show the main app layout
const LAYOUT_EXEMPT_ROUTES = ['/invite-code'];

/**
 * Conditionally renders app layout components based on current route
 */
export function ConditionalAppLayout({ children, modal }: ConditionalAppLayoutProps) {
  const pathname = usePathname();

  // Check if current route should skip the main app layout
  const shouldSkipLayout = LAYOUT_EXEMPT_ROUTES.some(route =>
    pathname.startsWith(route)
  );

  if (shouldSkipLayout) {
    // For invite-code and similar pages, just render children without app layout
    return (
      <>
        {children}
        {modal}
      </>
    );
  }

  // For normal app pages, render with full app layout
  return (
    <>
      <Header />
      <MainLayout>{children}</MainLayout>
      <GlobalContentUploadModal />
      <CommentsRoot />
      {modal}
    </>
  );
}