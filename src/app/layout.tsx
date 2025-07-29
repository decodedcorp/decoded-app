'use client';

import React, { useEffect } from 'react';
import { QueryProvider } from '../lib/providers/QueryProvider';
import { useAuthLifecycle } from '../domains/auth/hooks/useAuthLifecycle';
import { configureApi } from '../api/config';
import { Header } from '../shared/components/Header';
import { TokenDebugger } from '../domains/auth/components/TokenDebugger';
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
          <Header />
          {children}
          <TokenDebugger />
        </QueryProvider>
      </body>
    </html>
  );
}
