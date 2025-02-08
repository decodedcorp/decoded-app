'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils/style';
import { useLocaleContext } from '@/lib/contexts/locale-context';
import type { StatusType, StatusMessageKey } from './utils/types';
import { statusConfig, ANIMATION_DURATION, buttonStyles } from './utils/config';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: StatusType;
  messageKey?: StatusMessageKey;
  title?: string;
  message?: string;
}

export function StatusModal({
  isOpen,
  onClose,
  type,
  messageKey,
  title: customTitle,
  message: customMessage,
}: StatusModalProps) {
  const { t } = useLocaleContext();
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { icon: Icon, className, bgClassName } = statusConfig[type];

  const { title, message } = messageKey
    ? {
        title: (t.common.status.messages[type] as any)[messageKey]?.title ?? t.common.status[type],
        message: (t.common.status.messages[type] as any)[messageKey]?.message ?? '',
      }
    : {
        title: customTitle ?? t.common.status[type],
        message: customMessage ?? '',
      };

  const handleClose = useCallback(() => {
    setIsClosing(true);
    const timer = setTimeout(() => {
      onClose();
    }, ANIMATION_DURATION);
    return () => clearTimeout(timer);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('keydown', handleEscKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed right-4 top-20 z-50">
      <div
        ref={modalRef}
        className={cn(
          'w-80 rounded-xl p-4 shadow-lg border border-white/5',
          'transform transition-all duration-300',
          bgClassName,
          isClosing
            ? 'translate-x-2 opacity-0'
            : 'translate-x-0 opacity-100'
        )}
      >
        <div className="flex items-start space-x-3">
          <Icon className={cn('h-5 w-5 shrink-0', className)} />
          <div className="flex-1 min-w-0">
            <h3 className={cn('text-sm font-medium text-white', className)}>
              {title}
            </h3>
            <p className="mt-1 text-sm text-gray-300 break-words">{message}</p>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleClose}
            className={cn(
              buttonStyles.base,
              buttonStyles[type]
            )}
          >
            {t.common.actions.confirm}
          </button>
        </div>
      </div>
    </div>
  );
} 