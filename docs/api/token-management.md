# API 토큰 관리 시스템 현황 및 개선 계획

## 📋 개요

현재 프로젝트의 API 토큰 관리 시스템은 JWT 기반으로 구현되어 있으며, 프론트엔드에서 자동 토큰 갱신과 상태 관리를 담당하고 있습니다. 이 문서는 현재 구현 상태와 향후 개선 방안을 정리합니다.

## ✅ 현재 구현된 부분

### 1. 토큰 관리 시스템 (`src/domains/auth/utils/tokenManager.ts`)

#### 핵심 기능

- **토큰 저장/조회**: localStorage 기반 안전한 토큰 관리
- **만료 체크**: JWT 토큰 만료 시간 자동 검증
- **자동 갱신**: 토큰 만료 5분 전 자동 갱신 시도
- **에러 처리**: 토큰 파싱 실패 시 안전한 폴백

#### 주요 함수들

```typescript
// 토큰 저장
setTokens(accessToken: string, refreshToken: string): void

// 토큰 조회
getAccessToken(): string | null
getRefreshToken(): string | null

// 만료 체크
isTokenExpired(token: string): boolean
isTokenExpiringSoon(token: string, minutes?: number): boolean

// 자동 갱신
refreshAccessToken(): Promise<string | null>
```

### 2. API 설정 통합 (`src/api/config.ts`)

#### OpenAPI 통합

- **자동 토큰 설정**: localStorage에서 토큰 자동 로드
- **헤더 관리**: Bearer 토큰 자동 추가
- **개발 모드**: 설정 상태 로깅

#### 주요 함수들

```typescript
// API 설정 초기화
configureApi(): void

// 토큰 설정
setApiToken(token: string | null): void

// localStorage에서 토큰 업데이트
updateApiTokenFromStorage(): void
```

### 3. 자동 토큰 갱신 (`src/domains/auth/hooks/useTokenRefresh.ts`)

#### 갱신 로직

- **스케줄링**: 토큰 만료 5분 전 자동 갱신
- **에러 처리**: 갱신 실패 시 자동 로그아웃
- **상태 동기화**: React Query 캐시 무효화

```typescript
// 자동 갱신 스케줄링
const timeUntilExpiry = expiresAt - now - 5 * 60 * 1000; // 5분 버퍼
if (timeUntilExpiry > 0) {
  refreshTimeoutRef.current = setTimeout(() => {
    refreshMutation.mutate(refreshToken);
  }, timeUntilExpiry);
}
```

### 4. 인증 상태 관리

#### Zustand + React Query 조합

- **상태 관리**: Zustand로 전역 인증 상태 관리
- **데이터 페칭**: React Query로 사용자 프로필 관리
- **자동 동기화**: 토큰 변경 시 API 설정 자동 업데이트

#### 주요 훅들

```typescript
// 메인 인증 훅
useAuth(): AuthState & AuthActions

// 토큰 갱신 훅
useTokenRefresh(): UseMutationResult

// 인증 초기화 훅
useAuthInit(): void
```

## ⚠️ 현재 문제점 및 개선 필요 사항

### 1. 백엔드 API 엔드포인트 누락

#### 현재 상황

```typescript
// ✅ 구현됨
POST / auth / login;
GET / users / me / profile; // 프로필 조회 API

// ❌ 누락됨 (Next.js API route로 임시 구현)
POST / auth / refresh;
POST / auth / logout;
```

#### 임시 해결책

- Next.js API route를 통한 우회 처리
- 백엔드 API 완성 후 마이그레이션 계획 필요

### 2. 타입 안전성 문제

#### 현재 문제

```typescript
// OpenAPI 생성 코드에서 any 타입 사용
public static loginAuthLoginPost(
    requestBody: LoginRequest,
): CancelablePromise<any> // ❌ any 타입
```

#### 개선 필요

```typescript
// 명확한 응답 타입 정의 필요
interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: UserProfile;
  expires_in: number;
}
```

### 3. 보안 취약점

#### 현재 문제점

