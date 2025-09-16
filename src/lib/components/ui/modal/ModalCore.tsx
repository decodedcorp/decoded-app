'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalCoreProps {
  open: boolean;
  onOpenChange: (open: boolean, reason?: string) => void;
  size?: 'sm' | 'md' | 'wide';
  ariaLabel?: string;
  children: React.ReactNode;
  className?: string;
}

export function ModalCore({
  open,
  onOpenChange,
  size = 'md',
  ariaLabel,
  children,
  className = '',
}: ModalCoreProps) {
  const [mounted, setMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Portal to document.body (상위 레이아웃 영향 차단)
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Scroll lock
  useEffect(() => {
    if (open) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('--scrollbar-width');
    }

    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('--scrollbar-width');
    };
  }, [open]);

  // ESC key handler
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false, 'escape');
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onOpenChange]);

  // Runtime warning for problematic ancestors (development only)
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && open && contentRef.current) {
      let element: HTMLElement | null = contentRef.current.parentElement;

      while (element && element !== document.body) {
        const styles = getComputedStyle(element);

        if (
          styles.transform !== 'none' ||
          styles.filter !== 'none' ||
          styles.perspective !== 'none' ||
          styles.contain.includes('paint') ||
          styles.overflow === 'hidden'
        ) {
          console.warn(
            '[ModalCore] Ancestor creates containing/stacking context:',
            element,
            'This may affect modal positioning or clipping.',
          );
          break;
        }

        element = element.parentElement;
      }
    }
  }, [open]);

  if (!mounted || !open) return null;

  const modal = (
    <div
      className="modal-overlay"
      onClick={() => onOpenChange(false, 'overlay')}
      role="presentation"
    >
      <div
        ref={contentRef}
        className={`modal-content modal-size-${size} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        onClick={(e) => e.stopPropagation()}
        data-modal-size={size}
        data-modal-state="open"
      >
        {children}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
