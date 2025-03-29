import "../styles/globals.css";
import { headers } from "next/headers";
import { HeaderLayout } from "@/components/Header/HeaderLayout";
import Footer from "@/components/Footer";
import { Providers } from "./providers";
import { Locale } from "@/lib/lang/locales";
import { Metadata } from "next";
import { koMetadata, enMetadata } from "./metadata";
import { GoogleRedirectHandler } from "@/components/auth/GoogleRedirectHandler";
import Script from "next/script";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const locale = headersList.get("x-locale") || "ko";

  return locale === "ko" ? koMetadata : enMetadata;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const locale = headersList.get("x-locale") || "en";
  const pathname = headersList.get("x-pathname") || "";
  const isCallbackPage = pathname.includes("/auth/callback");

  return (
    <html lang={locale}>
      <head>
        <link
          rel="preload"
          href="@/fonts/Pretendard-Regular.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.2/cropper.min.css"
          integrity="sha512-iKnXkfdkKvzKWFOSZaDOfONgJTe3h4y8IQAPdMsGs+mtIXTcgN+PGSkZ/+/IUWRDYkO+IpGkUCoLx+NwR/BCQ=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <GoogleRedirectHandler />
        <Providers locale={locale as Locale}>
          {!isCallbackPage && <HeaderLayout />}
          <main className="flex-1">{children}</main>
          {!isCallbackPage && <Footer />}
        </Providers>

        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.6.0/kakao.min.js"
          strategy="afterInteractive"
          integrity="sha384-6MFdIr0zOira1CHQkedUqJVql0YtcZA1P0nbPrQYJXVJZUkTk/oX4U9GhUIs3/z8"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
