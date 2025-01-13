'use client';

import { useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import useModalClose from '@/lib/hooks/common/useModalClose';
import Header from './Header';
import { SearchModal, LoginModal } from '@/components/ui/modal';

export function HeaderLayout() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const { isClosing: isSearchClosing, handleClose: handleSearchClose } =
    useModalClose({
      onClose: () => setIsSearchOpen(false),
    });

  const { isClosing: isLoginClosing, handleClose: handleLoginClose } =
    useModalClose({
      onClose: () => setIsLoginOpen(false),
    });

  const { isClosing: isSidebarClosing, handleClose: handleSidebarClose } =
    useModalClose({
      onClose: () => setIsSidebarOpen(false),
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
        isClosing={isSearchClosing}
        isScrolled={false}
      />
      <LoginModal
        isOpen={isLoginOpen}
        onClose={handleLoginClose}
        isClosing={isLoginClosing}
      ></LoginModal>
    </>
  );
}
