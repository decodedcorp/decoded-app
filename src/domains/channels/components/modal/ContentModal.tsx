'use client';

import React, { useEffect, useRef } from 'react';
import {
  useContentModalStore,
  selectIsContentModalOpen,
  selectSelectedContent,
} from '@/store/contentModalStore';
import { ContentModalHeader } from './ContentModalHeader';
import { ContentModalBody } from './ContentModalBody';
import { ContentModalFooter } from './ContentModalFooter';

export function ContentModal() {
  const isOpen = useContentModalStore(selectIsContentModalOpen);
  const content = useContentModalStore(selectSelectedContent);
  const closeModal = useContentModalStore((state) => state.closeModal);
  const modalRef = useRef<HTMLDivElement>(null);

  // ESC 키와 외부 클릭으로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // 모달이 열릴 때 body 스크롤 방지
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = 'var(--scrollbar-width, 0px)';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // 모달이 닫힐 때 body 스크롤 복원
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen, closeModal]);

  // 스크롤바 너비 계산 (레이아웃 시프트 방지)
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    }
  }, [isOpen]);

  if (!isOpen || !content) return null;

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={closeModal} />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
      >
        <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl max-w-[95vw] w-full max-h-[95vh] overflow-hidden animate-scale-in shadow-2xl">
          <ContentModalHeader content={content} onClose={closeModal} />

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(95vh-200px)]">
            <ContentModalBody content={content} />
          </div>

          <ContentModalFooter content={content} />
        </div>
      </div>
    </>
  );
}
