'use client';

import React, { useEffect, useRef } from 'react';

import { useModalContext } from './ModalRoot';
import type { ModalContentProps } from './types';

/**
 * ModalContent - 모달 콘텐츠 컨테이너
 *
 * 특징:
 * - variant별 레이아웃 (center, drawer-right, sheet-bottom)
 * - 반응형 size 매핑
 * - 세이프 에어리어 대응
 * - visualViewport 변화 감지 (모바일 키보드)
 * - 애니메이션 클래스 자동 적용
 */
export function ModalContent({
  variant: propVariant,
  size: propSize,
  className,
  children,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
}: ModalContentProps) {
  const { variant: contextVariant, size: contextSize, open } = useModalContext();
  const contentRef = useRef<HTMLDivElement>(null);

  // Context에서 variant/size를 가져오되, props가 있으면 우선사용
  const variant = propVariant || contextVariant || 'center';
  const size = propSize || contextSize || 'md';

  // visualViewport 변화 감지 (모바일 키보드 대응)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;

    const handleViewportChange = () => {
      if (contentRef.current && variant === 'sheet-bottom') {
        const height = window.visualViewport?.height || window.innerHeight;
        const offset = window.innerHeight - height;

        // 키보드가 올라왔을 때 시트 높이 조정
        if (offset > 150) {
          // 키보드 높이가 150px 이상일 때
          contentRef.current.style.maxHeight = `calc(90vh - ${offset}px)`;
        } else {
          contentRef.current.style.maxHeight = '';
        }
      }
    };

    window.visualViewport.addEventListener('resize', handleViewportChange);
    return () => window.visualViewport?.removeEventListener('resize', handleViewportChange);
  }, [variant]);

  // 애니메이션 클래스 계산
  const getAnimationClasses = () => {
    const baseClass = open ? 'animate-in' : 'animate-out';
    switch (variant) {
      case 'drawer-right':
        return `${baseClass} drawer-enter fade-in-0 slide-in-from-right duration-200`;
      case 'sheet-bottom':
        return `${baseClass} sheet-enter fade-in-0 slide-in-from-bottom duration-200`;
      default: // center
        return `${baseClass} modal-enter fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-200`;
    }
  };

  // Variant별 레이아웃 클래스
  const getLayoutClasses = () => {
    switch (variant) {
      case 'drawer-right':
        return `
          fixed inset-y-0 right-0 h-dvh
          w-[var(--drawer-w-mobile)] md:w-[var(--drawer-w)]
          flex flex-col
        `;
      case 'sheet-bottom':
        return `
          fixed inset-x-0 bottom-0
          w-full max-h-[var(--sheet-max-h)]
          rounded-t-[var(--modal-radius-lg)]
          safe-area-bottom
          flex flex-col
        `;
      default: // center
        return `
          relative
          w-full max-w-[var(--modal-max-w-${size})]
          max-h-[90dvh] sm:max-h-[85dvh]
          flex flex-col
          mx-4
        `;
    }
  };

  // Size별 추가 클래스 (center variant에서만 적용)
  const getSizeClasses = () => {
    if (variant !== 'center') return '';

    switch (size) {
      case 'sm':
        return 'max-w-[var(--modal-max-w-sm)]';
      case 'md':
        return 'max-w-[var(--modal-max-w-md)]';
      case 'lg':
        return 'max-w-[var(--modal-max-w-lg)]';
      case 'xl':
        return 'max-w-[var(--modal-max-w-xl)]';
      case 'auto':
        return 'max-w-fit';
      default:
        return 'max-w-[var(--modal-max-w-md)]';
    }
  };

  // 포커스 처리
  useEffect(() => {
    if (open && contentRef.current) {
      // 모달이 열릴 때 첫 번째 포커스 가능한 요소에 포커스
      const focusableElement = contentRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ) as HTMLElement;

      if (focusableElement) {
        focusableElement.focus();
      } else {
        contentRef.current.focus();
      }
    }
  }, [open]);

  const combinedClasses = [
    'modal-content',
    'bg-white dark:bg-zinc-900',
    'border border-white/10',
    'shadow-xl',
    'outline-none',
    'overflow-hidden',
    'pointer-events-auto',
    'z-[var(--z-modal)]', // 🔧 CSS 변수 기반 z-index 적용
    getLayoutClasses(),
    getSizeClasses(),
    getAnimationClasses(),
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={contentRef}
      className={combinedClasses}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      tabIndex={-1}
      onClick={(e) => {
        // 콘텐츠 영역 클릭 시 오버레이로 이벤트 전파 방지
        e.stopPropagation();
      }}
    >
      {children}
    </div>
  );
}
