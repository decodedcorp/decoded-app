'use client';

import { useState, useCallback, useEffect } from 'react';
import { RequestFormModal } from '@/components/modals/request/request-form-modal';
import { useProtectedAction, setAuthCallback } from '@/lib/hooks/auth/use-protected-action';
import { useLoginModalStore } from '@/components/auth/login-modal/store';

export const useRequestModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { checkAuth } = useProtectedAction();
  const { openLoginModal } = useLoginModalStore();

  // 요청 모달을 여는 함수
  const openRequestModalDirectly = useCallback(() => {
    console.log('Opening request modal directly');
    setIsOpen(true);
  }, []);

  const onOpen = useCallback(() => {
    console.log('Checking login status before opening request modal');
    
    // 로그인 상태를 확인 - 콜백을 전달하지 않아 status 모달이 대신 표시되도록 함
    const userId = checkAuth();
    
    if (userId) {
      console.log('User is logged in, opening request modal');
      setIsOpen(true);
    } else {
      console.log('User is not logged in, status modal will handle the login flow');
      // 로그인 콜백 설정 - 로그인 후 실행될 함수
      setAuthCallback(openRequestModalDirectly);
      // openLoginModal 직접 호출하지 않음 - status 모달이 처리함
    }
  }, [checkAuth, openRequestModalDirectly]);

  const onClose = useCallback(() => {
    console.log('Closing request modal');
    setIsOpen(false);
  }, []);

  // 모달 상태 변경 로깅
  useEffect(() => {
    console.log('Modal state changed:', isOpen);
  }, [isOpen]);

  // Return the modal component and control functions
  return {
    onOpen,
    onClose,
    isOpen,
    RequestModal: (
      <RequestFormModal
        isOpen={isOpen}
        onClose={onClose}
      />
    ),
  };
}; 