import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

/**
 * 인증이 필요한 라우트를 보호하는 컴포넌트
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  redirectTo = '/login',
  fallback,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  // 로딩 중일 때는 fallback 또는 로딩 표시
  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )
    );
  }

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    router.push(redirectTo);
    return fallback || null;
  }

  // 특정 역할이 필요한 경우 권한 확인
  if (requiredRole && user?.role !== requiredRole) {
    router.push('/unauthorized');
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">접근 권한이 없습니다</h1>
            <p className="text-gray-600">필요한 권한이 없어 이 페이지에 접근할 수 없습니다.</p>
          </div>
        </div>
      )
    );
  }

  // 인증되고 권한이 있는 경우 자식 컴포넌트 렌더링
  return <>{children}</>;
};

/**
 * 관리자 권한이 필요한 라우트를 보호하는 컴포넌트
 */
export const AdminRoute: React.FC<Omit<ProtectedRouteProps, 'requiredRole'>> = (props) => {
  return <ProtectedRoute {...props} requiredRole="admin" />;
};

/**
 * 사용자 권한이 필요한 라우트를 보호하는 컴포넌트
 */
export const UserRoute: React.FC<Omit<ProtectedRouteProps, 'requiredRole'>> = (props) => {
  return <ProtectedRoute {...props} requiredRole="user" />;
};
