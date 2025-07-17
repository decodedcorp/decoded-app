import "../../styles/globals.css";
import { headers } from "next/headers";
import { HeaderLayout } from "@/components/Header/HeaderLayout";
import Footer from "@/components/Footer";
import { Providers } from "./providers";
import { Locale } from "@/lib/lang/locales";
import { Metadata } from "next";
import { koMetadata, enMetadata, generateDetailMetadata } from "./metadata";
import { GoogleRedirectHandler } from "@/components/auth/GoogleRedirectHandler";
import Script from "next/script";
import { getImageDetails } from "@/app/details/utils/hooks/fetchImageDetails";
import { SidebarProvider } from '@/lib/contexts/sidebar-context';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const locale = headersList.get("x-locale") || "ko";
  const pathname = headersList.get("x-pathname") || "";
  const searchParams = headersList.get("x-search-params") || "";

  // 기본 메타데이터
  const baseMetadata = locale === "ko" ? koMetadata : enMetadata;

  // 상세 페이지인 경우
  if (pathname.startsWith('/details/')) {
    const imageId = pathname.split('/').pop();
    if (imageId) {
      const imageData = await getImageDetails(imageId);
      if (imageData) {
        return generateDetailMetadata(imageData, locale as 'ko' | 'en');
      }
    }
  }

  // 검색 페이지인 경우
  if (pathname.startsWith('/search')) {
    const params = new URLSearchParams(searchParams);
    const query = params.get('q') || '';
    
    return {
      ...baseMetadata,
      title: `${query} 검색 결과 | DECODED`,
      description: `DECODED에서 "${query}"에 대한 검색 결과를 확인하세요`,
      openGraph: {
        ...baseMetadata.openGraph,
        title: `${query} 검색 결과 | DECODED`,
        description: `DECODED에서 "${query}"에 대한 검색 결과를 확인하세요`,
      },
      twitter: {
        ...baseMetadata.twitter,
        title: `${query} 검색 결과 | DECODED`,
        description: `DECODED에서 "${query}"에 대한 검색 결과를 확인하세요`,
      },
    };
  }

  // 목록 페이지인 경우
  if (pathname.startsWith('/list')) {
    return {
      ...baseMetadata,
      title: '아이템 목록 | DECODED',
      description: 'DECODED에서 공유된 아이템 목록을 확인하세요',
      openGraph: {
        ...baseMetadata.openGraph,
        title: '아이템 목록 | DECODED',
        description: 'DECODED에서 공유된 아이템 목록을 확인하세요',
      },
      twitter: {
        ...baseMetadata.twitter,
        title: '아이템 목록 | DECODED',
        description: 'DECODED에서 공유된 아이템 목록을 확인하세요',
      },
    };
  }

  // 기본 메타데이터 반환
  return baseMetadata;
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
        <SidebarProvider>
          <Providers locale={locale as Locale}>
            {/* {!isCallbackPage && <HeaderLayout />} */}
            <main className="flex-1">{children}</main>
            {/* {!isCallbackPage && <Footer />} */}
          </Providers>
        </SidebarProvider>

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
