'use client';

import { useState, useCallback, useEffect, useRef, RefObject } from 'react';

interface UseModalCloseProps {
  onClose: () => void;
  duration?: number;
}

interface UseModalCloseReturn {
  isClosing: boolean;
  handleClose: () => void;
  modalRef: RefObject<HTMLDivElement>;
}

function useModalClose({ onClose, duration = 300 }: UseModalCloseProps): UseModalCloseReturn {
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, duration);
  }, [onClose, duration]);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isClosing) {
        handleClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && 
          !modalRef.current.contains(event.target as Node) && 
          !isClosing) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClose, isClosing]);

  return {
    isClosing,
    handleClose,
    modalRef,
  };
}

export default useModalClose; 