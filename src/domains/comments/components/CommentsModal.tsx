'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useCommentsModal } from '@/hooks/useCommentsModal';
import { useScrollLock } from '@/lib/hooks/useScrollLock';
import { CommentsBody } from './CommentsBody';
import { cn } from '@/lib/utils/cn';
import { Z_INDEX_CLASSES } from '@/lib/constants/zIndex';

export function CommentsModal() {
  const { isOpen, contentId, close } = useCommentsModal();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useScrollLock(isOpen);

  // 포커스 관리 로직 개선
  useEffect(() => {
    if (!isOpen) return;

    // 현재 포커스된 요소 저장
    previousFocusRef.current = document.activeElement as HTMLElement;

    // 모달이 열리면 포커스 설정
    const focusModal = () => {
      if (!modalRef.current) return;

      // 첫 번째 포커스 가능한 요소 찾기
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      if (focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement;
        firstElement.focus();
      } else {
        // 포커스 가능한 요소가 없으면 모달 자체에 포커스
        modalRef.current.focus();
      }
    };

    // 약간의 지연을 두고 포커스 설정 (애니메이션 완료 후)
    const timer = setTimeout(focusModal, 150);

    // cleanup: 원래 포커스 복원
    return () => {
      clearTimeout(timer);
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen]);

  // 기존 ESC 키 처리
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close('esc');
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, close]);

  // 포커스 트랩 로직 개선
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  // 모달 외부 클릭 방지
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      close('backdrop');
    }
  };

  if (!isOpen || !contentId) return null;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-[1200] bg-black/60 pointer-events-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => close('backdrop')}
      />

      {/* Wrapper (no events) */}
      <motion.div
        className="fixed inset-0 z-[1201] grid place-items-center pointer-events-none"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
      >
        {/* Panel (receives events) */}
        <motion.div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-label="댓글 모달"
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          className={cn(
            'relative z-[1202] pointer-events-auto max-h-[85dvh] w-[min(720px,92vw)] overflow-auto rounded-2xl bg-zinc-900 shadow-2xl',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-black',
          )}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          onFocus={(e) => {
            console.log('Modal focused:', e.target);
          }}
        >
          {/* 기존 닫기 버튼 스타일 */}
          <button
            onClick={() => close('button')}
            className={cn(
              'absolute top-4 right-4 z-10 p-2 rounded-full',
              'bg-black/20 hover:bg-black/40 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black',
            )}
            aria-label="댓글 모달 닫기"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <CommentsBody contentId={contentId} showHeader={true} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
