import '../styles/globals.css';
import type { Metadata } from 'next';
import { HeaderLayout } from '@/components/Header/HeaderLayout';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'DECODED',
  description: 'Find something tagged',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="flex flex-col min-h-screen">
        <HeaderLayout />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
