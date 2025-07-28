'use client';

import React, { useEffect } from 'react';
import { QueryProvider } from '../lib/providers/QueryProvider';
import { useAuthInit } from '../domains/auth/hooks/useAuthInit';
import { configureApi } from '../api/config';
import { Header } from '../shared/components/Header';
import '../styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Initialize API configuration
  useEffect(() => {
    configureApi();
  }, []);

  // Initialize authentication state
  useAuthInit();

  return (
    <html lang="ko">
      <body>
        <QueryProvider>
          <Header />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
