'use client';

import Sidebar from '@/components/Header/sidebar/SideBar';
import { DrawerOverlay } from './DrawerOverlay';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isClosing: boolean;
}

export function SidebarDrawer({
  isOpen,
  onClose,
  isClosing,
}: SidebarDrawerProps) {
  if (!isOpen && !isClosing) return null;

  return (
    <DrawerOverlay onClose={onClose} isClosing={isClosing}>
      <div
        className={`
          fixed inset-y-0 right-0
          w-full lg:w-[30%]
          transition-transform duration-300 ease-in-out
          ${isClosing ? 'translate-x-full' : 'translate-x-0'}
          z-max
          bg-gray-900
        `}
      >
        <Sidebar isSidebarOpen={!isClosing} setIsSidebarOpen={onClose} />
      </div>
    </DrawerOverlay>
  );
}
