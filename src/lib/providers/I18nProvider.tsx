'use client';

import React, { useEffect } from 'react';

import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n/config';

interface I18nProviderProps {
  children: React.ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  useEffect(() => {
    // Initialize i18n configuration on client side
    if (typeof window !== 'undefined' && !i18n.isInitialized) {
      // Any client-side i18n initialization can go here
      console.log('[I18n] Initialized with language:', i18n.language);
    }
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
};