- **로그아웃**: 프론트에서만 토큰 삭제 (서버 무효화 없음)
- **토큰 관리**: refresh 토큰이 서버에서 관리되지 않음
- **세션 관리**: 다중 기기 로그인 시 개별 로그아웃 불가

#### 보안 강화 필요사항

- 서버에서 refresh 토큰 무효화
- 토큰 블랙리스트 구현
- 다중 기기 세션 관리

## 🔄 현재 임시 해결책

### 1. Next.js API Route 활용

```typescript
// src/app/api/auth/refresh/route.ts
// src/app/api/auth/logout/route.ts
// src/app/api/auth/profile/route.ts
```

### 2. 커스텀 타입 정의

```typescript
// src/domains/auth/types/auth.ts
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: UserProfile;
}
```

### 3. 일관된 에러 처리

```typescript
// src/domains/auth/utils/errorHandler.ts
export const handleAuthError = (error: unknown): AuthError => {
  // 통일된 에러 처리 로직
};
```

## 🚀 향후 개선 계획

### Phase 1: 백엔드 API 완성 (우선순위: 높음)

#### 1.1 OpenAPI 스펙 개선 요청

```yaml
# 추가 필요한 엔드포인트
POST /auth/refresh:
  summary: 토큰 갱신
  requestBody:
    content:
      application/json:
        schema:
          type: object
          properties:
            refresh_token:
              type: string
  responses:
    '200':
      description: 토큰 갱신 성공
      content:
        application/json:
          schema:
            type: object
            properties:
              access_token:
                type: string
              refresh_token:
                type: string
              expires_in:
                type: number

POST /auth/logout:
  summary: 로그아웃
  requestBody:
    content:
      application/json:
        schema:
          type: object
          properties:
            refresh_token:
              type: string
  responses:
    '200':
      description: 로그아웃 성공

GET /auth/profile:
  summary: 사용자 프로필 조회
  security:
    - bearerAuth: []
  responses:
    '200':
      description: 프로필 조회 성공
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/UserProfile'
```

#### 1.2 응답 타입 명확화

```typescript
// 개선된 응답 타입들
interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: UserProfile;
  expires_in: number;
}

interface RefreshResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  sui_address?: string;
  created_at: string;
  updated_at: string;
}
```

### Phase 2: 보안 강화 (우선순위: 높음)

#### 2.1 토큰 관리 개선

- **서버 관리**: refresh 토큰을 서버에서 관리 (DB/Redis)
- **블랙리스트**: 로그아웃된 토큰 블랙리스트 구현
- **세션 관리**: 다중 기기 세션 관리 및 개별 로그아웃

#### 2.2 로그아웃 보안 강화

```typescript
// 개선된 로그아웃 플로우
const logout = async () => {
  try {
    // 1. 서버에 로그아웃 요청
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    // 2. 로컬 토큰 삭제
    clearTokens();

    // 3. 상태 초기화
    useAuthStore.getState().logout();
  } catch (error) {
    // 에러가 있어도 로컬 로그아웃은 진행
    clearTokens();
    useAuthStore.getState().logout();
  }
};
```

### Phase 3: 사용자 경험 개선 (우선순위: 중간)

#### 3.1 자동 로그인 개선

- **네트워크 오류**: 재시도 로직 강화
- **로딩 상태**: 더 세밀한 로딩 상태 관리
- **오프라인 지원**: 오프라인 상태에서의 토큰 관리

#### 3.2 다중 인증 방식

- **소셜 로그인**: Google, GitHub 등 추가
- **2FA**: Two-Factor Authentication
- **비밀번호 변경**: 보안 강화

## 📊 현재 상태 요약

| 기능           | 상태      | 우선순위 | 비고                |
| -------------- | --------- | -------- | ------------------- |
| 토큰 저장/조회 | ✅ 완료   | -        | localStorage 기반   |
| 자동 만료 체크 | ✅ 완료   | -        | JWT 파싱 기반       |
| 자동 토큰 갱신 | ✅ 완료   | -        | 5분 전 갱신         |
| API 설정 통합  | ✅ 완료   | -        | OpenAPI 자동 설정   |
| 로그인         | ✅ 완료   | -        | JWT 기반            |
| 로그아웃       | ⚠️ 임시   | 높음     | 서버 무효화 없음    |
| 프로필 조회    | ✅ 완료   | -        | 백엔드 API 사용     |
| 보안 강화      | ❌ 미완료 | 높음     | 토큰 관리 개선 필요 |
| 다중 기기 관리 | ❌ 미완료 | 중간     | 세션 관리 필요      |

