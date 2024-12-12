import '../styles/globals.css';
import type { Metadata } from 'next';
import Header from '@/components/Header/index';
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
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
