'use client';

import React from 'react';

import { useModalContext } from './ModalRoot';
import type { ModalOverlayProps } from './types';

interface ExtendedModalOverlayProps extends ModalOverlayProps {
  'data-testid'?: string;
}

/**
 * ModalOverlay - 모달 배경 오버레이 컴포넌트
 *
 * 특징:
 * - dismissible 설정에 따른 클릭 닫기 제어
 * - 백드롭 블러 및 반투명 배경
 * - 애니메이션 지원
 * - 이벤트 버블링 방지
 */
export function ModalOverlay({
  className,
  onClick,
  children,
  'data-testid': testId,
}: ExtendedModalOverlayProps) {
  const { onClose, dismissible } = useModalContext();

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 오버레이에서 직접 발생한 클릭만 처리 (콘텐츠 영역 클릭 제외)
    if (e.target === e.currentTarget && dismissible) {
      e.preventDefault();
      e.stopPropagation();
      if (onClick) {
        onClick();
      } else {
        onClose('overlay');
      }
    }
  };

  return (
    <div
      data-testid={testId ?? 'modal-overlay'}
      className={`modal-overlay fixed inset-0 z-[var(--z-overlay)] bg-black/50 backdrop-blur-sm flex items-center justify-center min-h-full p-4 ${
        className || ''
      }`}
      role="presentation"
      aria-hidden="true"
      onClick={handleOverlayClick}
    >
      {/* 콘텐츠 영역 - stopPropagation 제거, 이벤트 타겟으로만 구분 */}
      <div className="relative pointer-events-auto">{children}</div>
    </div>
  );
}
