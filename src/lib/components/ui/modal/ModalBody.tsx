'use client';

import React from 'react';

import { useModalContext } from './ModalRoot';
import type { ModalBodyProps } from './types';

/**
 * ModalBody - 모달 바디 컴포넌트
 *
 * 특징:
 * - 헤더/푸터를 제외한 스크롤 영역
 * - variant별 패딩 조정
 * - iOS 관성 스크롤 지원
 * - 키보드 대응 높이 조정
 */
export function ModalBody({ className, children }: ModalBodyProps) {
  const { variant } = useModalContext();

  // variant별 바디 스타일
  const getVariantClasses = () => {
    switch (variant) {
      case 'drawer-right':
        return 'px-6 py-4';
      case 'sheet-bottom':
        return 'px-4 py-3';
      default: // center
        return 'px-6 py-4';
    }
  };

  // 스크롤 영역 최대 높이 계산
  const getScrollClasses = () => {
    switch (variant) {
      case 'drawer-right':
        return 'max-h-[calc(100dvh-80px)]'; // 헤더 높이 제외
      case 'sheet-bottom':
        return 'max-h-[calc(var(--sheet-max-h)-60px)]'; // 헤더 높이 제외
      default: // center
        return 'max-h-[calc(90dvh-120px)]'; // 헤더+푸터 높이 제외
    }
  };

  const combinedClasses = [
    'flex-1 min-h-0', // flex-grow + overflow 처리
    'overflow-auto',
    '-webkit-overflow-scrolling: touch', // iOS 관성 스크롤
    getScrollClasses(),
    getVariantClasses(),
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={combinedClasses}
      role="main"
      style={{
        WebkitOverflowScrolling: 'touch', // iOS Safari 지원
      }}
    >
      {children}
    </div>
  );
}