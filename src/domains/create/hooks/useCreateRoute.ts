'use client';

import { useEffect, useRef } from 'react';

import { usePathname } from 'next/navigation';

import { useAddChannelStore } from '../store/addChannelStore';

export function useCreateRoute() {
  const pathname = usePathname();
  const openModal = useAddChannelStore((state) => state.openModal);
  const isModalOpen = useAddChannelStore((state) => state.isOpen);
  const hasAutoOpened = useRef(false);

  useEffect(() => {
    // /create 경로에 진입했을 때만 모달 자동 열기
    if (pathname === '/create' && !isModalOpen && !hasAutoOpened.current) {
      openModal();
      hasAutoOpened.current = true;
    }
    
    // 다른 경로로 이동했을 때 자동 열기 플래그 리셋
    if (pathname !== '/create') {
      hasAutoOpened.current = false;
    }
  }, [pathname, isModalOpen, openModal]);

  return {
    isCreateRoute: pathname === '/create',
    isModalOpen,
  };
}
