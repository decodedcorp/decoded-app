import { NextRequest, NextResponse } from 'next/server';

// 선택적 보안: 허용된 도메인 목록 (필요시 활성화)
const ALLOWED_HOSTS = [
  'ogp.me',
  'images.unsplash.com',
  'cdn.example.com',
  // 추가 허용 도메인들...
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  try {
    const parsed = new URL(imageUrl);
    
    // 프로토콜 검증
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return new NextResponse('Invalid protocol', { status: 400 });
    }

    // 선택적 도메인 필터링 (필요시 활성화)
    // if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
    //   return new NextResponse('Domain not allowed', { status: 403 });
    // }

    // 외부 이미지 fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃

    const externalRes = await fetch(imageUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Decoded-App/1.0',
      },
    });

    clearTimeout(timeoutId);

    if (!externalRes.ok) {
      return new NextResponse('Image fetch failed', { status: externalRes.status });
    }

    const contentType = externalRes.headers.get('content-type') || 'image/jpeg';
    
    // 이미지 타입 검증
    if (!contentType.startsWith('image/')) {
      return new NextResponse('URL is not an image', { status: 400 });
    }

    const buffer = await externalRes.arrayBuffer();

    // 응답 헤더 설정
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Cache-Control', 'public, max-age=86400'); // 하루 캐싱
    headers.set('Access-Control-Allow-Origin', '*');

    return new NextResponse(buffer, {
      status: 200,
      headers,
    });

  } catch (error) {
    console.error('[Image Proxy] Error:', error);
    
    if (error instanceof Error && error.name === 'AbortError') {
      return new NextResponse('Request timeout', { status: 408 });
    }

    return new NextResponse('Image fetch failed', { status: 500 });
  }
}

// OPTIONS 요청 처리 (CORS preflight)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
