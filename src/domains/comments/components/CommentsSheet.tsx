'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useCommentsModal } from '@/hooks/useCommentsModal';
import { useScrollLock } from '@/lib/hooks/useScrollLock';
import { CommentsBody } from './CommentsBody';
import { Z_INDEX_CLASSES } from '@/lib/constants/zIndex';

export function CommentsSheet() {
  const { isOpen, contentId, close } = useCommentsModal();
  const { t } = useTranslation('content');
  const modalRef = useRef<HTMLDivElement>(null);

  useScrollLock(isOpen);

  // 포커스 관리 및 스와이프 제스처 로직
  useEffect(() => {
    if (!isOpen) return;

    // 현재 포커스된 요소 저장
    const previousFocus = document.activeElement as HTMLElement;

    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close('esc');
      }
    };

    // 시트에 포커스 설정
    const focusSheet = () => {
      if (modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );

        if (focusableElements.length > 0) {
          const firstElement = focusableElements[0] as HTMLElement;
          firstElement.focus();
        } else {
          modalRef.current.focus();
        }
      }
    };

    // 약간의 지연을 두고 포커스 설정
    const timer = setTimeout(focusSheet, 150);

    const handleTouchStart = (e: TouchEvent) => {
      // Only handle swipe on header area
      const target = e.target as HTMLElement;
      if (!target.closest('[data-swipe-handle]')) return;

      startY = e.touches[0].clientY;
      isDragging = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;

      currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;

      // Only allow downward swipe with smoother animation
      if (deltaY > 0 && modalRef.current) {
        const translateY = Math.min(deltaY * 0.9, 200);
        const opacity = Math.max(0.2, 1 - translateY / 300);
        modalRef.current.style.transform = `translateY(${translateY}px)`;
        modalRef.current.style.opacity = `${opacity}`;
        modalRef.current.style.transition = 'none'; // Disable transition during drag
      }
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;

      const deltaY = currentY - startY;

      // If swiped down more than 100px, close the modal
      if (deltaY > 100) {
        close('swipe');
      } else if (modalRef.current) {
        // Reset position with smooth spring animation
        modalRef.current.style.transition =
          'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        modalRef.current.style.transform = 'translateY(0)';
        modalRef.current.style.opacity = '1';

        // Remove transition after animation
        setTimeout(() => {
          if (modalRef.current) {
            modalRef.current.style.transition = '';
          }
        }, 300);
      }

      isDragging = false;
    };

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);

      // 원래 포커스 복원
      if (previousFocus) {
        previousFocus.focus();
      }
    };
  }, [isOpen, close]);

  if (!isOpen || !contentId) return null;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="comments-backdrop"
        className="fixed inset-0 z-[1200] bg-black/20 backdrop-blur-sm pointer-events-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.15,
          ease: 'easeOut',
        }}
        onClick={() => close('backdrop')}
      />

      {/* Wrapper (no events) */}
      <motion.div
        key="comments-wrapper"
        className="fixed inset-0 z-[1201] flex items-end justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.18,
          ease: 'easeOut',
        }}
      >
        {/* Panel (receives events) */}
        <motion.div
          ref={modalRef}
          className="relative z-[1202] pointer-events-auto bg-zinc-900 shadow-2xl max-h-[70vh] w-full sm:max-w-4xl lg:max-w-6xl mx-auto flex flex-col rounded-t-2xl"
          style={{ willChange: 'transform, opacity' }}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 25,
            mass: 0.6,
            duration: 0.25,
          }}
          layout
          onClick={(e) => e.stopPropagation()}
          onFocus={(e) => {
            console.log('Sheet focused:', e.target);
          }}
          tabIndex={-1}
        >
          {/* 기존 헤더 스타일 그대로 */}
          <div
            data-swipe-handle
            className="bg-zinc-900 flex-shrink-0 px-4 py-4 border-b border-zinc-700/30 cursor-grab active:cursor-grabbing"
            onClick={() => close('button')}
          >
            {/* 기존 스와이프 인디케이터 */}
            <div className="flex justify-center mb-4">
              <div className="w-10 h-1 bg-zinc-500 rounded-full"></div>
            </div>

            {/* 기존 헤더 콘텐츠 */}
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-bold text-white">{t('comments.title')}</h2>
                <span className="text-sm text-zinc-300 bg-zinc-700/50 px-3 py-1 rounded-full">
                  {/* 댓글 수는 CommentSection에서 표시됨 */}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  close('button');
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800/80 hover:bg-zinc-700/80 transition-all duration-200 group touch-manipulation active:scale-95"
                aria-label={t('comments.close')}
              >
                <MdClose className="w-6 h-6 text-zinc-300 group-hover:text-white" />
              </button>
            </div>
          </div>

          {/* 기존 바디 스타일 그대로 */}
          <div className="flex-1 min-h-0 p-0 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <CommentsBody contentId={contentId} showHeader={false} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
