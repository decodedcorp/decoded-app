import "../styles/globals.css";
import { headers } from "next/headers";
import { HeaderLayout } from "@/components/Header/HeaderLayout";
import Footer from "@/components/Footer";
import { Providers } from "./providers";
import { defaultMetadata } from "./metadata";
import { getLocale } from "@/lib/lang/server/getLocale";

export const metadata = defaultMetadata;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale } = await getLocale();
  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="alternate" hrefLang="ko" href="https://decoded.style" />
        <link rel="alternate" hrefLang="en" href="https://decoded.style/en" />
        <link
          rel="alternate"
          hrefLang="x-default"
          href="https://decoded.style"
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <Providers>
          <HeaderLayout />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
