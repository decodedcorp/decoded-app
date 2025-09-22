'use client';

import { useEffect, useCallback, useRef, Suspense } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { useAuthStore } from '../../../store/authStore';
import { handleGoogleOAuthCallback } from '../../../domains/auth/api/authApi';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { SpinnerLoading } from '@/shared/components/loading';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setError, setLoading, login, error } = useAuthStore();
  const processingRef = useRef(false);

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

      if (error) {
        const errorMessage = `OAuth error: ${error}`;
        console.log('[Auth] OAuth error:', error);
        sendLogToParent('error', '[Auth] OAuth error:', error);

        // 팝업 창에서 부모 창으로 에러 메시지 전송
        sendMessageToParent('GOOGLE_OAUTH_ERROR', { error: errorMessage });
        return;
      }

      if (!code) {
        const errorMessage = 'No authorization code received';
        console.log('[Auth] No authorization code received');
        sendLogToParent('error', '[Auth] No authorization code received');

        // 팝업 창에서 부모 창으로 에러 메시지 전송
        sendMessageToParent('GOOGLE_OAUTH_ERROR', { error: errorMessage });
        return;
      }

      console.log('[Auth] Processing OAuth callback with code:', code.substring(0, 10) + '...');
      sendLogToParent(
        'info',
        '[Auth] Processing OAuth callback with code:',
        code.substring(0, 10) + '...',
      );

      const result = await handleGoogleOAuthCallback(code);

      console.log('[Auth] Login successful:', {
        hasUser: !!result.user,
        hasAccessToken: !!result.access_token,
      });
      sendLogToParent('info', '[Auth] Login successful:', {
        hasUser: !!result.user,
        hasAccessToken: !!result.access_token,
      });

      // 팝업 창인 경우: 토큰 데이터를 부모 창으로 전송 (팝업에서는 저장하지 않음)
      if (window.opener) {
        // 부모 창으로 로그인 데이터 전송 (토큰 포함)
        sendMessageToParent('GOOGLE_OAUTH_SUCCESS', {
          user: result.user,
          loginData: result, // 전체 로그인 응답 데이터 포함
        });
        return;
      }

      // 팝업이 아닌 경우: 일반적인 로그인 처리
      login(result);
      // dashboard로 리다이렉트하지 않음
      // router.push('/dashboard');
    } catch (error) {
      console.error('[Auth] OAuth callback error:', error);
      sendLogToParent('error', '[Auth] OAuth callback error:', error);

      const errorMessage = error instanceof Error ? error.message : 'OAuth callback failed';

      // 디버그 모드에서는 팝업을 닫지 않고 에러 표시
      if (isDebugMode) {
        setError(errorMessage);
        setLoading(false);
        return;
      }

      // 팝업 창에서 부모 창으로 에러 메시지 전송
      sendMessageToParent('GOOGLE_OAUTH_ERROR', { error: errorMessage });
      return;
    } finally {
      setLoading(false);
    }
  }, [searchParams, router, setError, setLoading, sendMessageToParent, sendLogToParent, login]);

  useEffect(() => {
    // 이미 처리 중이면 실행하지 않음
    if (processingRef.current) return;
    processingRef.current = true;

    // 즉시 처리 시작
    processAuthCallback();
  }, []); // 의존성 배열을 빈 배열로 변경하여 한 번만 실행

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
          <SpinnerLoading
            isLoading={true}
            spinner={{ size: 'lg' }}
            message="Processing authentication..."
            subtitle={isDebugMode ? 'Debug mode active - 콘솔 확인' : undefined}
            className="py-8"
          />
        )}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <LoadingOverlay
          isLoading={true}
          message="Authenticating..."
          opacity={0.9}
          useBrandColor={true}
          className="min-h-screen"
        />
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
