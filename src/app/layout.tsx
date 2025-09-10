import React from 'react';

import { QueryProvider } from '../lib/providers/QueryProvider';
import { ToastProvider } from '../lib/providers/ToastProvider';
import { I18nProvider } from '../lib/providers/I18nProvider';
import { Header } from '../shared/components/Header';
import { MainLayout } from '../shared/components/MainLayout';
import { AuthInitializer } from '../domains/auth/components/AuthInitializer';

import '../styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body suppressHydrationWarning={true}>
        <I18nProvider>
          <QueryProvider>
            <ToastProvider>
              <AuthInitializer />
              <Header />
              <MainLayout>
                {children}
              </MainLayout>
            </ToastProvider>
          </QueryProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
