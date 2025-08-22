import React from 'react';

import { QueryProvider } from '../lib/providers/QueryProvider';
import { ToastProvider } from '../lib/providers/ToastProvider';
import { Header } from '../shared/components/Header';
import { AuthInitializer } from '../domains/auth/components/AuthInitializer';

import '../styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body suppressHydrationWarning={true}>
        <QueryProvider>
          <ToastProvider>
            <AuthInitializer />
            <Header />
            {children}
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
