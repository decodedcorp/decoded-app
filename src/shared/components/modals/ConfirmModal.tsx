import React from 'react';
import { SimpleModal } from '@/lib/components/ui/modal/SimpleModal';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'danger' | 'primary';
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  confirmVariant = 'danger',
  isLoading = false,
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const confirmButtonClasses =
    confirmVariant === 'danger'
      ? 'bg-red-600 hover:bg-red-700 text-white'
      : 'bg-blue-600 hover:bg-blue-700 text-white';

  return (
    <SimpleModal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        {/* Title */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>

        {/* Message */}
        <div className="mb-6">
          <p className="text-zinc-300 leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-zinc-300 hover:text-white transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${confirmButtonClasses}`}
          >
            {isLoading ? '처리 중...' : confirmText}
          </button>
        </div>
      </div>
    </SimpleModal>
  );
}
