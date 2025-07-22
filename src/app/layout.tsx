import '../styles/globals.css';
import { Header } from '../shared/components/Header';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main
          className="
            w-full min-h-screen
            pt-[60px] md:pt-[72px]
            px-4 md:px-8
            bg-mainBackground
          "
        >
          {children}
        </main>
      </body>
    </html>
  );
}
