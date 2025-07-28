'use client';

import React, { useEffect, useState, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/domains/auth/hooks/useAuth';
import { handleGoogleOAuthCallback } from '@/domains/auth/api/authApi';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, setLoading, setError } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('인증을 처리하고 있습니다...');
  const [isProcessing, setIsProcessing] = useState(false);

  const processAuthCallback = useCallback(async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      setLoading(true);
      setStatus('loading');
      setMessage('인증을 처리하고 있습니다...');

      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        throw new Error(`인증 오류: ${error}`);
      }

      if (!code) {
        throw new Error('인증 코드가 없습니다.');
      }

      console.log('[Auth] Processing callback with code:', {
        codeLength: code.length,
        hasCode: !!code,
      });

      // Google OAuth 콜백 처리
      const response = await handleGoogleOAuthCallback(code);

      console.log('[Auth] Login successful:', {
        hasAccessToken: !!response.access_token,
        hasUser: !!response.user,
        userDocId: response.user?.doc_id,
      });

      // 로그인 성공 처리
      login(response);

      setStatus('success');
      setMessage('로그인에 성공했습니다!');
      setLoading(false);

      // 메인 페이지로 리다이렉트
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (error) {
      console.error('[Auth] Callback error:', error);

      setStatus('error');
      setMessage(error instanceof Error ? error.message : '인증 처리 중 오류가 발생했습니다.');
      setError(error instanceof Error ? error.message : '인증 처리 중 오류가 발생했습니다.');
      setLoading(false);

      // 에러 페이지로 리다이렉트
      setTimeout(() => {
        router.push('/login?error=auth_failed');
      }, 3000);
    } finally {
      setIsProcessing(false);
    }
  }, [searchParams, login, setLoading, setError, router]);

  useEffect(() => {
    // 한 번만 실행되도록 처리
    if (!isProcessing) {
      processAuthCallback();
    }
  }, []); // 빈 의존성 배열로 한 번만 실행

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">인증 처리 중</h2>
          <p className="mt-2 text-sm text-gray-600">{message}</p>
        </div>

        <div className="mt-8 space-y-6">
          {status === 'loading' && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {status === 'success' && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">로그인 성공</p>
                </div>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">인증 실패</p>
                  <p className="mt-1 text-sm text-red-700">{message}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
