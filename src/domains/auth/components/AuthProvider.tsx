'use client';

import React from 'react';
import { useAuthInit } from '../hooks/useAuthInit';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * 인증 상태를 관리하는 Provider 컴포넌트
 * 앱 시작 시 인증 상태를 초기화하고 복원합니다.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // 인증 상태 초기화
  useAuthInit();

  return <>{children}</>;
};
