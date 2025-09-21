'use client';

import { useEffect, useState, memo, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';

import {
  HomeIcon,
  RectangleStackIcon,
  MagnifyingGlassIcon,
  BookmarkIcon,
  PlusIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useAuthStore } from '@/store/authStore';
import { useAddChannelStore } from '@/domains/create/store/addChannelStore';
import { useMobileSidebarStore } from '@/store/mobileSidebarStore';
import { useRouter, usePathname } from 'next/navigation';
import { useCommonTranslation } from '@/lib/i18n/hooks';

import { SidebarChannelList } from './SidebarChannelList';
import { SidebarToggleItem } from './SidebarToggleItem';
import { SidebarItem } from './SidebarItem';

export const Sidebar = memo(function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // 상태 구독 최적화 - 필요한 상태만 구독
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const [isMounted, setIsMounted] = useState(false);

  // Mobile sidebar state from Zustand store
  const { isOpen: isMobileOpen, close: closeMobileSidebar } = useMobileSidebarStore();

  // 모달 상태를 개별적으로 구독하여 무한 루프 방지
  const openAddChannelModal = useAddChannelStore((state) => state.openModal);
  const isModalOpen = useAddChannelStore((state) => state.isOpen);

  const t = useCommonTranslation();

  // Custom hook for scroll lock
  const useScrollLock = (isLocked: boolean) => {
    useEffect(() => {
      if (!isLocked) return;

      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;

      // 스크롤바 너비 보상 (레이아웃 시프트 방지)
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }, [isLocked]);
  };

  // Apply scroll lock when mobile sidebar is open
  useScrollLock(isMobileOpen);

  // Check if component is mounted for Portal
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close mobile sidebar when route changes
  useEffect(() => {
    closeMobileSidebar();
  }, [pathname, closeMobileSidebar]);

  // Note: Mobile sidebar toggle is now handled by Zustand store

  // Keyboard event handler (ESC to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        closeMobileSidebar();
      }
    };

    if (isMobileOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isMobileOpen, closeMobileSidebar]);

  // Handle create button click - useCallback으로 최적화
  const handleCreateClick = useCallback(() => {
    console.log('Create button clicked, navigating to /create');
    // 모달은 /create 페이지에서 열도록 하고, 여기서는 라우팅만 처리
    router.push('/create');
  }, [router]);

  // Mobile Sidebar Portal Component
  const MobileSidebarPortal = ({ isOpen, onClose, children }) => {
    if (!isOpen || !isMounted) return null;

    return createPortal(
      <>
        {/* Mobile Backdrop - starts below header */}
        <div
          className="fixed left-0 right-0 bottom-0 bg-black/50 lg:hidden cursor-pointer"
          style={{
            top: 'calc(var(--header-height) + env(safe-area-inset-top, 0px))',
            zIndex: 'var(--z-overlay)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
          }}
          onClick={onClose}
          data-mobile-overlay
          data-open={isOpen}
        />

        {/* Mobile Sidebar */}
        <nav
          id="mobile-sidebar"
          className="lg:hidden"
          style={{
            position: 'fixed',
            top: 'calc(var(--header-height) + env(safe-area-inset-top, 0px))',
            left: '0px',
            width: '240px',
            height: 'calc(100dvh - var(--header-height) - env(safe-area-inset-top, 0px))',
            backgroundColor: '#000000',
            borderRight: '1px solid #27272a',
            zIndex: 'var(--z-sidebar-mobile)',
          }}
          data-mobile-sidebar
          data-open={isOpen}
          aria-hidden={!isOpen}
        >
          {children}
        </nav>
      </>,
      document.body
    );
  };

  // Sidebar content component
  const SidebarContent = () => (
    <div className="px-2 py-4 bg-black min-h-full" data-testid="sidebar">
      {/* Main Navigation */}
      <div className="space-y-2">
        <SidebarItem
          href="/"
          icon={<HomeIcon />}
          label={t.navigation.home()}
          isActive={pathname === '/'}
        />
        <SidebarItem
          href="/search"
          icon={<MagnifyingGlassIcon />}
          label={t.actions.search()}
          isActive={pathname === '/search'}
        />
        {/* Channels with toggleable channel list */}
        <SidebarToggleItem
          icon={<RectangleStackIcon />}
          label={t.navigation.channels()}
          isActive={pathname === '/channels' || pathname.startsWith('/channels/')}
          href="/channels"
        >
          <SidebarChannelList />
        </SidebarToggleItem>

        {/* Authenticated user features */}
        {isAuthenticated && (
          <>
            <SidebarItem
              href="/bookmarks"
              icon={<BookmarkIcon />}
              label={t.navigation.bookmarks()}
              isActive={pathname === '/bookmarks'}
            />
            <SidebarItem
              onClick={handleCreateClick}
              icon={<PlusIcon />}
              label={t.actions.create()}
              isActive={isModalOpen}
            />
            <SidebarItem
              href={user?.doc_id ? `/profile/${user.doc_id}` : '/profile'}
              icon={<UserIcon />}
              label={t.navigation.profile()}
              isActive={pathname.startsWith('/profile')}
            />
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar Portal - 모바일에서만 표시 */}
      <MobileSidebarPortal
        isOpen={isMobileOpen}
        onClose={closeMobileSidebar}
      >
        <SidebarContent />
      </MobileSidebarPortal>

      {/* Desktop Sidebar Content - rendered by MainLayout */}
      <div className="hidden lg:block w-full h-full">
        <SidebarContent />
      </div>
    </>
  );
});
