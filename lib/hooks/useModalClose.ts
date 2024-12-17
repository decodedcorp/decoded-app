'use client';

import { useState, useCallback } from 'react';

interface UseModalCloseProps {
  onClose: () => void;
  duration?: number;
}

function useModalClose({ onClose, duration = 300 }: UseModalCloseProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, duration);
  }, [onClose, duration]);

  return {
    isClosing,
    handleClose,
  };
}

export default useModalClose;
