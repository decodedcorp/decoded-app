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
  onFeedbackSubmit?: (feedback: string) => void;
  isLoading?: boolean;
  onLoginRequired?: () => void;
}

export function StatusModal({
  isOpen,
  onClose,
  type,
  messageKey,
  title: customTitle,
  message: customMessage,
  onFeedbackSubmit,
  isLoading = false,
  onLoginRequired,
}: StatusModalProps) {
  const { t } = useLocaleContext();
  const [isClosing, setIsClosing] = useState(false);
  const [feedback, setFeedback] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const { icon: Icon, className, bgClassName } = statusConfig[type];

  const { title, message } = messageKey && type !== 'loading'
    ? {
        title: (t.common.status.messages[type as keyof typeof t.common.status.messages] as any)?.[messageKey]?.title ?? t.common.status[type],
        message: (t.common.status.messages[type as keyof typeof t.common.status.messages] as any)?.[messageKey]?.message ?? '',
      }
    : {
        title: customTitle ?? t.common.status[type],
        message: customMessage ?? '',
      };

  const handleClose = useCallback(() => {
    setIsClosing(true);
    const timer = setTimeout(() => {
      onClose();
      setFeedback('');
      if (type === 'warning' && messageKey === 'login' && onLoginRequired) {
        onLoginRequired();
      }
    }, ANIMATION_DURATION);
    return () => clearTimeout(timer);
  }, [onClose, type, messageKey, onLoginRequired]);

  const handleSubmit = () => {
    if (feedback.trim() && onFeedbackSubmit) {
      onFeedbackSubmit(feedback);
    }
    handleClose();
  };

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
    <div className={cn(
      'fixed z-[1000000]',
      'top-4 md:top-20',
      'left-0 right-0 md:left-auto',
      'md:right-4',
      'px-4 md:p-0',
      'flex md:block justify-center',
    )}>
      <div
        ref={modalRef}
        className={cn(
          'w-full md:w-80',
          'max-w-sm',
          'p-4 shadow-lg border-2 border-white/20',
          'transform transition-all duration-300',
          'rounded-xl',
          bgClassName,
          isClosing
            ? 'md:translate-x-2 -translate-y-full md:translate-y-0 opacity-0'
            : 'md:translate-x-0 translate-y-0 opacity-100'
        )}
        style={{ backgroundColor: 'rgba(0, 0, 0, 1)' }}
      >
        <div className="flex items-start space-x-3">
          {type === 'loading' ? (
            <>
              <div className="animate-spin h-5 w-5 shrink-0">
                <svg className="text-[#EAFD66]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={cn('text-sm font-medium text-white', className)}>
                  {title}
                </h3>
                <p className="mt-1 text-sm text-gray-300 break-words">
                  잠시만 기다려주세요...
                </p>
              </div>
            </>
          ) : (
            <>
              <Icon className={cn('h-5 w-5 shrink-0', className)} />
              <div className="flex-1 min-w-0">
                <h3 className={cn('text-sm font-medium text-white', className)}>
                  {title}
                </h3>
                <p className="mt-1 text-sm text-gray-300 break-words">{message}</p>
              </div>
            </>
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={type === 'error' ? handleSubmit : handleClose}
            className={cn(
              buttonStyles.base,
              buttonStyles[type]
            )}
          >
            {type === 'error' ? '피드백 보내기' : t.common.actions.confirm}
          </button>
        </div>
      </div>
    </div>
  );
} 