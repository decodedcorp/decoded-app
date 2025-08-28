'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  RectangleStackIcon,
  MagnifyingGlassIcon,
  BookmarkIcon,
  PlusIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { SidebarItem } from './SidebarItem';
import { useAuthStore } from '@/store/authStore';

export function Sidebar() {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);


  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-[18px] left-4 z-[10000] p-2 rounded-lg bg-zinc-900 border border-zinc-700 lg:hidden"
      >
        {isMobileOpen ? (
          <XMarkIcon className="w-5 h-5 text-zinc-300" />
        ) : (
          <Bars3Icon className="w-5 h-5 text-zinc-300" />
        )}
      </button>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[9997] lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Fixed Sidebar - Instagram style */}
      <aside
        className={`
          relative top-0 left-0 h-[calc(100vh-72px)] w-[245px]
          bg-black border-r border-zinc-800
          overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-black
          ${isMobileOpen ? 'fixed translate-x-0 z-[9998]' : 'lg:relative fixed -translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="py-6 px-3">
          {/* Main Navigation */}
          <div className="space-y-2">
            <SidebarItem
              href="/"
              icon={<HomeIcon />}
              label="Home"
              isActive={pathname === '/'}
            />
            <SidebarItem
              href="/search"
              icon={<MagnifyingGlassIcon />}
              label="Search"
              isActive={pathname === '/search'}
            />
            <SidebarItem
              href="/channels"
              icon={<RectangleStackIcon />}
              label="Channels"
              isActive={pathname === '/channels'}
            />
            
            {/* Authenticated user features */}
            {isAuthenticated && (
              <>
                <SidebarItem
                  href="/bookmarks"
                  icon={<BookmarkIcon />}
                  label="Bookmarks"
                  isActive={pathname === '/bookmarks'}
                />
                <SidebarItem
                  href="/create"
                  icon={<PlusIcon />}
                  label="Create"
                  isActive={pathname === '/create'}
                />
                <SidebarItem
                  href="/profile"
                  icon={<UserIcon />}
                  label="Profile"
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