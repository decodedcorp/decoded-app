import "../styles/globals.css";
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
import { cache } from "react";
import { notFound } from "next/navigation";

// 메타데이터 생성 함수를 캐시화하여 성능 개선
const getCachedImageDetails = cache(async (imageId: string) => {
  try {
    return await getImageDetails(imageId);
  } catch (error) {
    console.error(`Failed to fetch image details for ${imageId}:`, error);
    return null;
  }
});

// 메타데이터 생성 최적화
export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const locale = headersList.get("x-locale") || "ko";
  const pathname = headersList.get("x-pathname") || "";
  const searchParams = headersList.get("x-search-params") || "";

  // 기본 메타데이터 선택 (조건부 최적화)
  const baseMetadata = locale === "ko" ? koMetadata : enMetadata;

  // 상세 페이지 메타데이터 처리 (캐시 적용)
  if (pathname.startsWith('/details/')) {
    const imageId = pathname.split('/').pop();
    if (imageId && imageId !== 'undefined' && imageId !== 'null') {
      try {
        const imageData = await getCachedImageDetails(imageId);
        if (imageData) {
          return generateDetailMetadata(imageData, locale as 'ko' | 'en');
        }
      } catch (error) {
        // 메타데이터 생성 실패 시 기본 메타데이터 사용
        console.warn(`Metadata generation failed for ${imageId}, using default`);
      }
    }
  }

  // 검색 페이지 메타데이터 (최적화된 문자열 처리)
  if (pathname.startsWith('/search')) {
    const params = new URLSearchParams(searchParams);
    const query = params.get('q')?.trim() || '';
    
    if (query) {
      const searchTitle = `${query} 검색 결과 | DECODED`;
      const searchDescription = `DECODED에서 "${query}"에 대한 검색 결과를 확인하세요`;
      
      return {
        ...baseMetadata,
        title: searchTitle,
        description: searchDescription,
        openGraph: {
          ...baseMetadata.openGraph,
          title: searchTitle,
          description: searchDescription,
        },
        twitter: {
          ...baseMetadata.twitter,
          title: searchTitle,
          description: searchDescription,
        },
      };
    }
  }

  // 목록 페이지 메타데이터 (정적 최적화)
  if (pathname.startsWith('/list')) {
    const listMetadata = {
      title: '아이템 목록 | DECODED',
      description: 'DECODED에서 공유된 아이템 목록을 확인하세요',
    };

    return {
      ...baseMetadata,
      ...listMetadata,
      openGraph: {
        ...baseMetadata.openGraph,
        ...listMetadata,
      },
      twitter: {
        ...baseMetadata.twitter,
        ...listMetadata,
      },
    };
  }

  // 기본 메타데이터 반환
  return baseMetadata;
}

// 정적 폰트 리소스 정의 (최적화)
const fontPreloadLinks = [
  {
    rel: "preload" as const,
    href: "@/fonts/Pretendard-Regular.otf",
    as: "font" as const,
    type: "font/otf",
    crossOrigin: "anonymous" as const,
  },
];

// 외부 CSS 리소스 정의 (최적화)
const externalStyles = [
  {
    rel: "stylesheet",
    href: "https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.2/cropper.min.css",
    integrity: "sha512-iKnXkfdkKvzKWFOSZaDOfONgJTe3h4y8IQAPdMsGs+mtIXTcgN+PGSkZ/+/IUWRDYkO+IpGkUCoLx+NwR/BCQ==",
    crossOrigin: "anonymous" as const,
    referrerPolicy: "no-referrer" as const,
  },
];

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const headersList = await headers();
  const locale = headersList.get("x-locale") || "en";
  const pathname = headersList.get("x-pathname") || "";
  
  // 조건부 렌더링 최적화
  const isCallbackPage = pathname.includes("/auth/callback");
  const shouldShowHeaderFooter = !isCallbackPage;

  return (
    <html lang={locale}>
      <head>
        {/* 최적화된 폰트 프리로딩 */}
        {fontPreloadLinks.map((link, index) => (
          <link key={index} {...link} />
        ))}
        
        {/* 최적화된 외부 스타일시트 로딩 */}
        {externalStyles.map((style, index) => (
          <link key={index} {...style} />
        ))}
      </head>
      
      <body className="flex flex-col min-h-screen">
        {/* 조건부 컴포넌트 렌더링 */}
        <GoogleRedirectHandler />
        
        <Providers locale={locale as Locale}>
          {/* 헤더를 조건부로만 렌더링 */}
          {shouldShowHeaderFooter && <HeaderLayout />}
          
          <main className="flex-1">
            {children}
          </main>
          
          {/* 푸터를 조건부로만 렌더링 */}
          {shouldShowHeaderFooter && <Footer />}
        </Providers>

        {/* 최적화된 외부 스크립트 로딩 */}
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