import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://dev.decoded.style';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return handleRequest(request, path, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return handleRequest(request, path, 'POST');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return handleRequest(request, path, 'PUT');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return handleRequest(request, path, 'DELETE');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return handleRequest(request, path, 'PATCH');
}

async function handleRequest(request: NextRequest, pathSegments: string[], method: string) {
  try {
    const path = pathSegments.join('/');
    // URL 끝의 슬래시 문제 해결
    const url = path ? `${API_BASE_URL}/${path}` : API_BASE_URL;

    // Log basic request info in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Proxy] ${method} ${url}`);
    }

    // 요청 헤더 복사 (중요한 헤더만)
    const headers = new Headers();
    const originalHeaders = request.headers;

    // Content-Type 복사
    const contentType = originalHeaders.get('content-type');
    if (contentType) {
      headers.set('content-type', contentType);
    }

    // Authorization 헤더 복사
    const authorization =
      originalHeaders.get('authorization') || originalHeaders.get('Authorization');
    if (authorization) {
      headers.set('authorization', authorization);

      // 토큰 디코딩 시도 (개발 환경에서만)
      if (process.env.NODE_ENV === 'development') {
        try {
          const token = authorization.replace('Bearer ', '');
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join(''),
          );
          const decoded = JSON.parse(jsonPayload);
          const currentTime = Math.floor(Date.now() / 1000);
          console.log(`[Proxy] Token decoded:`, {
            exp: decoded.exp,
            currentTime,
            isExpired: currentTime > decoded.exp,
            sub: decoded.sub,
            role: decoded.role,
          });
        } catch (error) {
          console.log(`[Proxy] Failed to decode token:`, error);
        }
      }
    }

    // User-Agent 설정
    headers.set('user-agent', 'Decoded-App/1.0');

    // 요청 본문 처리
    let body: string | undefined;
    if (method !== 'GET' && method !== 'DELETE') {
      body = await request.text();
    }

    // URL 쿼리 파라미터 처리
    const urlWithQuery = new URL(url);
    const searchParams = request.nextUrl.searchParams;
    searchParams.forEach((value, key) => {
      urlWithQuery.searchParams.set(key, value);
    });

    // trailing slash 문제 해결 - 원본 요청의 끝 슬래시 유지
    const originalPath = request.nextUrl.pathname;

    if (originalPath.endsWith('/') && !urlWithQuery.pathname.endsWith('/')) {
      urlWithQuery.pathname += '/';
    }

    // 실제 API 요청 (리다이렉트 수동 처리)
    let response = await fetch(urlWithQuery.toString(), {
      method,
      headers,
      body,
      redirect: 'manual', // 리다이렉트 수동 처리
    });

    // 리다이렉트 처리
    if (
      response.status === 301 ||
      response.status === 302 ||
      response.status === 307 ||
      response.status === 308
    ) {
      const location = response.headers.get('location');
      if (location) {
        response = await fetch(location, {
          method,
          headers,
          body,
        });
      }
    }

    // 응답 헤더 복사
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      // CORS 헤더는 제외하고 복사
      if (!key.toLowerCase().startsWith('access-control-')) {
        responseHeaders.set(key, value);
      }
    });

    // CORS 헤더 추가
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, User-Agent');

    // 응답 본문 처리
    const responseBody = await response.text();

    return new NextResponse(responseBody, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('[Proxy] Error:', error);

    return new NextResponse(
      JSON.stringify({
        error: 'Proxy request failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
  }
}

// OPTIONS 요청 처리 (CORS preflight)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
