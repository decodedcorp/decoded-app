'use client';

import React from 'react';
import { X } from 'lucide-react';

import { useModalContext } from './ModalRoot';
import type { ModalCloseProps } from './types';

/**
 * ModalClose - 모달 닫기 버튼 컴포넌트
 *
 * 특징:
 * - 일관된 닫기 아이콘 및 스타일
 * - 접근성 지원 (aria-label, 키보드 네비게이션)
 * - variant별 위치 조정
 * - 터치 최적화 크기
 */
export function ModalClose({
  className,
  'aria-label': ariaLabel = 'Close modal',
  onClick,
}: ModalCloseProps) {
  const { onClose, variant } = useModalContext();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      onClose('close-button');
    }
  };

  // variant별 위치 및 스타일
  const getVariantClasses = () => {
    switch (variant) {
      case 'drawer-right':
        return 'absolute top-4 right-4';
      case 'sheet-bottom':
        return 'absolute top-3 right-3';
      default: // center
        return 'absolute top-4 right-4';
    }
  };

  const combinedClasses = [
    'flex items-center justify-center',
    'w-10 h-10', // 44px+ 터치 타겟
    'rounded-full',
    'bg-zinc-100 hover:bg-zinc-200',
    'dark:bg-zinc-800 dark:hover:bg-zinc-700',
    'text-zinc-600 hover:text-zinc-900',
    'dark:text-zinc-400 dark:hover:text-zinc-100',
    'transition-colors duration-150',
    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
    'touch-manipulation', // 터치 최적화
    getVariantClasses(),
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      data-testid="modal-close"
      className={combinedClasses}
      aria-label={ariaLabel}
      onClick={handleClick}
    >
      <X className="w-5 h-5" />
    </button>
  );
}
