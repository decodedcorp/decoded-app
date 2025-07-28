'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../domains/auth/hooks/useAuth';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithGoogle, setLoading, setError } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Google 로그인을 처리하고 있습니다...');

  useEffect(() => {
    const processGoogleCallback = async () => {
      try {
        setLoading(true);
        setStatus('loading');
        setMessage('Google 로그인을 처리하고 있습니다...');

        // URL에서 인증 코드 추출
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
          throw new Error(`Google OAuth error: ${error}`);
        }

        if (!code) {
          throw new Error('인증 코드를 찾을 수 없습니다.');
        }

        // Google OAuth 토큰 교환
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            code,
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
            grant_type: 'authorization_code',
          }),
        });

        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.text();
          console.error('Google token exchange error:', errorData);
          throw new Error('Google OAuth 토큰 교환에 실패했습니다.');
        }

        const tokenData = await tokenResponse.json();

        // 사용자 정보 가져오기
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        });

        if (!userInfoResponse.ok) {
          throw new Error('사용자 정보를 가져오는데 실패했습니다.');
        }

        const userInfo = await userInfoResponse.json();

        // 응답 데이터 구성
        const response = {
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          user: {
            id: userInfo.id,
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
            role: 'user',
            status: 'active',
          },
        };

        // Zustand 스토어에 로그인 정보 저장
        loginWithGoogle(response);

        setStatus('success');
        setMessage('로그인에 성공했습니다! 메인 페이지로 이동합니다...');

        // 잠시 후 메인 페이지로 리다이렉트
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } catch (error) {
        console.error('Google OAuth callback error:', error);
        setStatus('error');
        const errorMessage = error instanceof Error ? error.message : '로그인에 실패했습니다.';
        setMessage(errorMessage);
        setError(errorMessage);

        // 에러 발생 시 3초 후 로그인 페이지로 리다이렉트
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    // 컴포넌트가 마운트된 후에만 실행
    if (typeof window !== 'undefined') {
      processGoogleCallback();
    }
  }, [searchParams, loginWithGoogle, setLoading, setError, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-6">
        <div className="text-center">
          {/* Loading Spinner */}
          {status === 'loading' && (
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Success Icon */}
          {status === 'success' && (
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          )}

          {/* Error Icon */}
          {status === 'error' && (
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-red-100 p-3">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {status === 'loading' && '로그인 처리 중...'}
            {status === 'success' && '로그인 성공!'}
            {status === 'error' && '로그인 실패'}
          </h2>

          <p className="text-gray-600 dark:text-gray-400">{message}</p>

          {/* Progress Bar for Loading */}
          {status === 'loading' && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-2 rounded-full animate-pulse"
                  style={{ width: '60%' }}
                ></div>
              </div>
            </div>
          )}

          {/* Manual Navigation Links */}
          <div className="mt-6 space-y-2">
            <button
              onClick={() => router.push('/')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              메인 페이지로 이동
            </button>

            {status === 'error' && (
              <button
                onClick={() => router.push('/login')}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                로그인 페이지로 돌아가기
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
