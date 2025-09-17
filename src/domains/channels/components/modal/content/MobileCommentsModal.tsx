'use client';

import React, { useEffect, useRef } from 'react';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalClose,
} from '@/lib/components/ui/modal';
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

  // Handle swipe down to close gesture
  useEffect(() => {
    if (!isOpen) return;

    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      isDragging = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      
      currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;
      
      // Only allow downward swipe
      if (deltaY > 0 && modalRef.current) {
        const translateY = Math.min(deltaY * 0.5, 100);
        modalRef.current.style.transform = `translateY(${translateY}px)`;
        modalRef.current.style.opacity = `${1 - translateY / 200}`;
      }
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;
      
      const deltaY = currentY - startY;
      
      // If swiped down more than 100px, close the modal
      if (deltaY > 100) {
        onClose();
      } else if (modalRef.current) {
        // Reset position
        modalRef.current.style.transform = 'translateY(0)';
        modalRef.current.style.opacity = '1';
      }
      
      isDragging = false;
    };

    const modalElement = modalRef.current;
    if (modalElement) {
      modalElement.addEventListener('touchstart', handleTouchStart, { passive: true });
      modalElement.addEventListener('touchmove', handleTouchMove, { passive: true });
      modalElement.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      if (modalElement) {
        modalElement.removeEventListener('touchstart', handleTouchStart);
        modalElement.removeEventListener('touchmove', handleTouchMove);
        modalElement.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [isOpen, onClose]);

  return (
    <Modal
      open={isOpen}
      onOpenChange={handleOpenChange}
      variant="sheet-bottom"
      size="auto"
      dismissible={true}
      ariaLabel={t('comments.title')}
    >
      <ModalOverlay className="modal-overlay--heavy">
        <div 
          ref={modalRef}
          className="bg-zinc-900 border-t border-zinc-700/50 shadow-2xl max-h-[85vh] flex flex-col rounded-t-2xl"
        >
          {/* Header with improved close button */}
          <ModalHeader className="bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-700/30 flex-shrink-0">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-3">
                <h2 className="text-lg font-semibold text-white">{t('comments.title')}</h2>
                <span className="text-sm text-zinc-400 bg-zinc-800/50 px-2 py-1 rounded-full">
                  {(content as any).comments_count || 0}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={onClose}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800/50 hover:bg-zinc-700/50 transition-all duration-200 group"
                  aria-label={t('comments.close')}
                >
                  <MdClose className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </button>
              </div>
            </div>
            
            {/* Swipe indicator */}
            <div className="flex justify-center mt-2">
              <div className="w-8 h-1 bg-zinc-600 rounded-full"></div>
            </div>
          </ModalHeader>

          {/* Body with optimized scrolling */}
          <div className="flex-1 min-h-0 p-0 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <CommentSection contentId={String(content.id)} showHeader={false} />
            </div>
          </div>
        </div>
      </ModalOverlay>
    </Modal>
  );
}
