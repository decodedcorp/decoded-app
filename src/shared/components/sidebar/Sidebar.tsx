'use client';

import { useEffect, useState, memo, useMemo, useCallback } from 'react';
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
import { SidebarItem } from './SidebarItem';
import { SidebarToggleItem } from './SidebarToggleItem';
import { SidebarChannelList } from './SidebarChannelList';
import { useAuthStore } from '@/store/authStore';
import { useAddChannelStore } from '@/domains/create/store/addChannelStore';
import { useRouter, usePathname } from 'next/navigation';
import { useCommonTranslation } from '@/lib/i18n/hooks';

export const Sidebar = memo(function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // 상태 구독 최적화 - 필요한 상태만 구독
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // 모달 상태를 개별적으로 구독하여 무한 루프 방지
  const openAddChannelModal = useAddChannelStore((state) => state.openModal);
  const isModalOpen = useAddChannelStore((state) => state.isOpen);

  const t = useCommonTranslation();

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Listen for mobile sidebar toggle events from header
  useEffect(() => {
    const handleToggleMobileSidebar = () => {
      setIsMobileOpen((prev) => !prev);
    };

    window.addEventListener('toggle-mobile-sidebar', handleToggleMobileSidebar);
    return () => {
      window.removeEventListener('toggle-mobile-sidebar', handleToggleMobileSidebar);
    };
  }, []);

  // Handle create button click - useCallback으로 최적화
  const handleCreateClick = useCallback(() => {
    console.log('Create button clicked, navigating to /create');
    // 모달은 /create 페이지에서 열도록 하고, 여기서는 라우팅만 처리
    router.push('/create');
  }, [router]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[10001] lg:hidden cursor-pointer"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Fixed Sidebar - Instagram style */}
      <aside
        className={`
          w-[245px]
          bg-black border-r border-zinc-800
          overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-black
          ${
            isMobileOpen
              ? 'fixed top-[60px] md:top-[72px] left-0 h-[calc(100vh-60px)] md:h-[calc(100vh-72px)] translate-x-0 z-[10002]'
              : 'fixed top-0 left-0 h-[calc(100vh-72px)] -translate-x-full lg:relative lg:translate-x-0'
          }
        `}
      >
        <div className="py-6 px-3">
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
      </aside>
    </>
  );
});
