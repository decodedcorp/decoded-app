'use client';

import React, { useEffect, useState } from 'react';
import { LoginForm } from '../../domains/auth/components/LoginForm';
import { LoginFormData } from '../../domains/auth/types/auth';
import { useAuth } from '../../domains/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { initiateGoogleOAuth } from '../../domains/auth/utils/oauth';
import { OpenAPI } from '../../api/generated';

export default function LoginPage() {
  const { login, setLoading, setError, clearError, isLoading, error } = useAuth();
  const router = useRouter();
  const [apiConfig, setApiConfig] = useState<any>(null);

  useEffect(() => {
    // API 설정 상태 확인
    setApiConfig({
      BASE: OpenAPI.BASE,
      WITH_CREDENTIALS: OpenAPI.WITH_CREDENTIALS,
      CREDENTIALS: OpenAPI.CREDENTIALS,
      TOKEN: OpenAPI.TOKEN ? '***' : 'undefined',
    });
  }, []);

  const handleLogin = async (formData: LoginFormData) => {
    try {
      setLoading(true);
      clearError();

      // TODO: 실제 API 엔드포인트로 변경
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '로그인에 실패했습니다.');
      }

      const loginResponse = await response.json();

      // Zustand 스토어에 로그인 정보 저장
      login(loginResponse);

      // 로그인 성공 후 메인 페이지로 리다이렉트
      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    try {
      clearError();
      initiateGoogleOAuth();
    } catch (error) {
      console.error('Google OAuth error:', error);
      setError('Google 로그인을 시작할 수 없습니다.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* API Configuration Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">API Configuration:</h4>
            <pre className="text-xs text-blue-700 overflow-auto">
              {JSON.stringify(apiConfig, null, 2)}
            </pre>
          </div>
        )}

        <LoginForm onSuccess={handleLogin} onError={setError} />

        <div className="text-center">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Google로 로그인
          </button>
        </div>
      </div>
    </div>
  );
}
