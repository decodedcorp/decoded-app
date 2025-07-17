'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

// 조건부 로깅 헬퍼 함수
const isDev = process.env.NODE_ENV === 'development';
const logDebug = (message: string) => {
  if (isDev) {
    console.log(message);
  }
};

interface UseModalCloseProps {
  onClose: () => void;
  isOpen?: boolean;
}

function useModalClose<T extends HTMLElement = HTMLDivElement>({
  onClose,
  isOpen = true,
}: UseModalCloseProps) {
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef<T>(null);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    });
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      // Skip click handling if the event has been marked as handled
      if ((event as any).__handled) {
        logDebug('[useModalClose] Event already handled, ignoring');
        return;
      }

      // Check for special data attributes that indicate elements that shouldn't trigger a close
      const targetElement = event.target as HTMLElement;
      const isNoCloseElement = targetElement.closest('[data-no-close-on-click="true"]');
      const isModalContainer = targetElement.closest('[data-modal-container="true"]');
      
      if (isNoCloseElement || isModalContainer) {
        logDebug('[useModalClose] Click detected on protected element, not closing');
        (event as any).__handled = true;
        return;
      }
      
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        logDebug('[useModalClose] Click outside modal detected, closing');
        handleClose();
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    }, 0);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, handleClose]);

  return {
    isClosing,
    handleClose,
    modalRef,
  };
}

export default useModalClose;
