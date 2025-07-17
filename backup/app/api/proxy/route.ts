import { NextRequest, NextResponse } from 'next/server';

// 프록시 URL 설정
const API_BASE_URL = 'https://api.decoded.style';

// 모든 HTTP 메서드에 대한 요청 처리 함수
async function handleRequest(request: NextRequest) {
  try {
    // 요청 경로와 쿼리 파라미터 추출
    const { pathname, searchParams } = new URL(request.url);
    
    // 프록시 경로에서 /api/proxy 부분 제거
    const targetPath = pathname.replace('/api/proxy', '');
    
    // 요청 헤더 추출 (호스트와 origin 헤더는 제외)
    const headers = new Headers(request.headers);
    headers.delete('host');
    headers.delete('origin');

    // 인증 토큰이 있으면 포함
    const authToken = request.headers.get('authorization');
    if (authToken) {
      headers.set('authorization', authToken);
    }

    // 쿼리 파라미터 문자열 구성
    const queryString = Array.from(searchParams.entries())
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    
    // 타겟 URL 구성
    const targetUrl = `${API_BASE_URL}${targetPath}${queryString ? `?${queryString}` : ''}`;
    console.log(`[API Proxy] Forwarding request to: ${targetUrl}`);

    // 요청 메서드와 본문 가져오기
    const method = request.method;
    const body = method !== 'GET' && method !== 'HEAD' ? await request.blob() : undefined;

    // API 서버에 요청 전송
    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
      redirect: 'follow',
    });

    // 응답 데이터와 헤더 가져오기
    const data = await response.blob();
    const responseHeaders = new Headers(response.headers);
    
    // CORS 헤더 추가
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // 응답 반환
    return new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('[API Proxy] Error:', error);
    return NextResponse.json(
      { error: 'Proxy request failed' },
      { status: 500 }
    );
  }
}

// OPTIONS 요청에 대한 처리 (CORS preflight 요청)
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

// 각 HTTP 메서드에 대한 핸들러 구현
export async function GET(request: NextRequest) {
  try {
    // Get the path from the URL
    const url = new URL(request.url);
    const path = url.pathname.replace('/api/proxy', '');
    const searchParams = url.search;
    
    // Create the full URL
    const targetUrl = `${API_BASE_URL}${path}${searchParams}`;
    console.log(`[API Proxy] Forwarding GET request to: ${targetUrl}`);
    
    // Forward the request
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    // Read the response as JSON
    const data = await response.json();
    
    // Return the data
    return NextResponse.json(data);
  } catch (error) {
    console.error('[API Proxy] Error:', error);
    return NextResponse.json(
      { error: 'Proxy request failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const path = url.pathname.replace('/api/proxy', '');
    const targetUrl = `${API_BASE_URL}${path}${url.search}`;
    
    console.log(`[API Proxy] Forwarding POST request to: ${targetUrl}`);
    
    // Get the request body
    const body = await request.json();
    
    // Forward the request
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    // Read the response as JSON
    const data = await response.json();
    
    // Return the data
    return NextResponse.json(data);
  } catch (error) {
    console.error('[API Proxy] Error:', error);
    return NextResponse.json(
      { error: 'Proxy request failed' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  return handleRequest(request);
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request);
}

export async function PATCH(request: NextRequest) {
  return handleRequest(request);
} 