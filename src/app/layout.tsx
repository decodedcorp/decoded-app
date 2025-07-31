'use client';

import React, { useEffect } from 'react';
import { QueryProvider } from '../lib/providers/QueryProvider';
import { ToastProvider } from '../lib/providers/ToastProvider';
import { useAuthLifecycle } from '../domains/auth/hooks/useAuthLifecycle';
import { configureApi } from '../api/config';
import { Header } from '../shared/components/Header';

import '../styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Initialize API configuration (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      configureApi();
    }
  }, []);

  // Initialize authentication lifecycle (init, sync, token monitoring)
  useAuthLifecycle();

  return (
    <html lang="ko">
      <body>
        <QueryProvider>
          <ToastProvider>
            <Header />
            {children}
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
