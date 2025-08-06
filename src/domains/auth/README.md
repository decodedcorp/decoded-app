# Auth Domain

인증 관련 기능을 관리하는 도메인입니다.

## 🏗️ 새로운 구조 (리팩토링 후)

```
auth/
├── api/
│   └── authApi.ts              # 인증 관련 API 함수들
├── components/
│   ├── AuthProvider.tsx        # 인증 프로바이더
│   ├── LoginForm.tsx           # 로그인 폼
│   ├── LoginModal.tsx          # 로그인 모달
│   ├── AuthStatus.tsx          # 인증 상태 표시
│   ├── ProtectedRoute.tsx      # 보호된 라우트
│   └── TokenMonitor.tsx        # 토큰 만료 모니터링
├── constants/
│   └── index.ts                # 모든 상수 정의
├── hooks/
│   ├── useAuthCore.ts          # 핵심 인증 로직
│   ├── useAuth.ts              # 메인 인증 훅 (리팩토링됨)
│   ├── useAuthMutations.ts     # 인증 관련 mutation 훅들
│   ├── useAuthInit.ts          # 인증 초기화 훅
│   └── useTokenMonitor.ts      # 토큰 모니터링 훅
├── types/
│   └── auth.ts                 # 인증 관련 타입 정의
├── utils/
│   ├── tokenManager.ts         # 토큰 관리 유틸리티 (최적화됨)
│   ├── tokenDecoder.ts         # 토큰 디코딩 유틸리티 (신규)
│   └── responseMapper.ts       # API 응답 변환 매퍼 (신규)
└── README.md
```

## 🚀 주요 개선사항

### 1. **단일 책임 원칙 적용**

- `useAuth` 훅을 `useAuthCore`와 `useAuth`로 분리
- 토큰 모니터링을 별도 훅(`useTokenMonitor`)으로 분리
- 토큰 디코딩 로직을 `TokenDecoder` 클래스로 분리

### 2. **성능 최적화**

- 불필요한 리렌더링 방지
- React Query 캐시 설정 최적화
- 토큰 체크 간격 조정 (5분 → 10분)

### 3. **코드 재사용성 향상**

- `ResponseMapper` 클래스로 API 응답 변환 로직 통합
- 상수를 `constants/index.ts`로 통합
- 공통 유틸리티 함수들 분리

### 4. **타입 안전성 강화**

- 더 엄격한 타입 정의
- 에러 처리 개선
- API 응답 검증 강화

## 🔧 주요 기능

### 1. **핵심 인증 훅 (`useAuthCore`)**

- 기본적인 인증 상태와 사용자 정보 관리
- React Query를 통한 효율적인 데이터 페칭
- 최적화된 캐시 설정

### 2. **토큰 모니터링 (`useTokenMonitor`)**

- 토큰 만료 시 자동 로그아웃
- 주기적 토큰 상태 확인
- 메모리 누수 방지를 위한 적절한 정리

### 3. **토큰 디코더 (`TokenDecoder`)**

- JWT 토큰 디코딩 전용 클래스
- 다양한 토큰 정보 추출 메서드
- 에러 처리 및 타입 안전성 보장

### 4. **응답 매퍼 (`ResponseMapper`)**

- 백엔드 API 응답을 도메인 타입으로 변환
- 일관된 에러 처리
- 타입 안전한 데이터 변환

## 📖 사용법

### 기본 인증 훅 사용

```tsx
import { useAuth } from '@/domains/auth/hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <button onClick={() => login(data)}>Login</button>;
  }

  return (
    <div>
      <p>Welcome, {user?.nickname}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 토큰 모니터링 설정

```tsx
import { TokenMonitor } from '@/domains/auth/components/TokenMonitor';

function App() {
  return (
    <div>
      <TokenMonitor /> {/* 앱 최상위에 배치 */}
      {/* 나머지 앱 컴포넌트들 */}
    </div>
  );
}
```

### 특정 역할 확인

```tsx
import { useIsAdmin, useIsModerator } from '@/domains/auth/hooks/useAuth';

function AdminPanel() {
  const isAdmin = useIsAdmin();
  const isModerator = useIsModerator();

  if (!isAdmin && !isModerator) {
    return <div>Access denied</div>;
  }

  return <div>Admin Panel</div>;
}
```

### 로그인 처리

```tsx
import { useLogin } from '@/domains/auth/hooks/useAuthMutations';

function LoginForm() {
  const loginMutation = useLogin();

  const handleLogin = async (credentials) => {
    try {
      const response = await loginMutation.mutateAsync(credentials);
      // 로그인 성공 처리
    } catch (error) {
      // 에러 처리
    }
  };

  return <form onSubmit={handleLogin}>{/* 폼 내용 */}</form>;
}
```

## 🔒 보안

- 토큰은 sessionStorage에 저장 (브라우저 종료 시 삭제)
- Refresh 토큰은 localStorage에 저장 (장기 보관)
- 토큰 만료 시 자동 로그아웃
- API 요청 시 자동 토큰 첨부
- 에러 발생 시 세션 정리

## ⚡ 성능

- React Query를 통한 효율적인 캐싱
- 불필요한 API 호출 방지
- 최적화된 리렌더링
- 메모리 누수 방지

## 🛠️ 개발 가이드

### 새로운 훅 추가 시

1. `hooks/` 디렉토리에 새 파일 생성
2. 단일 책임 원칙 준수
3. 적절한 타입 정의
4. `index.ts`에 export 추가

### 새로운 유틸리티 추가 시

1. `utils/` 디렉토리에 새 파일 생성
2. 클래스 기반 구조 사용
3. 에러 처리 포함
4. 타입 안전성 보장

### 상수 추가 시

1. `constants/index.ts`에 추가
2. 적절한 카테고리로 분류
3. `as const` 사용으로 타입 안전성 보장
