'use client';
import React, { useEffect, useRef, useState } from 'react';

import { createPortal } from 'react-dom';
import { useFocusTrap } from '@/lib/hooks/useFocusTrap';
import { useRestoreFocus } from '@/lib/hooks/useRestoreFocus';
import { useScrollLock } from '@/lib/hooks/useScrollLock';
import { useAriaInert } from '@/lib/hooks/useAriaInert';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  titleId: string; // h2 id
  descId?: string; // p id
  children: React.ReactNode;
  withBackgroundBlur?: boolean; // 카드/배경 블러
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
};

const sizeClasses = {
  sm: 'max-w-[95vw] sm:max-w-md',
  md: 'max-w-[95vw] sm:max-w-lg',
  lg: 'max-w-[95vw] sm:max-w-4xl',
  xl: 'max-w-[95vw] sm:max-w-6xl',
  full: 'max-w-[95vw] sm:max-w-[90vw]',
};

export function Modal({
  open,
  onClose,
  titleId,
  descId,
  children,
  withBackgroundBlur = true,
  className = '',
  size = 'md',
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const modalRootRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.createElement('div');
    root.setAttribute('data-portal-root', 'modal');
    modalRootRef.current = root;
    document.body.appendChild(root);
    setMounted(true);
    return () => {
      root.remove();
      modalRootRef.current = null;
    };
  }, []);

  useRestoreFocus(open);
  useScrollLock(open);
  useFocusTrap(dialogRef as React.RefObject<HTMLElement>, open);
  useAriaInert(open, modalRootRef.current);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!mounted || !modalRootRef.current || !open) return null;

  const node = (
    <>
      {/* 배경 블러: 포인터 이벤트 차단 */}
      {withBackgroundBlur && (
        <div
          aria-hidden
          className="fixed inset-0 pointer-events-none z-[999]"
          style={{ filter: 'blur(6px)', willChange: 'filter' }}
        />
      )}

      {/* 오버레이 */}
      <div
        className="fixed inset-0 z-[1000] bg-black/50"
        role="presentation"
        onMouseDown={(e) => {
          // dialog 박스 밖 클릭 시 닫기
          if (e.target === e.currentTarget) onClose();
        }}
      />

      {/* 다이얼로그 */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="fixed inset-0 z-[1010] flex items-center justify-center p-2 sm:p-4"
      >
        <div
          className={`w-full ${sizeClasses[size]} max-h-[90vh] sm:max-h-[85vh] rounded-2xl bg-white shadow-xl outline-none overflow-y-auto ${className}`}
          // 모달 내부 클릭은 버블링 중단(바깥 클릭 닫기와 충돌 방지)
          onMouseDown={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </>
  );

  return createPortal(node, modalRootRef.current);
}
