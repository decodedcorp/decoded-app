'use client';

import React, { useEffect, useRef, ReactNode, useState } from 'react';

import { createPortal } from 'react-dom';
import { useFocusTrap } from '@/lib/hooks/useFocusTrap';
import { useRestoreFocus } from '@/lib/hooks/useRestoreFocus';
import { useScrollLock } from '@/lib/hooks/useScrollLock';
import { useAriaInert } from '@/lib/hooks/useAriaInert';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Z_INDEX_CLASSES } from '@/lib/constants/zIndex';
import { MODAL_SIZES } from '@/lib/constants/modalSizes';

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
  titleId?: string;
  descId?: string;
  onEscape?: () => void;
  onOverlayClick?: () => void;
}

export function BaseModal({
  isOpen,
  onClose,
  children,
  className = '',
  overlayClassName = `fixed inset-0 bg-black/50 backdrop-blur-sm ${Z_INDEX_CLASSES.MODAL_OVERLAY}`,
  contentClassName = MODAL_SIZES.WIDE,
  showOverlay = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  titleId = 'modal-title',
  descId,
  onEscape,
  onOverlayClick,
}: BaseModalProps) {
  const [mounted, setMounted] = useState(false);
  const modalRootRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Portal 생성
  useEffect(() => {
    const root = document.createElement('div');
    root.setAttribute('data-portal-root', 'modal');
    modalRootRef.current = root;
    document.body.appendChild(root);
    setMounted(true);
    return () => {
      try {
        if (root.parentNode) {
          root.parentNode.removeChild(root);
        }
      } catch (error) {
        console.warn('Portal cleanup error:', error);
      }
      modalRootRef.current = null;
    };
  }, []);

  // 접근성 훅 적용
  useRestoreFocus(isOpen);
  useScrollLock(isOpen);
  useFocusTrap(dialogRef as React.RefObject<HTMLElement>, isOpen);
  // useAriaInert(isOpen, modalRootRef.current); // 임시 비활성화 - 앱 전체가 inert되어 조작 불가능해짐

  // ESC 키로 모달 닫기
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (onEscape) {
          onEscape();
        } else {
          onClose();
        }
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose, closeOnEscape, onEscape]);

  if (!mounted || !modalRootRef.current || !isOpen) {
    return null;
  }

  const node = (
    <div
      className={`fixed inset-0 ${Z_INDEX_CLASSES.MODAL_OVERLAY} flex items-center justify-center ${
        isMobile ? 'p-0' : 'p-2 sm:p-4'
      }`}
      style={{ 
        backdropFilter: 'blur(8px)',
        paddingTop: isMobile ? '0' : 'max(1rem, min(5rem, 20vh))',
        paddingBottom: isMobile ? '0' : 'max(1rem, min(5rem, 20vh))'
      }}
      role="presentation"
      onClick={(e) => {
        // 모달 내용이 아닌 배경 클릭시에만 모달 닫기
        if (e.target === e.currentTarget && closeOnOverlayClick) {
          if (onOverlayClick) {
            onOverlayClick();
          } else {
            onClose();
          }
        }
      }}
    >
      {/* 오버레이 배경 */}
      {showOverlay && (
        <div className="absolute inset-0 bg-black/70 pointer-events-none" role="presentation" />
      )}

      {/* 다이얼로그 */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className={`relative ${Z_INDEX_CLASSES.MODAL_CONTENT} ${contentClassName} max-h-[80vh] overflow-y-auto ${className}`}
        style={{ maxHeight: '80vh' }}
        // 모달 내부 클릭은 버블링 중단(backdrop 클릭 닫기와 충돌 방지)
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );

  return createPortal(node, modalRootRef.current);
}
