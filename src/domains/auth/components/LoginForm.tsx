'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import { useAuthMutations } from '../hooks/useAuthMutations';
import { AuthError, NetworkError } from '../types/auth';
import { useAuthStore } from '../../../store/authStore';

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onError }) => {
  const { googleOAuthMutation } = useAuthMutations();
  const { isAuthenticated, login } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const popupRef = useRef<Window | null>(null);
  const messageHandledRef = useRef(false);

  // 팝업 창에서 OAuth 완료 후 메시지 수신
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // 보안을 위해 origin 체크
      if (event.origin !== window.location.origin) {
        return;
      }

      // 이미 처리된 메시지는 무시
      if (messageHandledRef.current) {
        return;
      }

      if (event.data.type === 'GOOGLE_OAUTH_SUCCESS') {
        messageHandledRef.current = true;

        console.log('[LoginForm] Received OAuth success message:', event.data);

        // 팝업에서 받은 완전한 로그인 데이터로 메인 창에서 로그인 처리
        if (event.data.loginData) {
          console.log('[LoginForm] Processing login data in main window:', {
            hasAccessToken: !!event.data.loginData.access_token?.access_token,
            hasUser: !!event.data.loginData.user,
            hasRefreshToken: !!event.data.loginData.refresh_token,
          });

          // AuthStore의 login 함수를 호출하여 메인 창에서 토큰 저장
          login(event.data.loginData);
          
          // React Query 캐시 무효화
          queryClient.invalidateQueries({ queryKey: ['user'] });
          queryClient.invalidateQueries({ queryKey: ['auth'] });
          
          // 로그인 성공 후 상태 업데이트를 위한 짧은 지연
          setTimeout(() => {
            // 로그인 성공 콜백 호출
            onSuccess?.();
            
            // 페이지 새로고침으로 UI 강제 업데이트
            window.location.reload();
          }, 100);
        } else {
          // 로그인 성공 콜백 호출 (loginData가 없는 경우)
          onSuccess?.();
        }
      } else if (event.data.type === 'GOOGLE_OAUTH_ERROR') {
        messageHandledRef.current = true;

        console.log('[LoginForm] Received OAuth error message:', event.data);

        onError?.(event.data.error || 'Google 로그인에 실패했습니다.');
      } else if (event.data.type === 'GOOGLE_OAUTH_LOG') {
        // 팝업에서 전달받은 로그를 메인 창 콘솔에 출력
        const { level, message, data, timestamp } = event.data;
        const logMessage = `[Popup] ${message}`;

        // 디버깅을 위한 구분선 추가
        console.log('='.repeat(80));
        console.log(`[OAuth Debug] ${timestamp}`);
        console.log('='.repeat(80));

        switch (level) {
          case 'error':
            console.error(logMessage, data);
            break;
          case 'warn':
            console.warn(logMessage, data);
            break;
          case 'info':
            console.info(logMessage, data);
            break;
          default:
            console.log(logMessage, data);
        }
        console.log('='.repeat(80));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSuccess, onError, login, queryClient]);

  // 팝업 창 모니터링
  useEffect(() => {
    if (!popupRef.current) return;

    const checkClosed = setInterval(() => {
      if (popupRef.current?.closed) {
        clearInterval(checkClosed);
        popupRef.current = null;
        
        // 팝업이 닫혔는데 메시지가 처리되지 않았다면 에러 처리
        if (!messageHandledRef.current) {
          console.log('[LoginForm] Popup closed without completing OAuth');
          onError?.('로그인이 취소되었습니다.');
        }
      }
    }, 1000);

    return () => clearInterval(checkClosed);
  }, [onError]);

  // 로그인 상태 변경 감지
  useEffect(() => {
    if (isAuthenticated && messageHandledRef.current) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[LoginForm] User is now authenticated, calling onSuccess');
      }
      // 로그인 성공 시 콜백 호출
      onSuccess?.();
    }
  }, [isAuthenticated, onSuccess]);

  const handleGoogleLogin = async () => {
    try {
      messageHandledRef.current = false;

      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

      // 동적으로 현재 도메인 사용
      const redirectUri =
        process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ||
        (typeof window !== 'undefined'
          ? `${window.location.origin}/auth/callback`
          : 'http://localhost:3000/auth/callback');

      if (!clientId) {
        throw new Error('Google Client ID가 설정되지 않았습니다.');
      }

      // 디버그 모드를 위한 파라미터 추가
      const debugParam = process.env.NODE_ENV === 'development' ? '&debug=true' : '';

      const googleAuthUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=code&` +
        `scope=${encodeURIComponent('openid email profile')}&` +
        `access_type=offline&` +
        `prompt=consent${debugParam}`;

      // 모든 환경에서 팝업 창에서 OAuth 처리
      const popup = window.open(
        googleAuthUrl,
        'googleOAuth',
        'width=500,height=600,scrollbars=yes,resizable=yes,menubar=no,toolbar=no,location=no,status=no',
      );

      if (!popup) {
        throw new Error('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
      }

      popupRef.current = popup;

      // 팝업 창 포커스
      popup.focus();
    } catch (error) {
      let errorMessage = 'Google 로그인에 실패했습니다.';

      if (error instanceof AuthError) {
        errorMessage = `인증 오류: ${error.message}`;
      } else if (error instanceof NetworkError) {
        errorMessage = '네트워크 연결을 확인해주세요.';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      onError?.(errorMessage);
    }
  };

  const isFormLoading = googleOAuthMutation.isPending;

  return (
    <div className="w-full space-y-6">
      {/* Google OAuth Button */}
      <button
        onClick={handleGoogleLogin}
        disabled={isFormLoading}
        className="w-full flex justify-center items-center px-6 py-4 border border-white/20 rounded-xl shadow-lg text-base font-medium text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EAFD66] focus:ring-offset-black/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-sm hover:scale-[1.02] active:scale-[0.98]"
      >
        {isFormLoading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
            <span className="text-white">Signing in...</span>
          </div>
        ) : (
          <>
            <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-white font-medium">Continue with Google</span>
          </>
        )}
      </button>

      {/* Error Display */}
      {googleOAuthMutation.error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-300">
                {googleOAuthMutation.error instanceof AuthError ? 'Authentication Error' : 'Error'}
              </h3>
              <div className="mt-1 text-sm text-red-200">{googleOAuthMutation.error.message}</div>
            </div>
          </div>
        </div>
      )}

      {/* Additional Info */}
      <div className="text-center">
        <p className="text-xs text-gray-400 leading-relaxed">
          By continuing, you agree to our Terms of Service and Privacy Policy. We&apos;ll use your
          Google account information to provide you with a personalized experience.
        </p>
      </div>
    </div>
  );
};
