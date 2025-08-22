/**
 * 기본 fallback 이미지 생성 유틸리티
 */

// 1x1 투명 PNG (data URL)
export const TRANSPARENT_PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAJZFq5H6QAAAABJRU5ErkJggg==';

// 다양한 크기의 기본 placeholder 이미지 생성
export function generatePlaceholderImage(width: number = 300, height: number = 200, text: string = 'Image not available'): string {
  // SVG 기반 placeholder 이미지 생성
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#374151"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
            fill="#9CA3AF" font-family="system-ui, sans-serif" font-size="14">
        ${text}
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// 뉴스 이미지용 기본 fallback
export function getNewsImageFallback(width: number = 300, height: number = 200): string {
  return generatePlaceholderImage(width, height, 'News Image Unavailable');
}

// 아바타 이미지용 기본 fallback  
export function getAvatarFallback(size: number = 100): string {
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50%" cy="50%" r="${size / 2}" fill="#6B7280"/>
      <circle cx="50%" cy="40%" r="${size * 0.15}" fill="#9CA3AF"/>
      <ellipse cx="50%" cy="70%" rx="${size * 0.25}" ry="${size * 0.15}" fill="#9CA3AF"/>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// 로고 이미지용 기본 fallback
export function getLogoFallback(width: number = 200, height: number = 100): string {
  return generatePlaceholderImage(width, height, 'Logo');
}

// 미리보기 이미지용 기본 fallback
export function getPreviewImageFallback(width: number = 400, height: number = 300): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#1F2937"/>
      <g transform="translate(${width/2 - 24}, ${height/2 - 24})">
        <svg width="48" height="48" fill="#6B7280" viewBox="0 0 24 24">
          <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </g>
      <text x="50%" y="75%" dominant-baseline="middle" text-anchor="middle" 
            fill="#9CA3AF" font-family="system-ui, sans-serif" font-size="12">
        Preview not available
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// 컨텐츠 타입에 따른 smart fallback 선택
export function getSmartFallback(
  type: 'news' | 'avatar' | 'logo' | 'preview' | 'general' = 'general',
  width: number = 300,
  height: number = 200
): string {
  switch (type) {
    case 'news':
      return getNewsImageFallback(width, height);
    case 'avatar':
      return getAvatarFallback(Math.min(width, height));
    case 'logo':
      return getLogoFallback(width, height);
    case 'preview':
      return getPreviewImageFallback(width, height);
    default:
      return generatePlaceholderImage(width, height);
  }
}