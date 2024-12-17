'use client';

import { useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import useScroll from '@/lib/hooks/useScroll';
import useModalClose from '@/lib/hooks/useModalClose';
import Header from './Header';
import { SearchModal, LoginModal } from '@/components/ui/modal';
import { SidebarDrawer } from '@/components/ui/drawer';

export function HeaderLayout() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isScrolled = useScroll({
    threshold: 300,
    throttleMs: 200,
    isHome,
  });

  const { isClosing: isSearchClosing, handleClose: handleSearchClose } = useModalClose({
    onClose: () => setIsSearchOpen(false)
  });

  const { isClosing: isLoginClosing, handleClose: handleLoginClose } = useModalClose({
    onClose: () => setIsLoginOpen(false)
  });

  const { isClosing: isSidebarClosing, handleClose: handleSidebarClose } = useModalClose({
    onClose: () => setIsSidebarOpen(false)
  });

  const handleSearchToggle = useCallback(() => {
    if (isSearchOpen) {
      handleSearchClose();
    } else {
      setIsSearchOpen(true);
    }
  }, [isSearchOpen, handleSearchClose]);

  return (
    <>
      <Header
        isScrolled={isScrolled}
        isSearchOpen={isSearchOpen}
        onSearchToggle={handleSearchToggle}
        onLoginClick={() => {
          if (isLoginOpen) {
            handleLoginClose();
          } else {
            setIsLoginOpen(true);
          }
        }}
        onSidebarOpen={() => setIsSidebarOpen(true)}
      />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={handleSearchClose}
        isScrolled={isScrolled}
        isClosing={isSearchClosing}
      />
      <LoginModal
        isOpen={isLoginOpen}
        onClose={handleLoginClose}
        isClosing={isLoginClosing}
      />
      <SidebarDrawer
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        isClosing={isSidebarClosing}
      />
    </>
  );
}
