import React from 'react';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

import { QueryProvider } from '../lib/providers/QueryProvider';
import { ToastProvider } from '../lib/providers/ToastProvider';
import { I18nProvider } from '../lib/providers/I18nProvider';
import { Header } from '../shared/components/Header';
import { MainLayout } from '../shared/components/MainLayout';
import { AuthInitializer } from '../domains/auth/components/AuthInitializer';
import { getServerTheme } from '../lib/theme-utils';

import '../styles/design-tokens.css';
import '../styles/design-alias.css';
import '../styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Decoded App',
  description: 'AI-powered content discovery and curation platform',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
  },
  themeColor: '#000000',
  colorScheme: 'light dark',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Decoded',
  },
};

export default async function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  // Get theme from cookies for SSR (prevents FOUC)
  const cookieStore = await cookies();
  const cookieTheme = cookieStore.get('theme')?.value;
  const theme = getServerTheme(cookieTheme);

  return (
    <html lang="ko" data-theme={theme}>
      <body suppressHydrationWarning={true}>
        <I18nProvider>
          <QueryProvider>
            <ToastProvider>
              <AuthInitializer />
              <Header />
              <MainLayout>{children}</MainLayout>
              {/* Modal slot for intercepting routes */}
              {modal}
            </ToastProvider>
          </QueryProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
