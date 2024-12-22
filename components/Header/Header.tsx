'use client';

import Logo from './logo/Logo';
import Nav from './nav/Nav';
import { cn } from '@/lib/utils';

interface HeaderProps {
  isScrolled: boolean;
  isSearchOpen: boolean;
  onSearchToggle: () => void;
  onLoginClick: () => void;
  onSidebarOpen: () => void;
}

function Header({
  isScrolled,
  isSearchOpen,
  onSearchToggle,
  onLoginClick,
  onSidebarOpen,
}: HeaderProps) {
  return (
    <header
      className={cn(
        'fixed top-0 w-full',
        'z-header',
        'bg-mainBackground border-b border-gray-800',
        'transition-all duration-default ease-default animate-fade-in will-change-transform',
        isScrolled
          ? 'flex items-center gap-4 h-header-mobile md:h-header-desktop'
          : 'flex-col items-center justify-center h-[100px] md:h-[140px]'
      )}
    >
      <Logo isScrolled={isScrolled} />
      <Nav
        isScrolled={isScrolled}
        isSearchOpen={isSearchOpen}
        onSearchToggle={onSearchToggle}
        onLoginClick={onLoginClick}
        onSidebarOpen={onSidebarOpen}
      />
    </header>
  );
}

export default Header;
