'use client';

import { useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../../../store/authStore';
import { handleGoogleOAuthCallback } from '../../../domains/auth/api/authApi';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setError, setLoading } = useAuthStore();

  const processAuthCallback = useCallback(async () => {
    try {
      setLoading(true);
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[Auth] OAuth error:', error);
        }
        setError(`OAuth error: ${error}`);
        router.push('/login');
        return;
      }

      if (!code) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[Auth] No authorization code received');
        }
        setError('No authorization code received');
        router.push('/login');
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

      // Redirect to dashboard or home page
      router.push('/dashboard');
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Auth] OAuth callback error:', error);
      }
      setError(error instanceof Error ? error.message : 'OAuth callback failed');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [searchParams, router, setError, setLoading]);

  useEffect(() => {
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
