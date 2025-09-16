'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { useFocusTrap } from '@/lib/hooks/useFocusTrap';
import { useRestoreFocus } from '@/lib/hooks/useRestoreFocus';
import { useScrollLock } from '@/lib/hooks/useScrollLock';
import { useAriaInert } from '@/lib/hooks/useAriaInert';

import type { ModalProps, ModalContextValue, ModalCloseReason } from './types';

const ModalContext = createContext<ModalContextValue | null>(null);

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('Modal components must be used within ModalRoot');
  }
  return context;
};

/**
 * ModalRoot - 통합 모달 시스템의 루트 컴포넌트
 *
 * 주요 기능:
 * - Portal 기반 렌더링
 * - 접근성 훅 통합 (포커스 트랩, 스크롤 락, ARIA)
 * - 반응형 variant/size 매핑
 * - 키보드 네비게이션 (ESC)
 * - 컨텍스트 기반 하위 컴포넌트 연동
 */
export function ModalRoot({
  open,
  onOpenChange,
  variant = 'center',
  size = 'md',
  dismissible = true,
  keepMounted = false,
  ariaLabel,
  className,
  children,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const modalRootRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Portal 생성 및 정리
  useEffect(() => {
    // 기존 modal-root가 있는지 확인하고 재사용
    let existingRoot = document.getElementById('modal-root');
    if (!existingRoot) {
      existingRoot = document.createElement('div');
      existingRoot.id = 'modal-root';
      existingRoot.style.position = 'fixed';
      existingRoot.style.top = '0';
      existingRoot.style.left = '0';
      existingRoot.style.width = '100%';
      existingRoot.style.height = '100%';
      existingRoot.style.pointerEvents = 'none';
      existingRoot.style.zIndex = '9999';
      document.body.appendChild(existingRoot);
    }

    const root = document.createElement('div');
    root.setAttribute('data-portal-root', 'modal');
    root.setAttribute('role', 'presentation');
    root.style.pointerEvents = 'auto';
    modalRootRef.current = root;

    existingRoot.appendChild(root);
    setMounted(true);

    return () => {
      if (root.parentNode) {
        root.parentNode.removeChild(root);
      }
      modalRootRef.current = null;

      // 마지막 모달이 제거될 때 modal-root도 정리
      if (existingRoot && existingRoot.children.length === 0) {
        existingRoot.remove();
      }
    };
  }, []);

  // 접근성 훅 적용
  useRestoreFocus(open);
  useScrollLock(open);
  useFocusTrap(dialogRef as React.RefObject<HTMLElement>, open);
  useAriaInert(open, modalRootRef.current);

  // ESC 키 처리
  useEffect(() => {
    if (!open || !dismissible) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onOpenChange(false, 'escape');
      }
    }

    document.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => document.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [open, dismissible, onOpenChange]);

  // 애니메이션 exit 처리
  useEffect(() => {
    if (!open && mounted) {
      setIsExiting(true);
      const timer = setTimeout(() => {
        setIsExiting(false);
      }, 200); // --modal-anim-ms와 동기화
      return () => clearTimeout(timer);
    }
  }, [open, mounted]);

  // 반응형 variant 매핑
  const getResponsiveVariant = (): typeof variant => {
    if (typeof window === 'undefined') return variant;

    const isMobile = window.innerWidth < 768;
    if (variant === 'center' && isMobile) {
      return 'sheet-bottom'; // 모바일에서는 바텀 시트로 폴백
    }
    return variant;
  };

  const effectiveVariant = getResponsiveVariant();

  const contextValue: ModalContextValue = {
    open,
    onClose: (reason?: ModalCloseReason) => onOpenChange(false, reason),
    variant: effectiveVariant,
    size,
    dismissible,
  };

  // 렌더링 조건 확인
  const shouldRender = mounted && modalRootRef.current && (open || (keepMounted && isExiting));

  if (!shouldRender) return null;

  const modal = (
    <ModalContext.Provider value={contextValue}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabel ? undefined : 'modal-title'}
        className={`fixed inset-0 z-[var(--z-modal-root)] ${className || ''}`}
        data-variant={effectiveVariant}
        data-dismissible={dismissible ? 'true' : 'false'}
        data-modal-size={size}
        data-modal-state={open ? 'open' : 'closed'}
      >
        {children}
      </div>
    </ModalContext.Provider>
  );

  if (typeof window === 'undefined') return null;
  
  return createPortal(modal, modalRootRef.current!);
}
