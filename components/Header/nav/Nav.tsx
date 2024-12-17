'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import SearchButton from '../search/SearchButton';
import MenuButton from '../buttons/Hamburger';
import MyPageButton from '../buttons/Profile';
import MenuSection from './MenuSection';

interface NavProps {
  isScrolled: boolean;
  isSearchOpen: boolean;
  onSearchToggle: () => void;
  onLoginClick: () => void;
  onSidebarOpen: () => void;
}

function Nav({ isScrolled, isSearchOpen, onSearchToggle, onLoginClick, onSidebarOpen }: NavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={`
        w-full relative flex items-center
        z-navigation 
        transition-all duration-default ease-default animate-fade-in
        ${isScrolled ? '' : 'mt-3'}
      `}
    >
      <div
        className={`w-full transition-all duration-default ${
          isScrolled ? '' : 'absolute left-1/2 -translate-x-1/2'
        }`}
      >
        <MenuSection isScrolled={isScrolled} pathname={pathname} />
      </div>
      <div className="ml-auto flex items-center gap-1 mr-8 relative z-tooltip">
        <SearchButton
          isSearchOpen={isSearchOpen}
          toggleSearch={onSearchToggle}
        />
        <MyPageButton openLoginModal={onLoginClick} />
        <MenuButton openSidebar={onSidebarOpen} />
      </div>
    </nav>
  );
}

export default Nav;
