'use client';

import { usePathname } from 'next/navigation';
import useScroll from '@/lib/hooks/useScroll';
import Logo from './logo/Logo';
import Nav from './nav/Nav';

function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isScrolled = useScroll({
    threshold: 300,
    throttleMs: 200,
    isHome,
  });

  return (
    <header
      className={`
        fixed top-0 w-full z-30 
        bg-mainBackground border-b border-gray-800
        transition-all duration-default ease-default animate-fade-in will-change-transform
        ${
          isScrolled
            ? 'flex justify-between h-header-mobile md:h-header-desktop'
            : 'flex-col items-center justify-center h-[100px] md:h-[140px]'
        }
      `}
    >
      <Logo isScrolled={isScrolled} />
      <Nav isScrolled={isScrolled} />
    </header>
  );
}

export default Header;
