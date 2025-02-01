import { Metadata, Viewport } from 'next';

const SITE_URL = 'https://decoded.style';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

const commonMetadata = {
  metadataBase: new URL(SITE_URL),
  authors: [{ name: 'DECODED' }],
  creator: 'DECODED',
  publisher: 'DECODED',
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
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
    naver: 'naver-site-verification-code',
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
    default: 'DECODED - 패션 아이템 검색 플랫폼',
    template: '%s | DECODED',
  },
  description:
    '궁금한 패션 아이템을 찾고 공유하세요. 실시간으로 아이템을 요청하고 정보를 얻을 수 있습니다.',
  keywords: [
    '패션',
    '스타일',
    '아이템 검색',
    '패션 정보',
    '스타일 공유',
    '패션 커뮤니티',
    'K-fashion',
  ],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: SITE_URL,
    title: 'DECODED - 패션 아이템 검색 플랫폼',
    description: '궁금한 패션 아이템을 찾고 공유하세요',
    siteName: 'DECODED',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DECODED 메인 이미지',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DECODED - 패션 아이템 검색 플랫폼',
    description: '궁금한 패션 아이템을 찾고 공유하세요',
    images: ['/og-image.png'],
  },
} as const;

export const enMetadata: Metadata = {
  ...commonMetadata,
  title: {
    default: 'DECODED - Fashion Item Search Platform',
    template: '%s | DECODED',
  },
  description:
    'Discover and share fashion items. Get real-time information about items you are interested in.',
  keywords: [
    'fashion',
    'style',
    'item search',
    'fashion info',
    'style sharing',
    'fashion community',
    'K-fashion',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${SITE_URL}/en`,
    title: 'DECODED - Fashion Item Search Platform',
    description: 'Discover and share fashion items',
    siteName: 'DECODED',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DECODED Main Image',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DECODED - Fashion Item Search Platform',
    description: 'Discover and share fashion items',
    images: ['/og-image.png'],
  },
} as const;

// Generate metadata for detail page
export function generateDetailMetadata(
  data: any,
  locale: 'ko' | 'en' = 'ko'
): Metadata {
  const baseMetadata = locale === 'ko' ? koMetadata : enMetadata;
  const title =
    data?.name || (locale === 'ko' ? '상품 상세' : 'Product Detail');
  const description =
    data?.description ||
    (locale === 'ko' ? '상품 상세 정보' : 'Product Details');
  const imageUrl = data?.imageUrl || '/og-image.png';

  return {
    ...baseMetadata,
    title: `${title} | DECODED`,
    description,
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${title} | DECODED`,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      ...baseMetadata.twitter,
      title: `${title} | DECODED`,
      description,
      images: [imageUrl],
    },
  };
}
