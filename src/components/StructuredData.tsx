import { ContentItem } from '@/lib/types/contentTypes';

interface StructuredDataProps {
  content: ContentItem;
  channelId: string;
}

/**
 * JSON-LD 구조화된 데이터 컴포넌트
 */
export function StructuredData({ content, channelId }: StructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": content.title,
    "description": content.aiSummary ?? content.description ?? '',
    "image": content.thumbnailUrl,
    "author": content.author ? {
      "@type": "Person",
      "name": content.author
    } : undefined,
    "publisher": {
      "@type": "Organization",
      "name": "Decoded",
      "logo": {
        "@type": "ImageObject",
        "url": "/logo.png"
      }
    },
    "datePublished": content.date,
    "dateModified": content.date,
    "url": `/channels/${channelId}/contents/${content.id}`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `/channels/${channelId}/contents/${content.id}`
    },
    "keywords": content.aiMetadata?.tags?.join(', '),
    "articleSection": "Technology",
    "inLanguage": "ko-KR"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
}