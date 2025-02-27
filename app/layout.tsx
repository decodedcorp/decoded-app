import '../styles/globals.css';
import { headers } from 'next/headers';
import { HeaderLayout } from '@/components/Header/HeaderLayout';
import Footer from '@/components/Footer';
import { Providers } from './providers';
import { Locale } from '@/lib/lang/locales';
import { Metadata } from 'next';
import { koMetadata, enMetadata } from './metadata';
import { GoogleRedirectHandler } from '@/components/auth/GoogleRedirectHandler';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const locale = headersList.get('x-locale') || 'ko';

  return locale === 'ko' ? koMetadata : enMetadata;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const locale = headersList.get('x-locale') || 'en';
  const pathname = headersList.get('x-pathname') || '';
  const isCallbackPage = pathname.includes('/auth/callback');

  return (
    <html lang={locale}>
      <head>
        <link 
          rel="preload" 
          href="/fonts/Pretendard-Regular.otf" 
          as="font" 
          type="font/otf" 
          crossOrigin="anonymous" 
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <GoogleRedirectHandler />
        <Providers locale={locale as Locale}>
          {!isCallbackPage && <HeaderLayout />}
          <main className="flex-1">{children}</main>
          {!isCallbackPage && <Footer />}
        </Providers>
      </body>
    </html>
  );
}
