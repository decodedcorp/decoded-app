'use client';

import { useEffect, useCallback, Suspense } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { useAuthStore } from '../../../store/authStore';
import { handleGoogleOAuthCallback } from '../../../domains/auth/api/authApi';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setError, setLoading, login, error } = useAuthStore();

  // Debug mode: 디버그 파라미터 확인
  const isDebugMode = searchParams.get('debug') === 'true';

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

  // 디버깅을 위한 로그 전달 함수
  const sendLogToParent = useCallback(
    (level: 'log' | 'error' | 'warn' | 'info', message: string, data?: any) => {
      if (window.opener) {
        try {
          window.opener.postMessage(
            {
              type: 'GOOGLE_OAUTH_LOG',
              level,
              message,
              data,
              timestamp: new Date().toISOString(),
            },
            window.location.origin,
          );
        } catch (error) {
          console.error('[Auth Callback] Error sending log to parent:', error);
        }
      }
    },
    [],
  );

  const processAuthCallback = useCallback(async () => {
    try {
      setLoading(true);
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      console.log('[Auth Callback] Starting auth processing:', {
        hasCode: !!code,
        hasError: !!error,
        isPopup: !!window.opener,
        isDebugMode,
        timestamp: new Date().toISOString()
      });

      if (error) {
        const errorMessage = `Google OAuth error: ${error}`;
        console.error('[Auth] OAuth error:', error);
        sendLogToParent('error', '[Auth] OAuth error:', error);
        sendMessageToParent('GOOGLE_OAUTH_ERROR', { error: errorMessage });
        return;
      }

      if (!code) {
        const errorMessage = 'No authorization code received from Google';
        console.error('[Auth] No authorization code received');
        sendLogToParent('error', '[Auth] No authorization code received');
        sendMessageToParent('GOOGLE_OAUTH_ERROR', { error: errorMessage });
        return;
      }

      console.log('[Auth] Processing OAuth callback with code:', {
        codeLength: code.length,
        codePreview: code.substring(0, 15) + '...'
      });
      sendLogToParent('info', '[Auth] Processing OAuth callback', { codeLength: code.length });

      // OAuth 콜백 처리 시작
      const result = await handleGoogleOAuthCallback(code);

      console.log('[Auth] OAuth callback successful:', {
        hasUser: !!result.user,
        hasAccessToken: !!result.access_token,
        userEmail: result.user?.email
      });
      
      sendLogToParent('info', '[Auth] OAuth callback successful', {
        hasUser: !!result.user,
        hasAccessToken: !!result.access_token
      });

      // 팝업 상황 처리: 부모 창으로 데이터 전송
      if (window.opener) {
        sendMessageToParent('GOOGLE_OAUTH_SUCCESS', {
          user: result.user,
          loginData: result
        });
        return;
      }

      // 일반 로그인 처리 (브라우저에서 직접 접근한 경우)
      login(result);
      
      // 로그인 성공 후 리다이렉트
      setTimeout(() => {
        router.push('/');
      }, 1500);

    } catch (error) {
      console.error('[Auth] OAuth callback failed:', {
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined
      });
      
      sendLogToParent('error', '[Auth] OAuth callback failed', {
        error: error instanceof Error ? error.message : String(error)
      });

      const errorMessage = error instanceof Error ? error.message : 'OAuth callback failed';

      // 디버그 모드에서는 에러 표시
      if (isDebugMode) {
        setError(errorMessage);
        setLoading(false);
        return;
      }

      // 팝업에서 에러 메시지 전송
      sendMessageToParent('GOOGLE_OAUTH_ERROR', { error: errorMessage });
    } finally {
      setLoading(false);
    }
  }, [searchParams, router, setError, setLoading, sendMessageToParent, sendLogToParent, login, isDebugMode]);

  useEffect(() => {
    // 즉시 처리 시작
    processAuthCallback();
  }, [processAuthCallback]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center max-w-md mx-auto p-6">
        {isDebugMode && error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-red-800 font-semibold mb-2">OAuth Debug Error</h2>
            <p className="text-red-700 text-sm break-words">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              홈으로 돌아가기
            </button>
          </div>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Processing authentication...</p>
            {isDebugMode && (
              <p className="text-sm text-gray-500 mt-2">Debug mode active - 콘솔 확인</p>
            )}
          </>
        )}
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
