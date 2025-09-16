'use client';

import React from 'react';

import { useModalContext } from './ModalRoot';
import type { ModalFooterProps } from './types';

/**
 * ModalFooter - 모달 푸터 컴포넌트
 *
 * 특징:
 * - variant별 스타일링
 * - 액션 버튼들의 컨테이너
 * - 스크롤 시 고정 레이아웃
 * - 세이프 에어리어 대응 (바텀 시트)
 */
export function ModalFooter({ className, children }: ModalFooterProps) {
  const { variant } = useModalContext();

  // variant별 푸터 스타일
  const getVariantClasses = () => {
    switch (variant) {
      case 'drawer-right':
        return 'px-6 py-4 border-t border-zinc-200 dark:border-zinc-700';
      case 'sheet-bottom':
        return 'px-4 py-3 border-t border-zinc-200 dark:border-zinc-700 safe-area-bottom bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm';
      default: // center
        return 'px-6 py-4 border-t border-zinc-200 dark:border-zinc-700';
    }
  };

  // 버튼 레이아웃 기본 스타일
  const getLayoutClasses = () => {
    return 'flex items-center justify-end gap-3 flex-wrap';
  };

  const combinedClasses = [
    'flex-shrink-0', // 스크롤 시 고정
    'min-h-[60px]', // 터치 타겟을 고려한 최소 높이
    getLayoutClasses(),
    getVariantClasses(),
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <footer className={combinedClasses} role="contentinfo">
      {children}
    </footer>
  );
}