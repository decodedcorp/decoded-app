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
