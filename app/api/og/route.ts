import { NextRequest, NextResponse } from 'next/server';
import { getImageDetails } from '@/backup/app/details/utils/hooks/fetchImageDetails';

// Cloudflare R2 기본 URL
const R2_BASE_URL = 'https://pub-65bb4012fb354951a2c6139a4b49b717.r2.dev/images';

/**
 * OG 이미지 생성을 위한 API 라우트 핸들러
 * 두 가지 방식으로 이미지를 가져올 수 있습니다:
 * 1. imageId 파라미터: imageId를 사용하여 R2 스토리지의 이미지 URL로 리다이렉트
 * 2. imgUrl 파라미터: 직접 이미지 URL을 제공
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('imageId');
    const imgUrl = searchParams.get('imgUrl');

    console.log('[OG API] Requested params:', { imageId, imgUrl });

    // 1. imgUrl이 제공된 경우, 해당 URL로 리다이렉트
    if (imgUrl) {
      console.log('[OG API] Redirecting to provided imgUrl:', imgUrl);
      // URL이 유효한지 확인
      const fullImgUrl = imgUrl.startsWith('http') 
        ? imgUrl 
        : `${request.nextUrl.origin}${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`;
      
      return NextResponse.redirect(fullImgUrl);
    }
    
    // 2. imageId가 제공된 경우, Cloudflare R2 URL로 직접 리다이렉트
    if (imageId) {
      // 이미지 ID에서 확장자 처리 (.webp가 있는지 확인)
      const imageExtension = imageId.includes('.') ? '' : '.webp';
      const r2ImageUrl = `${R2_BASE_URL}/${imageId}${imageExtension}`;
      
      console.log('[OG API] Redirecting to R2 image URL:', r2ImageUrl);
      return NextResponse.redirect(r2ImageUrl);
    }
    
    // 3. 파라미터가 없는 경우, 기본 OG 이미지 제공
    console.log('[OG API] No parameters provided, using default OG image');
    return NextResponse.redirect(new URL('/og-image.jpg', request.nextUrl.origin));
    
  } catch (error) {
    console.error('[OG API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'OG image generation failed' },
      { status: 500 }
    );
  }
}