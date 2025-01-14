'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

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
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
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
