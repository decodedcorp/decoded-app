'use client';

import React from 'react';

import { useModalContext } from './ModalRoot';
import type { ModalHeaderProps } from './types';

/**
 * ModalHeader - 모달 헤더 컴포넌트
 *
 * 특징:
 * - variant별 스타일링
 * - 제목 영역과 액션 영역 분리
 * - 스크롤 시 고정 레이아웃
 * - 접근성 지원 (제목 ID 연결)
 */
export function ModalHeader({ className, children }: ModalHeaderProps) {
  const { variant } = useModalContext();

  // variant별 헤더 스타일
  const getVariantClasses = () => {
    switch (variant) {
      case 'drawer-right':
        return 'px-6 py-4 border-b border-zinc-200 dark:border-zinc-700';
      case 'sheet-bottom':
        return 'px-4 py-3 border-b border-zinc-200 dark:border-zinc-700 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm';
      default: // center
        return 'px-6 py-4 border-b border-zinc-200 dark:border-zinc-700';
    }
  };

  const combinedClasses = [
    'flex items-center justify-between',
    'flex-shrink-0', // 스크롤 시 고정
    'min-h-[48px]', // 터치 타겟 최소 높이
    getVariantClasses(),
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <header className={combinedClasses} role="banner">
      {children}
    </header>
  );
}