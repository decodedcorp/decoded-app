'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import SearchButton from '../search/SearchButton';
import MenuButton from '../buttons/Hamburger';
import MyPageButton from '../buttons/Profile';
import MenuSection from './MenuSection';
import { SearchModal, LoginModal } from '@/components/ui/modal';
import { SidebarDrawer } from '@/components/ui/drawer';

interface NavProps {
  isScrolled: boolean;
}

function Nav({ isScrolled }: NavProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav
        className={`w-full relative flex items-center 
          transition-all duration-default ease-default animate-fade-in
          ${isScrolled ? '' : 'mt-3'}`}
      >
        <div
          className={`w-full transition-all duration-default left-1/2 -translate-x-1/2 ${
            isScrolled ? '' : 'absolute'
          }`}
        >
          <MenuSection isScrolled={isScrolled} pathname={pathname} />
        </div>
        <div className="ml-auto flex items-center gap-1 mr-16">
          <SearchButton
            isSearchOpen={isSearchOpen}
            toggleSearch={() => setIsSearchOpen((prev) => !prev)}
          />
          <MyPageButton openLoginModal={() => setIsLoginOpen(true)} />
          <MenuButton openSidebar={() => setIsSidebarOpen(true)} />
        </div>
      </nav>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        isScrolled={isScrolled}
      />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <SidebarDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </>
  );
}

export default Nav;
