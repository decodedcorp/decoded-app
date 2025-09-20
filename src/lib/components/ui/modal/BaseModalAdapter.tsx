'use client';

import React from 'react';
import { ModalCore } from './ModalCore';

interface BaseModalAdapterProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
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

/**
 * BaseModal 어댑터 - 기존 BaseModal API를 새로운 ModalCore로 변환
 * 점진적 마이그레이션을 위한 브리지 컴포넌트
 */
export function BaseModalAdapter({
  isOpen,
  onClose,
  children,
  className = '',
  contentClassName = '',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  titleId,
  descId,
  onEscape,
  onOverlayClick,
}: BaseModalAdapterProps) {
  // contentClassName에서 크기 추출 (MODAL_SIZES.WIDE 등)
  const getSize = (): 'sm' | 'md' | 'wide' => {
    if (contentClassName.includes('max-w-[1200px]') || contentClassName.includes('WIDE')) {
      return 'wide';
    }
    if (contentClassName.includes('max-w-[500px]') || contentClassName.includes('SMALL')) {
      return 'sm';
    }
    return 'md';
  };

  const handleOpenChange = (open: boolean, reason?: string) => {
    if (!open) {
      if (reason === 'escape' && closeOnEscape) {
        if (onEscape) {
          onEscape();
        } else {
          onClose();
        }
      } else if (reason === 'overlay' && closeOnOverlayClick) {
        if (onOverlayClick) {
          onOverlayClick();
        } else {
          onClose();
        }
      } else if (!reason) {
        // Direct close call
        onClose();
      }
    }
  };

  return (
    <ModalCore
      open={isOpen}
      onOpenChange={handleOpenChange}
      size={getSize()}
      ariaLabel={titleId ? undefined : 'Modal'}
      className={className}
      closeOnOverlayClick={closeOnOverlayClick}
      closeOnEscape={closeOnEscape}
    >
      <div className="flex flex-col h-full">{children}</div>
    </ModalCore>
  );
}
