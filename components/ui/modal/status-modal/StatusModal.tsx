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
}

export function StatusModal({
  isOpen,
  onClose,
  type,
  messageKey,
  title: customTitle,
  message: customMessage,
  onFeedbackSubmit,
}: StatusModalProps) {
  const { t } = useLocaleContext();
  const [isClosing, setIsClosing] = useState(false);
  const [feedback, setFeedback] = useState('');
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
      setFeedback('');
    }, ANIMATION_DURATION);
    return () => clearTimeout(timer);
  }, [onClose]);

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
            
            {type === 'error' && (
              <div className="mt-3">
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="문제 상황에 대해 자세히 알려주세요"
                  className={cn(
                    'w-full px-3 py-2 text-sm rounded-lg',
                    'bg-black/20 border border-white/10',
                    'placeholder-gray-500 text-gray-300',
                    'focus:outline-none focus:border-white/20',
                    'resize-none'
                  )}
                  rows={3}
                />
              </div>
            )}
          </div>
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