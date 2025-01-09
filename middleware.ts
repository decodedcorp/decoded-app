import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = new URL(request.url);
  
  // /details?imageId=xxx 형식의 URL을 /details/xxx로 리다이렉트
  if (pathname === '/details' && searchParams.has('imageId')) {
    const imageId = searchParams.get('imageId');
    const itemId = searchParams.get('itemId');
    const showList = searchParams.get('showList');
    
    // 새로운 URL 생성
    let newUrl = `/details/${imageId}`;
    
    // 추가 쿼리 파라미터가 있다면 유지
    const newParams = new URLSearchParams();
    if (itemId) newParams.set('itemId', itemId);
    if (showList) newParams.set('showList', showList);
    
    const queryString = newParams.toString();
    if (queryString) {
      newUrl += `?${queryString}`;
    }
    
    return NextResponse.redirect(new URL(newUrl, request.url));
  }

  return NextResponse.next();
}

// 미들웨어가 적용될 경로 설정
export const config = {
  matcher: '/details'
}; 