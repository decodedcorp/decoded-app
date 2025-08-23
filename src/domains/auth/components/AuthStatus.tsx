'use client';

import React from 'react';

import { useAuth, useUser, useIsAdmin, useIsUser } from '../hooks/useAuth';

/**
 * 인증 상태를 표시하는 데모 컴포넌트
 */
export const AuthStatus: React.FC = () => {
  const { isAuthenticated, isLoading, error, logout } = useAuth();
  const { role, name, email } = useUser();
  const isAdmin = useIsAdmin();
  const isUser = useIsUser();

  if (isLoading) {
    return (
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-blue-800 dark:text-blue-200">인증 상태 확인 중...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div className="flex items-center space-x-2">
          <svg
            className="h-4 w-4 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-red-800 dark:text-red-200">에러: {error}</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg
              className="h-4 w-4 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <span className="text-yellow-800 dark:text-yellow-200">로그인이 필요합니다</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg
              className="h-4 w-4 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-green-800 dark:text-green-200 font-medium">로그인됨</span>
          </div>
          <button
            onClick={() => logout()}
            className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            로그아웃
          </button>
        </div>

        <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
          <div>
            <strong>이름:</strong> {name || 'N/A'}
          </div>
          <div>
            <strong>이메일:</strong> {email}
          </div>
          <div>
            <strong>역할:</strong> {role}
          </div>
          <div className="flex space-x-2">
            <span
              className={`px-2 py-1 rounded text-xs ${
                isAdmin
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {isAdmin ? '관리자' : '일반 사용자'}
            </span>
            <span
              className={`px-2 py-1 rounded text-xs ${
                isUser
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              사용자 권한
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
