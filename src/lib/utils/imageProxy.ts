/**
 * 외부 이미지 URL을 프록시 URL로 변환
 * @param imageUrl 외부 이미지 URL
 * @returns 프록시 URL
 */
export function getProxiedImageUrl(imageUrl: string): string {
  if (!imageUrl) return '';
  
  // 이미 프록시 URL인 경우 그대로 반환
  if (imageUrl.startsWith('/api/image-proxy')) {
    return imageUrl;
  }

  // 로컬 이미지인 경우 프록시 사용하지 않음
  if (imageUrl.startsWith('/') || imageUrl.startsWith('./') || imageUrl.startsWith('../')) {
    return imageUrl;
  }

  // 현재 도메인의 이미지인 경우 프록시 사용하지 않음
  if (typeof window !== 'undefined') {
    try {
      const url = new URL(imageUrl);
      if (url.hostname === window.location.hostname) {
        return imageUrl;
      }
    } catch {
      // URL 파싱 실패 시 상대 경로로 간주
      return imageUrl;
    }
  }

  // HTTPS 이미지이고 CORS가 허용될 가능성이 높은 도메인들
  const corsAllowedDomains = [
    'images.unsplash.com',
    'via.placeholder.com',
    'picsum.photos',
    'avatars.githubusercontent.com',
    'cdn.pixabay.com',
    'images.pexels.com',
  ];

  try {
    const url = new URL(imageUrl);
    // HTTPS이고 CORS 허용 도메인인 경우 직접 사용
    if (url.protocol === 'https:' && corsAllowedDomains.some(domain => url.hostname === domain)) {
      return imageUrl;
    }
  } catch {
    // URL 파싱 실패 시 프록시 사용
  }

  // 외부 URL을 프록시로 변환
  return `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
}

/**
 * 여러 이미지 URL을 프록시 URL로 변환
 * @param imageUrls 이미지 URL 배열
 * @returns 프록시 URL 배열
 */
export function getProxiedImageUrls(imageUrls: string[]): string[] {
  return imageUrls.map(url => getProxiedImageUrl(url));
}

/**
 * 이미지 URL이 외부 도메인인지 확인
 * @param imageUrl 이미지 URL
 * @returns 외부 도메인 여부
 */
export function isExternalImageUrl(imageUrl: string): boolean {
  if (!imageUrl) return false;
  
  try {
    const url = new URL(imageUrl);
    // 현재 도메인과 다른 경우 외부 URL로 간주
    return url.hostname !== window.location.hostname;
  } catch {
    // URL 파싱 실패 시 상대 경로로 간주
    return false;
  }
}
