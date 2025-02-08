'use client';

export function GoogleRedirectHandler() {
  if (typeof window !== 'undefined' && window.opener) {
    // 즉시 실행되는 코드
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const idToken = hashParams.get('id_token');
    
    if (idToken) {
      // 화면 렌더링 방지
      document.documentElement.style.display = 'none';
      
      // 토큰 전달 및 창 닫기
      window.opener.postMessage({ id_token: idToken }, window.location.origin);
      window.close();
      
      // 추가적인 리다이렉트 방지
      window.stop();
      history.replaceState(null, '', '/');
    }
  }

  // 빈 화면 반환
  return null;
} 