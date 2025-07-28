'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { handleGoogleOAuthCallback, extractAuthCodeFromUrl } from '@/domains/auth/utils/oauth';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Extract authorization code from URL
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
          setError('Authentication was cancelled or failed');
          setStatus('error');
          return;
        }

        if (!code) {
          setError('No authorization code received');
          setStatus('error');
          return;
        }

        // Exchange authorization code for tokens
        const response = await handleGoogleOAuthCallback(code);

        // Store tokens and user data
        if (response.access_token) {
          // TODO: Store tokens securely
          sessionStorage.setItem('ACCESS_TOKEN', response.access_token);
          if (response.refresh_token) {
            sessionStorage.setItem('REFRESH_TOKEN', response.refresh_token);
          }
          if (response.user) {
            sessionStorage.setItem('USER_DATA', JSON.stringify(response.user));
          }

          setStatus('success');

          // Redirect to home page after successful login
          setTimeout(() => {
            router.push('/');
          }, 2000);
        } else {
          throw new Error('No access token received');
        }
      } catch (error) {
        console.error('Google OAuth callback error:', error);
        setError(error instanceof Error ? error.message : 'Authentication failed');
        setStatus('error');
      }
    };

    handleCallback();
  }, [searchParams, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Completing sign in...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we complete your authentication.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4 max-w-md mx-auto px-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-6 h-6 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Sign in failed</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {error || 'An error occurred during authentication.'}
          </p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center space-y-4 max-w-md mx-auto px-4">
        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-6 h-6 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Sign in successful!</h2>
        <p className="text-gray-600 dark:text-gray-400">Redirecting you to the home page...</p>
      </div>
    </div>
  );
}
