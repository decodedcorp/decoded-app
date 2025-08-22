// Image size options for optimization
export type ImageSize = 'thumb' | 'small' | 'medium' | 'large' | 'original';

// Image quality options
export type ImageQuality = 'low' | 'medium' | 'high';

// Image format options
export type ImageFormat = 'webp' | 'jpeg' | 'png' | 'original';

interface ImageProxyOptions {
  size?: ImageSize;
  quality?: ImageQuality;
  format?: ImageFormat;
  blur?: boolean;
}

/**
 * 외부 이미지 URL을 최적화된 프록시 URL로 변환
 * @param imageUrl 외부 이미지 URL
 * @param options 프록시 최적화 옵션
 * @returns 프록시 URL
 */
export function getProxiedImageUrl(imageUrl: string, options: ImageProxyOptions = {}): string {
  if (!imageUrl) return '/placeholder.jpg';
  
  // 이미 프록시 URL인 경우 그대로 반환
  if (imageUrl.startsWith('/api/proxy') || imageUrl.startsWith('/api/image-proxy')) {
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

  // 신뢰할 수 있는 도메인들 (API 응답에서 자주 나오는 도메인들)
  const trustedDomains = [
    'images.unsplash.com',
    'via.placeholder.com',
    'picsum.photos',
    'avatars.githubusercontent.com',
    'cdn.pixabay.com',
    'images.pexels.com',
    'pickcon.co.kr',
    'ajunews.com',
    'cdn.nc.press',
    'talkimg.imbc.com',
    'blogthumb.pstatic.net',
    'newsimg.hankookilbo.com',
    'scontent-ssn1-1.cdninstagram.com',
    'image.imnews.imbc.com',
    'thumbnews.nateimg.co.kr',
    'cdn.kstarfashion.com',
    'biz.chosun.com',
  ];

  try {
    const url = new URL(imageUrl);
    
    // HTTPS이고 신뢰할 수 있는 도메인인 경우 직접 사용 (작은 이미지는 프록시 사용)
    if (url.protocol === 'https:' && trustedDomains.some(domain => url.hostname.includes(domain))) {
      // 큰 이미지나 최적화가 필요한 경우에만 프록시 사용
      if (options.size && options.size !== 'original') {
        return buildProxyUrl(imageUrl, options);
      }
      return imageUrl;
    }
  } catch {
    // URL 파싱 실패 시 프록시 사용
  }

  // 외부 URL을 프록시로 변환 (최적화 옵션 포함)
  return buildProxyUrl(imageUrl, options);
}

/**
 * 프록시 URL 빌드 (최적화 옵션 포함)
 */
function buildProxyUrl(imageUrl: string, options: ImageProxyOptions): string {
  const params = new URLSearchParams();
  params.set('url', imageUrl);
  
  if (options.size && options.size !== 'original') {
    params.set('size', options.size);
  }
  
  if (options.quality && options.quality !== 'medium') {
    params.set('quality', options.quality);
  }
  
  if (options.format && options.format !== 'original') {
    params.set('format', options.format);
  }
  
  if (options.blur) {
    params.set('blur', 'true');
  }
  
  return `/api/proxy/image?${params.toString()}`;
}

/**
 * 채널 콘텐츠용 최적화된 이미지 URL 생성
 */
export function getOptimizedChannelImageUrl(imageUrl: string, size: ImageSize = 'medium'): string {
  return getProxiedImageUrl(imageUrl, {
    size,
    format: 'webp',
    quality: 'medium',
  });
}

/**
 * 썸네일용 최적화된 이미지 URL 생성
 */
export function getThumbnailImageUrl(imageUrl: string): string {
  return getProxiedImageUrl(imageUrl, {
    size: 'thumb',
    format: 'webp',
    quality: 'medium',
  });
}

/**
 * 플레이스홀더용 블러 이미지 URL 생성
 */
export function getBlurPlaceholderUrl(imageUrl: string): string {
  return getProxiedImageUrl(imageUrl, {
    size: 'thumb',
    format: 'jpeg',
    quality: 'low',
    blur: true,
  });
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
