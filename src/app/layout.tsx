import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/shared/components/Header';
import { AuthProvider } from '@/domains/auth/components/AuthProvider';
import { initializeApiConfig } from '@/api/config';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Decoded App',
  description: 'A modern web application',
};

// API 설정 초기화
initializeApiConfig();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Kinetic Typography 폰트들 */}
        <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/longsile" />
        <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/thegoodmonolith" />
        <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/pp-neue-montreal" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
