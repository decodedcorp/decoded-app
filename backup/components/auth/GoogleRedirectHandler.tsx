'use client';

export function GoogleRedirectHandler() {
  if (typeof window !== 'undefined') {
    // 즉시 실행되는 코드
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const idToken = hashParams.get('id_token');
    
    if (idToken) {
      // 화면 렌더링 방지
      document.documentElement.style.display = 'none';
      
      if (window.opener) {
        // 데스크탑 처리: 토큰 전달 및 창 닫기
        window.opener.postMessage({ id_token: idToken }, window.location.origin);
        window.close();
      } else {
        // 모바일 처리: localStorage에 토큰 저장 후 메인 창으로 리다이렉트
        try {
          // 임시로 localStorage에 토큰 저장
          localStorage.setItem('TEMP_ID_TOKEN', idToken);
          localStorage.setItem('LOGIN_TIMESTAMP', Date.now().toString());
          
          // 메인 페이지로 리다이렉트
          window.location.href = '/';
        } catch (error) {
          console.error('Failed to store token:', error);
        }
      }
      
      // 추가적인 리다이렉트 방지
      window.stop();
      history.replaceState(null, '', '/');
    }
  }

  // 빈 화면 반환
  return null;
} 