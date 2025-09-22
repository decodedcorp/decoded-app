'use client';

import React, { useEffect, useRef } from 'react';

// Removed modal imports - using custom implementation
import { ContentItem } from '@/lib/types/content';
import { CommentSection } from '@/domains/comments/components/CommentSection';
import { useTranslation } from 'react-i18next';
import { MdClose, MdKeyboardArrowDown } from 'react-icons/md';

interface MobileCommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: ContentItem;
}

export function MobileCommentsModal({ isOpen, onClose, content }: MobileCommentsModalProps) {
  const { t } = useTranslation('content');
  const modalRef = useRef<HTMLDivElement>(null);

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  // Handle ESC key and swipe down to close gesture
  useEffect(() => {
    if (!isOpen) return;

    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

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

      // Only allow downward swipe
      if (deltaY > 0 && modalRef.current) {
        const translateY = Math.min(deltaY * 0.8, 150);
        const opacity = Math.max(0.3, 1 - translateY / 200);
        modalRef.current.style.transform = `translateY(${translateY}px)`;
        modalRef.current.style.opacity = `${opacity}`;
      }
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;

      const deltaY = currentY - startY;

      // If swiped down more than 80px, close the modal
      if (deltaY > 80) {
        onClose();
      } else if (modalRef.current) {
        // Reset position with smooth animation
        modalRef.current.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
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
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[var(--z-modal-root)] flex items-end justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className="relative bg-zinc-900 shadow-2xl max-h-[70vh] w-full sm:max-w-4xl lg:max-w-6xl mx-auto flex flex-col rounded-t-2xl transform transition-transform duration-300 ease-out border-0 p-0 z-[var(--z-modal)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with swipe handle */}
        <div
          data-swipe-handle
          className="bg-zinc-900 flex-shrink-0 px-4 py-4 border-b border-zinc-700/30 cursor-grab active:cursor-grabbing"
        >
          {/* Swipe indicator */}
          <div className="flex justify-center mb-4">
            <div className="w-10 h-1 bg-zinc-500 rounded-full"></div>
          </div>

          {/* Header content */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-white">{t('comments.title')}</h2>
              <span className="text-sm text-zinc-300 bg-zinc-700/50 px-3 py-1 rounded-full">
                {(content as any).comments_count || 0}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
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

        {/* Body with optimized scrolling */}
        <div className="flex-1 min-h-0 p-0 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <CommentSection contentId={String(content.id)} showHeader={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
