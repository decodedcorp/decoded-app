'use client';

import { useEffect, useState } from 'react';
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

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
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

  // Handle create button click
  const handleCreateClick = () => {
    // 모달은 /create 페이지에서 열도록 하고, 여기서는 라우팅만 처리
    router.push('/create');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[10001] lg:hidden"
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
              : 'lg:relative fixed top-0 left-0 h-[calc(100vh-72px)] -translate-x-full lg:translate-x-0'
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
                  href="/profile"
                  icon={<UserIcon />}
                  label={t.navigation.profile()}
                  isActive={pathname === '/profile'}
                />
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
