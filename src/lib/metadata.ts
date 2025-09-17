import type { Metadata } from 'next';
import { ContentItem } from '@/lib/types/contentTypes';

/**
 * 콘텐츠 페이지 메타데이터 생성
 */
export function generateContentMetadata(
  content: ContentItem,
  channelId: string
): Metadata {
  const title = `${content.title} | Decoded`;
  const description = content.aiSummary ?? content.description ?? '';
  const imageUrl = content.thumbnailUrl;
  const canonicalUrl = `/channels/${channelId}/contents/${content.id}`;

  return {
    title,
    description: description.slice(0, 160), // 메타 설명 길이 제한
    keywords: content.aiMetadata?.tags?.join(', '),

    // 캐노니컬 & 다국어 (향후 확장)
    alternates: {
      canonical: canonicalUrl,
      // TODO: 다국어 지원 시 추가
      // languages: {
      //   'ko': `/ko${canonicalUrl}`,
      //   'en': `/en${canonicalUrl}`
      // }
    },

    // Open Graph (절대 URL)
    openGraph: {
      title: title.slice(0, 60), // OG 제목 길이 제한
      description: description.slice(0, 200),
      type: 'article',
      url: canonicalUrl,
      images: imageUrl ? [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ] : [],
      siteName: 'Decoded',
      locale: 'ko_KR',
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: title.slice(0, 70), // 트위터 제목 길이 제한
      description: description.slice(0, 200),
      images: imageUrl ? [imageUrl] : [],
      creator: content.author ? `@${content.author}` : undefined,
    },

    // 추가 SEO 설정
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },

    // 기타 메타태그
    other: {
      'article:author': content.author || 'Unknown',
      'article:published_time': content.date || new Date().toISOString(),
      'article:modified_time': content.date || new Date().toISOString(),
      'article:section': 'Technology',
      'article:tag': content.aiMetadata?.tags?.join(',') || '',
    },
  };
}

/**
 * 채널 페이지 메타데이터 생성
 */
export function generateChannelMetadata(
  channelId: string,
  channelName?: string,
  channelDescription?: string
): Metadata {
  const title = channelName ? `${channelName} | Decoded` : 'Channel | Decoded';
  const description = channelDescription ?? `${channelName || 'Channel'} 채널의 콘텐츠를 확인하세요.`;
  const canonicalUrl = `/channels/${channelId}`;

  return {
    title,
    description: description.slice(0, 160),

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title: title.slice(0, 60),
      description: description.slice(0, 200),
      type: 'website',
      url: canonicalUrl,
      siteName: 'Decoded',
      locale: 'ko_KR',
    },

    twitter: {
      card: 'summary',
      title: title.slice(0, 70),
      description: description.slice(0, 200),
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}