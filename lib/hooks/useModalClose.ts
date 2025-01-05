'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface UseModalCloseProps {
  onClose: () => void;
  duration?: number;
}

function useModalClose<T extends HTMLElement = HTMLDivElement>({ 
  onClose, 
  duration = 300 
}: UseModalCloseProps) {
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef<T>(null);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, duration);
  }, [onClose, duration]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [handleClose]);

  return {
    isClosing,
    handleClose,
    modalRef,
  };
}

export default useModalClose;
