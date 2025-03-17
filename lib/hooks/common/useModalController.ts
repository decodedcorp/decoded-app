import React, { useState, useRef, useCallback, useEffect } from 'react';

const isDevMode = process.env.NODE_ENV === 'development';

function logDebug(message: string, ...args: any[]) {
  if (isDevMode) {
    console.log(`[MypageModal] ${message}`, ...args);
  }
}

function useModalController({ isOpen: propIsOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isProtectionActive, setIsProtectionActive] = useState<boolean>(false);
  const lastActionTimeRef = useRef<number>(0);
  const prevIsOpenRef = useRef<boolean>(false);

  const handleClose = useCallback(() => {
    const now = Date.now();
    
    if (isProtectionActive) {
      return;
    }
    
    if (now - lastActionTimeRef.current < 300) {
      return;
    }
    
    lastActionTimeRef.current = now;
    onClose();
  }, [onClose, isProtectionActive]);

  useEffect(() => {
    const now = Date.now();
    lastActionTimeRef.current = now;
    
    if (propIsOpen) {
      setIsVisible(true);
      setIsProtectionActive(true);
      
      const protectionTimer = setTimeout(() => {
        setIsProtectionActive(false);
      }, 800);
      
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'hidden';
      }
      
      return () => clearTimeout(protectionTimer);
    } else {
      setIsProtectionActive(true);
      
      const closeTimer = setTimeout(() => {
        setIsVisible(false);
        setIsProtectionActive(false);
        
        if (typeof document !== 'undefined') {
          document.body.style.overflow = '';
        }
      }, 300);
      return () => clearTimeout(closeTimer);
    }
  }, [propIsOpen]);

  return {
    isVisible,
    isProtectionActive,
    handleClose
  };
}

function useResponsiveModalStyles() {
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
    }
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth <= 1025;
  
  const styles = {
    width: isMobile ? '100%' : isTablet ? '420px' : '360px',
    height: isMobile ? '100%' : isTablet ? '75vh' : '65vh',
    marginTop: isMobile ? '0' : '48px',
    borderRadius: isMobile ? '0' : '16px',
    minWidth: isMobile ? '100%' : '350px',
    minHeight: isMobile ? '100%' : '500px',
  };
  
  return { windowWidth, styles };
}

export default useModalController;
