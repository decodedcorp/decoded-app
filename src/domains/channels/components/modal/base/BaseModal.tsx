'use client';

import React, { useEffect, useRef, ReactNode } from 'react';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  showOverlay?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export function BaseModal({
  isOpen,
  onClose,
  children,
  className = '',
  overlayClassName = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]',
  contentClassName = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[10000]',
  showOverlay = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: BaseModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // ESC 키와 외부 클릭으로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && closeOnEscape) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // 모달이 열릴 때 body 스크롤 방지
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = 'var(--scrollbar-width, 0px)';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // 모달이 닫힐 때 body 스크롤 복원
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen, onClose, closeOnEscape]);

  // 스크롤바 너비 계산 (레이아웃 시프트 방지)
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Overlay */}
      {showOverlay && (
        <div className={overlayClassName} onClick={closeOnOverlayClick ? onClose : undefined} />
      )}

      {/* Modal Content */}
      <div ref={modalRef} className={`${contentClassName} ${className}`}>
        {children}
      </div>
    </>
  );
}
