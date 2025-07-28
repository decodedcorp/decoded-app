# Zustand 인증 상태 관리 시스템

이 문서는 Decoded 앱에서 사용하는 Zustand 기반 인증 상태 관리 시스템에 대한 설명입니다.

## 🏗️ 시스템 구조

```
src/domains/auth/
├── components/
│   ├── AuthProvider.tsx      # 인증 상태 초기화 Provider
│   ├── AuthStatus.tsx        # 인증 상태 표시 컴포넌트 (데모)
│   ├── LoginForm.tsx         # 로그인 폼 컴포넌트
│   ├── LoginModal.tsx        # 로그인 모달 컴포넌트
│   └── ProtectedRoute.tsx    # 인증이 필요한 라우트 보호 컴포넌트
├── constants/
│   └── authConstants.ts      # 인증 관련 상수
├── hooks/
│   ├── useAuth.ts           # 메인 인증 훅
│   └── useAuthInit.ts       # 인증 상태 초기화 훅
├── types/
│   └── auth.ts              # 인증 관련 타입 정의
├── utils/
│   ├── oauth.ts             # Google OAuth 유틸리티
│   ├── tokenManager.ts      # 토큰 관리 유틸리티
│   └── validation.ts        # 폼 검증 유틸리티
└── README.md                # 이 파일
```

## 🚀 주요 기능

### 1. 상태 관리

- **Zustand 스토어**: 전역 인증 상태 관리
- **지속성**: 로컬 스토리지에 사용자 정보 저장
- **토큰 관리**: 액세스 토큰과 리프레시 토큰 자동 관리

### 2. 인증 방식

- **이메일/비밀번호 로그인**: 기본 로그인 방식
- **Google OAuth**: 소셜 로그인 지원
- **토큰 기반 인증**: JWT 토큰 사용

### 3. 보안 기능

- **토큰 만료 확인**: 자동 토큰 유효성 검사
- **자동 토큰 갱신**: 리프레시 토큰을 통한 자동 갱신
- **안전한 토큰 저장**: localStorage를 통한 안전한 저장

## 📖 사용법

### 1. 기본 인증 훅 사용

```tsx
import { useAuth } from '@/domains/auth/hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, isLoading, error, login, logout } = useAuth();

  if (isLoading) return <div>로딩 중...</div>;
  if (!isAuthenticated) return <div>로그인이 필요합니다</div>;

  return (
    <div>
      <h1>안녕하세요, {user?.name}님!</h1>
      <button onClick={logout}>로그아웃</button>
    </div>
  );
}
```

### 2. 특정 권한 확인

```tsx
import { useIsAdmin, useIsUser } from '@/domains/auth/hooks/useAuth';

function AdminPanel() {
  const isAdmin = useIsAdmin();
  const isUser = useIsUser();

  if (!isAdmin) {
    return <div>관리자 권한이 필요합니다</div>;
  }

  return <div>관리자 패널</div>;
}
```

### 3. 보호된 라우트 생성

```tsx
import { ProtectedRoute, AdminRoute } from '@/domains/auth/components/ProtectedRoute';

// 일반 사용자만 접근 가능
<ProtectedRoute>
  <UserDashboard />
</ProtectedRoute>

// 관리자만 접근 가능
<AdminRoute>
  <AdminPanel />
</AdminRoute>

// 특정 역할만 접근 가능
<ProtectedRoute requiredRole="moderator">
  <ModeratorPanel />
</ProtectedRoute>
```

### 4. 로그인 처리

```tsx
import { useAuth } from '@/domains/auth/hooks/useAuth';

function LoginPage() {
  const { login, setLoading, setError } = useAuth();

  const handleLogin = async (formData) => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      login(data); // Zustand 스토어에 저장
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return <LoginForm onSubmit={handleLogin} />;
}
```

### 5. Google OAuth 로그인

```tsx
import { initiateGoogleOAuth } from '@/domains/auth/utils/oauth';

function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    try {
      initiateGoogleOAuth();
    } catch (error) {
      console.error('Google OAuth error:', error);
    }
  };

  return <button onClick={handleGoogleLogin}>Google로 로그인</button>;
}
```

## 🔧 설정

### 1. 환경 변수 설정

```env
# Google OAuth 설정
GOOGLE_OAUTH_CLIENT_ID=your_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_client_secret
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3000/auth/google/callback
```

### 2. 앱 레이아웃에 AuthProvider 추가

```tsx
// src/app/layout.tsx
import { AuthProvider } from '@/domains/auth/components/AuthProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

## 🛡️ 보안 고려사항

### 1. 토큰 관리

- 액세스 토큰은 메모리에 저장 (localStorage는 보안상 위험)
- 리프레시 토큰은 httpOnly 쿠키에 저장 권장
- 토큰 만료 시 자동 갱신

### 2. CSRF 보호

- 모든 인증 요청에 CSRF 토큰 포함
- SameSite 쿠키 설정

### 3. XSS 방지

- 사용자 입력 검증 및 이스케이프
- Content Security Policy (CSP) 설정

## 🔄 상태 흐름

1. **앱 시작**: `AuthProvider`가 `useAuthInit` 훅을 통해 저장된 인증 상태 복원
2. **로그인**: 사용자가 로그인하면 토큰과 사용자 정보가 스토어에 저장
3. **토큰 갱신**: 액세스 토큰 만료 시 자동으로 리프레시 토큰을 사용해 갱신
4. **로그아웃**: 모든 토큰과 사용자 정보 제거

## 🧪 테스트

```tsx
// 인증 상태 테스트
import { render, screen } from '@testing-library/react';
import { useAuth } from '@/domains/auth/hooks/useAuth';

test('인증되지 않은 사용자는 로그인 페이지로 리다이렉트', () => {
  // 테스트 구현
});
```

## 📝 주의사항

1. **클라이언트 사이드**: 모든 인증 관련 코드는 클라이언트 사이드에서만 실행
2. **SSR 고려**: Next.js SSR과 호환되도록 설계
3. **타입 안전성**: TypeScript를 통한 완전한 타입 안전성 보장
4. **성능**: Zustand의 선택적 구독을 통한 최적화된 리렌더링

## 🔗 관련 파일

- `src/store/authStore.ts`: Zustand 인증 스토어
- `src/app/login/page.tsx`: 로그인 페이지
- `src/app/auth/google/callback/page.tsx`: Google OAuth 콜백 페이지
- `src/shared/components/LoginButton.tsx`: 헤더의 로그인 버튼
