'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils/style';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useLocaleContext } from '@/lib/contexts/locale-context';

export type StatusType = 'success' | 'error' | 'warning';

export type StatusMessageKey = 
  | 'request'
  | 'provide'
  | 'save'
  | 'default'
  | 'unsavedChanges'
  | 'delete'
  | 'login';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: StatusType;
  messageKey?: StatusMessageKey;
  title?: string;
  message?: string;
}

const statusConfig = {
  success: {
    icon: CheckCircle,
    className: 'text-[#EAFD66]',
    bgClassName: 'bg-[#1f210e]',
  },
  error: {
    icon: XCircle,
    className: 'text-red-500',
    bgClassName: 'bg-red-500/10',
  },
  warning: {
    icon: AlertCircle,
    className: 'text-yellow-500',
    bgClassName: 'bg-yellow-500/10',
  },
} as const;

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
    }, 300);
    return () => clearTimeout(timer);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  // ESC 키 핸들러
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isOpen, handleClose]);

  // 외부 클릭 핸들러
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
              'rounded-lg px-3 py-1.5 text-xs font-medium',
              'transform transition-colors duration-200',
              type === 'success' && 'bg-[#EAFD66] text-black hover:bg-[#d9ec55]',
              type === 'error' && 'bg-red-500/20 text-red-500 hover:bg-red-500/30',
              type === 'warning' && 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30'
            )}
          >
            {t.common.actions.confirm}
          </button>
        </div>
      </div>
    </div>
  );
} 