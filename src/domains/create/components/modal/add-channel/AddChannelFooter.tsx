'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

interface AddChannelFooterProps {
  onCancel: () => void;
  onCreate: () => void;
  isLoading: boolean;
  canSubmit: boolean;
}

export function AddChannelFooter({
  onCancel,
  onCreate,
  isLoading,
  canSubmit,
}: AddChannelFooterProps) {
  const { t } = useTranslation('common');

  return (
    <div className="flex items-center justify-end space-x-3 p-6 border-t border-zinc-700/50">
      <button
        type="button"
        onClick={onCancel}
        disabled={isLoading}
        className="px-6 py-2.5 rounded-lg bg-zinc-800 text-white font-medium hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t('globalContentUpload.addChannel.footer.cancel')}
      </button>

      <button
        type="button"
        onClick={onCreate}
        disabled={isLoading || !canSubmit}
        className="px-6 py-2.5 rounded-lg bg-zinc-700 text-white font-medium hover:bg-zinc-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>{t('globalContentUpload.addChannel.footer.creating')}</span>
          </>
        ) : (
          <span>{t('globalContentUpload.addChannel.footer.createChannel')}</span>
        )}
      </button>
    </div>
  );
}
