import { Metadata, Viewport } from 'next';
import { Post } from './types/post';
import { ProcessedImageData } from '@/lib/api/_types/image';
import { getImageDetails } from '@/app/details/utils/hooks/fetchImageDetails';

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
    default: 'DECODED - 아이템 정보 공유 플랫폼',
    template: '%s',
  },
  description:
    '궁금한 아이템을 요청하고 공유하세요. 실시간으로 아이템을 요청하고 정보를 얻을 수 있습니다.',
  keywords: [
    '아이템',
    '패션',
    '아이돌',
    '컬처',
    '아이템 정보 공유',
    '패션 정보',
    '스타일 공유',
    '패션 커뮤니티',
  ],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: SITE_URL,
    title: 'DECODED - 아이템 정보 공유 플랫폼',
    description: '궁금한 아이템을 요청하고 공유하세요',
    siteName: 'DECODED',
    images: [
      {
        url: `${SITE_URL}/images/decoded.png`,
        width: 1200,
        height: 630,
        alt: 'DECODED 로고 이미지',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DECODED - 아이템 정보 공유 플랫폼',
    description: '궁금한 아이템을 요청하고 공유하세요',
    images: [`${SITE_URL}/images/decoded.png`],
  },
} as const;

export const enMetadata: Metadata = {
  ...commonMetadata,
  title: {
    default: 'DECODED - Item Information Sharing Platform',
    template: '%s',
  },
  description:
    "Request and share items you're curious about. Request items in real-time and get information.",
  keywords: [
    'fashion',
    'style',
    'item search',
    'fashion information',
    'style sharing',
    'fashion community',
    'K-fashion',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    title: 'DECODED - Item Information Sharing Platform',
    description: "Request and share items you're curious about",
    siteName: 'DECODED',
    images: [
      {
        url: `${SITE_URL}/images/decoded.png`,
        width: 1200,
        height: 630,
        alt: 'DECODED Logo Image',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DECODED - Item Information Sharing Platform',
    description: "Request and share items you're curious about",
    images: [`${SITE_URL}/images/decoded.png`],
  },
} as const;

export function generateDetailMetadata(
  data: Post | ProcessedImageData,
  locale: 'ko' | 'en' = 'ko'
): Metadata {
  const baseMetadata = locale === 'ko' ? koMetadata : enMetadata;

  // 포스트 제목이 없는 경우 기본값 사용
  const title = data.title || (locale === 'ko' ? '아이템 상세' : 'Item Detail');

  // 포스트 설명이 없는 경우 기본값 사용
  const description =
    data.description ||
    (locale === 'ko'
      ? 'DECODED에서 공유된 아이템 정보를 확인하세요'
      : 'Check out the item information shared on DECODED');

  // 이미지 URL 설정
  const imageUrl = data.doc_id
    ? `https://pub-65bb4012fb354951a2c6139a4b49b717.r2.dev/images/${data.doc_id}.webp`
    : `${SITE_URL}/images/decoded.png`;

  // 현재 페이지 URL 설정
  const currentUrl = data.doc_id
    ? `${SITE_URL}/details-update/${data.doc_id}`
    : SITE_URL;

  return {
    ...baseMetadata,
    title: `${title} | DECODED`,
    description,
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${title} | DECODED`,
      description,
      url: currentUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      ...baseMetadata.twitter,
      title: `${title} | DECODED`,
      description,
      images: [imageUrl],
    },
  };
}

type PageType = 'detail' | 'search' | 'list' | 'default';

interface GenerateMetadataParams {
  pathname: string;
  locale: 'ko' | 'en';
  searchParams?: string;
}

export async function generatePageMetadata({
  pathname,
  locale,
  searchParams,
}: GenerateMetadataParams): Promise<Metadata> {
  const baseMetadata = locale === 'ko' ? koMetadata : enMetadata;

  // 페이지 타입 결정
  const pageType = getPageType(pathname);

  // 페이지 타입별 메타데이터 생성
  switch (pageType) {
    case 'detail':
      return generateDetailPageMetadata(pathname, locale);
    case 'search':
      return generateSearchPageMetadata(searchParams || '', baseMetadata);
    case 'list':
      return generateListPageMetadata(baseMetadata);
    default:
      return baseMetadata;
  }
}

function getPageType(pathname: string): PageType {
  if (pathname.startsWith('/details-update/')) return 'detail';
  if (pathname.startsWith('/search')) return 'search';
  if (pathname.startsWith('/list')) return 'list';
  return 'default';
}

async function generateDetailPageMetadata(
  pathname: string,
  locale: 'ko' | 'en'
): Promise<Metadata> {
  const imageId = pathname.split('/').pop();
  if (!imageId) return koMetadata;

  const imageData = await getImageDetails(imageId);
  if (!imageData) {
    return {
      title: 'Not Found | DECODED',
      description: locale === 'ko' 
        ? '요청하신 페이지를 찾을 수 없습니다.'
        : 'The requested page could not be found.',
    };
  }

  return generateDetailMetadata(imageData, locale);
}

function generateSearchPageMetadata(
  searchParams: string,
  baseMetadata: Metadata
): Metadata {
  const params = new URLSearchParams(searchParams);
  const query = params.get('q') || '';
  
  const title = `${query} 검색 결과 | DECODED`;
  const description = `DECODED에서 "${query}"에 대한 검색 결과를 확인하세요`;

  return {
    ...baseMetadata,
    title,
    description,
    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description,
    },
    twitter: {
      ...baseMetadata.twitter,
      title,
      description,
    },
  };
}

function generateListPageMetadata(baseMetadata: Metadata): Metadata {
  const title = '아이템 목록 | DECODED';
  const description = 'DECODED에서 공유된 아이템 목록을 확인하세요';

  return {
    ...baseMetadata,
    title,
    description,
    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description,
    },
    twitter: {
      ...baseMetadata.twitter,
      title,
      description,
    },
  };
}
