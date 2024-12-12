'use client';

import Sidebar from '@/components/Header/sidebar/SideBar';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SidebarDrawer({ isOpen, onClose }: SidebarDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      <div className="fixed inset-y-0 left-0">
        <Sidebar isSidebarOpen={isOpen} setIsSidebarOpen={onClose} />
      </div>
    </div>
  );
} 