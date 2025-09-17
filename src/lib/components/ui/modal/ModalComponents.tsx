'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@decoded/ui';
import { useAccessibilityTranslation } from '@/lib/i18n/hooks';

interface ModalHeaderProps {
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export function ModalHeader({ children, onClose, className = '' }: ModalHeaderProps) {
  const a11y = useAccessibilityTranslation();

  return (
    <div
      className={`flex items-center justify-between p-6 border-b border-zinc-700/50 ${className}`}
    >
      <div className="flex-1">{children}</div>
      {onClose && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="ml-4 p-2 hover:bg-zinc-800"
          aria-label={a11y.closeModal()}
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}

interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalBody({ children, className = '' }: ModalBodyProps) {
  return <div className={`flex-1 overflow-y-auto p-6 ${className}`}>{children}</div>;
}

interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalFooter({ children, className = '' }: ModalFooterProps) {
  return (
    <div
      className={`flex items-center justify-end gap-3 p-6 border-t border-zinc-700/50 ${className}`}
    >
      {children}
    </div>
  );
}

// 통합 Modal 컴포넌트
interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean, reason?: string) => void;
  size?: 'sm' | 'md' | 'wide';
  ariaLabel?: string;
  children: React.ReactNode;
}

export function Modal({ open, onOpenChange, size = 'md', ariaLabel, children }: ModalProps) {
  return (
    <div className="modal-core" data-size={size}>
      {children}
    </div>
  );
}
