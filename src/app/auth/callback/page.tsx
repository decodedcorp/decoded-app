'use client';

import { useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../../../store/authStore';
import { handleGoogleOAuthCallback } from '../../../domains/auth/api/authApi';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setError, setLoading, login } = useAuthStore();

  const sendMessageToParent = useCallback((type: string, data?: any) => {
    if (window.opener) {
      try {
        window.opener.postMessage({ type, ...data }, window.location.origin);
        // 메시지 전송 후 즉시 창 닫기
        setTimeout(() => {
          window.close();
        }, 100);
      } catch (error) {
        console.error('Failed to send message to parent:', error);
        window.close();
      }
    }
  }, []);

  const processAuthCallback = useCallback(async () => {
    try {
      setLoading(true);
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[Auth] OAuth error:', error);
        }

        // 팝업 창에서 부모 창으로 에러 메시지 전송
        sendMessageToParent('GOOGLE_OAUTH_ERROR', { error: `OAuth error: ${error}` });
        return;
      }

      if (!code) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[Auth] No authorization code received');
        }

        // 팝업 창에서 부모 창으로 에러 메시지 전송
        sendMessageToParent('GOOGLE_OAUTH_ERROR', { error: 'No authorization code received' });
        return;
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('[Auth] Processing OAuth callback with code:', code.substring(0, 10) + '...');
      }

      const result = await handleGoogleOAuthCallback(code);

      if (process.env.NODE_ENV === 'development') {
        console.log('[Auth] Login successful:', {
          hasUser: !!result.user,
          hasAccessToken: !!result.access_token,
        });
      }

      // 팝업 창인 경우: auth store 업데이트 후 부모 창으로 메시지 전송
      if (window.opener) {
        // auth store에 로그인 정보 저장
        login(result);

        // 부모 창으로 성공 메시지 전송
        sendMessageToParent('GOOGLE_OAUTH_SUCCESS', { user: result.user });
        return;
      }

      // 팝업이 아닌 경우: 일반적인 로그인 처리
      login(result);
      router.push('/dashboard');
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Auth] OAuth callback error:', error);
      }

      const errorMessage = error instanceof Error ? error.message : 'OAuth callback failed';

      // 팝업 창에서 부모 창으로 에러 메시지 전송
      sendMessageToParent('GOOGLE_OAUTH_ERROR', { error: errorMessage });
      return;
    } finally {
      setLoading(false);
    }
  }, [searchParams, router, setError, setLoading, sendMessageToParent, login]);

  useEffect(() => {
    // 즉시 처리 시작
    processAuthCallback();
  }, [processAuthCallback]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Processing authentication...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