## 🔧 기술적 세부사항

### 현재 JWT 토큰 구조

```typescript
// 토큰 디코딩 결과
interface DecodedToken {
  exp: number; // 만료 시간
  iat: number; // 발급 시간
  sub: string; // 사용자 ID
  email?: string; // 이메일
  role?: string; // 사용자 역할
}
```

### 토큰 만료 처리 로직

```typescript
// 자동 갱신 스케줄링
const scheduleRefresh = () => {
  const accessToken = getAccessToken();
  if (!accessToken || isTokenExpired(accessToken)) {
    return;
  }

  const tokenData = JSON.parse(atob(accessToken.split('.')[1]));
  const expiresAt = tokenData.exp * 1000;
  const now = Date.now();
  const timeUntilExpiry = expiresAt - now - 5 * 60 * 1000; // 5분 버퍼

  if (timeUntilExpiry > 0) {
    refreshTimeoutRef.current = setTimeout(() => {
      refreshMutation.mutate(refreshToken);
    }, timeUntilExpiry);
  }
};
```

### 에러 처리 전략

```typescript
// 401 에러 시 자동 로그아웃
retry: (failureCount, error) => {
  if (error instanceof Error && error.message.includes('401')) {
    return false; // 재시도하지 않음
  }
  return failureCount < 3;
};

// 토큰 갱신 실패 시 로그아웃
onError: () => {
  logout();
};
```

## 📝 백엔드 요청 사항

### 1. OpenAPI 스펙 개선

- [ ] LoginResponse 타입 명확화 (any → 구체적 타입)
- [ ] refresh, logout, profile 엔드포인트 추가
- [ ] 에러 응답 타입 정의
- [ ] JWT 토큰 구조 문서화

### 2. 보안 요구사항

- [ ] refresh 토큰 서버 관리 방식 결정 (Stateless vs Stateful)
- [ ] 로그아웃 시 토큰 무효화 정책
- [ ] 다중 기기 세션 관리 정책
- [ ] 토큰 블랙리스트 구현 여부

### 3. JWT 토큰 구조 명확화

- [ ] jwt_token 파라미터의 정확한 의미 설명
- [ ] sui_address가 필요한 이유 문서화
- [ ] 토큰 만료 시간 정책 (access_token, refresh_token)
- [ ] 토큰 갱신 시 refresh_token 교체 여부

### 4. API 응답 표준화

```typescript
// 표준 응답 형식 제안
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// 인증 관련 응답들
interface LoginResponse
  extends ApiResponse<{
    access_token: string;
    refresh_token: string;
    user: UserProfile;
    expires_in: number;
  }> {}

interface RefreshResponse
  extends ApiResponse<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }> {}
```

## 🎯 결론

현재 API 토큰 관리 시스템은 **프론트엔드 측면에서 매우 잘 구현되어 있습니다**. 자동 토큰 갱신, 상태 관리, 에러 처리 등이 체계적으로 구현되어 있어 개발자 경험이 우수합니다.

**단기적으로는** 현재 구조로 개발을 진행하고, **중장기적으로는** 백엔드와 협의하여 완전한 인증 플로우를 구현하는 것이 권장됩니다.

### 다음 액션 아이템

1. [ ] 백엔드 팀과 인증 플로우 개선 논의
2. [ ] OpenAPI 스펙 개선 요청
3. [ ] 보안 강화 계획 수립
4. [ ] 사용자 경험 개선 방안 검토
5. [ ] Next.js API route에서 백엔드 API로 마이그레이션 계획

---

**문서 작성일**: 2024년 12월 19일  
**최종 업데이트**: 2024년 12월 19일  
**작성자**: Frontend Team
