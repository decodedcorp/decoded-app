'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ModalProps {
  children: React.ReactNode;
  onCloseHref?: string;
  ariaLabel: string;
  className?: string;
}

/**
 * 접근성이 개선된 모달 컴포넌트
 * Intercepting Routes와 함께 사용됨
 */
export function Modal({ children, onCloseHref, ariaLabel, className }: ModalProps) {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // 모달 닫기 함수
  const closeModal = () => {
    if (onCloseHref) {
      router.push(onCloseHref);
    } else {
      router.back();
    }
  };

  // ESC 키 처리
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  // 포커스 관리
  useEffect(() => {
    // 현재 포커스된 요소 저장
    previousFocusRef.current = document.activeElement as HTMLElement;

    // 모달이 열리면 첫 번째 포커스 가능한 요소로 이동
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements?.[0] as HTMLElement;

    // 모달 자체에 포커스 (첫 번째 요소가 없으면)
    if (firstElement) {
      firstElement.focus();
    } else {
      modalRef.current?.focus();
    }

    // cleanup: 원래 포커스 복원
    return () => {
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, []);

  // 배경 스크롤 방지
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // 포커스 트랩 (TAB 키 관리)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={closeModal}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative max-h-[90vh] max-w-7xl w-full mx-4 overflow-auto bg-zinc-900 rounded-2xl shadow-2xl",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-black",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={closeModal}
          className={cn(
            "absolute top-4 right-4 z-10 p-2 rounded-full",
            "bg-black/20 hover:bg-black/40 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
          )}
          aria-label="콘텐츠 닫기"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {children}
      </div>
    </div>
  );
}