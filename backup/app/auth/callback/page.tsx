'use client';

export default function CallbackPage() {
  if (typeof window !== 'undefined') {
    // 페이지 로드 전에 실행
    const script = document.createElement('script');
    script.textContent = `
      // 즉시 실행
      (function() {
        document.documentElement.style.display = 'none';
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const idToken = hashParams.get('id_token');
        if (window.opener && idToken) {
          window.opener.postMessage({ id_token: idToken }, window.location.origin);
          window.stop();
          window.close();
        }
      })();
    `;
    document.head.appendChild(script);
  }
  
  // 빈 페이지 반환
  return null;
} 