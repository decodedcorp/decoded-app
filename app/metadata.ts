import { Metadata, Viewport } from "next";

const SITE_URL = "https://decoded.style";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const commonMetadata = {
  metadataBase: new URL(SITE_URL),
  authors: [{ name: "DECODED" }],
  creator: "DECODED",
  publisher: "DECODED",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
    naver: "naver-site-verification-code",
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      ko: `${SITE_URL}`,
      en: `${SITE_URL}`,
    },
  },
};

export const koMetadata: Metadata = {
  ...commonMetadata,
  title: {
    default: "DECODED - 아이템 정보 공유 플랫폼",
    template: "%s | DECODED",
  },
  description:
    "궁금한 아이템을 요청하고 공유하세요. 실시간으로 아이템을 요청하고 정보를 얻을 수 있습니다.",
  keywords: [
    "아이템",
    "패션",
    "아이돌",
    "컬처",
    "아이템 정보 공유",
    "패션 정보",
    "스타일 공유",
    "패션 커뮤니티",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    title: "DECODED - 아이템 정보 공유 플랫폼",
    description: "궁금한 아이템을 요청하고 공유하세요",
    siteName: "DECODED",
    images: [
      {
        url: `${SITE_URL}/images/decoded.png`,
        width: 600,
        height: 140,
        alt: "DECODED 로고 이미지",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DECODED - 아이템 정보 공유 플랫폼",
    description: "궁금한 아이템을 요청하고 공유하세요",
    images: [`${SITE_URL}/images/decoded.png`],
  },
} as const;

export const enMetadata: Metadata = {
  ...commonMetadata,
  title: {
    default: "DECODED - Item Information Sharing Platform",
    template: "%s | DECODED",
  },
  description:
    "Request and share items you're curious about. Request items in real-time and get information.",
  keywords: [
    "fashion",
    "style",
    "item search",
    "fashion information",
    "style sharing",
    "fashion community",
    "K-fashion",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "DECODED - Item Information Sharing Platform",
    description: "Request and share items you're curious about",
    siteName: "DECODED",
    images: [
      {
        url: `${SITE_URL}/images/decoded.png`,
        width: 600,
        height: 140,
        alt: "DECODED Logo Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DECODED - Item Information Sharing Platform",
    description: "Request and share items you're curious about",
    images: [`${SITE_URL}/images/decoded.png`],
  },
} as const;

// Generate metadata for detail page
export function generateDetailMetadata(
  data: any,
  locale: "ko" | "en" = "ko"
): Metadata {
  const baseMetadata = locale === "ko" ? koMetadata : enMetadata;
  const title =
    data?.name || (locale === "ko" ? "상품 상세" : "Product Detail");
  const description =
    data?.description ||
    (locale === "ko" ? "상품 상세 정보" : "Product Details");
  const imageUrl = data?.imageUrl || "/images/decoded.png";

  return {
    ...baseMetadata,
    title: `${title} | DECODED`,
    description,
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${title} | DECODED`,
      description,
      images: [{ url: imageUrl, width: 600, height: 140, alt: title }],
    },
    twitter: {
      ...baseMetadata.twitter,
      title: `${title} | DECODED`,
      description,
      images: [imageUrl],
    },
  };
}
