# 인증 시스템 현황 및 개선 계획

## 📋 개요

현재 프로젝트의 인증 시스템은 JWT 토큰 기반으로 구현되어 있으며, 기본적인 로그인 기능은 동작하지만 일부 기능이 누락되어 있습니다. 이 문서는 현재 상황과 향후 개선 계획을 정리합니다.

## ✅ 현재 구현된 부분

### 1. 인증 API

- **로그인**: `POST /auth/login`
  - JWT 토큰 기반 인증
  - Sui 주소 연동 (Web3 인증)
  - 이메일 선택적 제공
  - 마케팅 동의 옵션

### 2. 토큰 관리

- **저장소**: localStorage
- **토큰 타입**: access_token, refresh_token
- **자동 헤더**: Bearer 토큰 자동 추가
- **만료 체크**: JWT 토큰 만료 시간 자동 검증

### 3. 프론트엔드 구조

- **상태 관리**: Zustand + React Query
- **자동 갱신**: 토큰 만료 5분 전 자동 갱신 시도
- **에러 처리**: 401 에러 시 자동 로그아웃
- **SSR 안전**: 서버사이드 렌더링 시 localStorage 접근 방지

### 4. API 통합

- **타입 안전성**: OpenAPI 스펙 기반 자동 생성
- **일관된 구조**: 모든 API 호출이 React Query 훅으로 구현
- **캐싱**: 적절한 캐시 전략 적용

## ⚠️ 현재 문제점 및 개선 필요 사항

### 1. API 엔드포인트 누락

```typescript
// 현재 존재하는 API
POST /auth/login ✅

// 누락된 API들
POST /auth/refresh ❌
POST /auth/logout ❌
```

### 2. 타입 안전성 문제

```typescript
// 현재: 응답 타입이 any
public static loginAuthLoginPost(
    requestBody: LoginRequest,
): CancelablePromise<any> // ❌ any 타입

// 개선 필요: 명확한 응답 타입
interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}
```

### 3. 보안 취약점

- **로그아웃**: 프론트에서만 토큰 삭제 (서버 무효화 없음)
- **토큰 관리**: refresh 토큰이 서버에서 관리되지 않음
- **세션 관리**: 다중 기기 로그인 시 개별 로그아웃 불가

### 4. 임시 해결책

- refresh/logout/profile API는 Next.js API route로 우회 처리
- 타입 안전성을 위해 커스텀 타입 정의
- 일관성 있는 에러 처리 구현

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

### Phase 1: 백엔드 API 추가 (우선순위: 중)

**목표**: 완전한 인증 플로우 구현

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
// 개선된 LoginResponse 타입
interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: UserProfile;
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

**목표**: 보안 취약점 해결

#### 2.1 토큰 관리 개선

- refresh 토큰 서버 관리 (DB/Redis)
- 토큰 블랙리스트 구현
- 다중 기기 세션 관리

#### 2.2 로그아웃 보안 강화

- 서버에서 refresh 토큰 무효화
- 모든 기기에서 로그아웃 옵션
- 세션 만료 시간 설정

### Phase 3: 사용자 경험 개선 (우선순위: 낮음)

**목표**: 더 나은 UX 제공

#### 3.1 자동 로그인

- 토큰 만료 시 자동 갱신
- 네트워크 오류 시 재시도 로직
- 로딩 상태 개선

#### 3.2 다중 인증 방식

- 소셜 로그인 (Google, GitHub 등)
- 2FA (Two-Factor Authentication)
- 비밀번호 변경

## 📊 현재 상태 요약

| 기능        | 상태      | 우선순위 | 비고                |
| ----------- | --------- | -------- | ------------------- |
| 로그인      | ✅ 완료   | -        | JWT 기반            |
| 토큰 저장   | ✅ 완료   | -        | localStorage        |
| 자동 갱신   | ✅ 완료   | -        | 5분 전 갱신         |
| 로그아웃    | ⚠️ 임시   | 중       | 서버 무효화 없음    |
| 프로필 조회 | ⚠️ 임시   | 중       | Next.js API route   |
| 보안 강화   | ❌ 미완료 | 높음     | 토큰 관리 개선 필요 |

## �� 기술적 세부사항

### 현재 JWT 토큰 구조

```typescript
// LoginRequest
{
  jwt_token: string;      // JWT 토큰 (필수)
  sui_address: string;    // Sui 주소 (필수)
  email?: string;         // 이메일 (선택)
  marketing?: boolean;    // 마케팅 동의 (선택)
}
```

### 토큰 만료 처리

```typescript
// 자동 갱신 로직
const timeUntilExpiry = expiresAt - now - 5 * 60 * 1000; // 5분 버퍼
if (timeUntilExpiry > 0) {
  // 자동 갱신 스케줄링
}
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
```

## 📝 백엔드 요청 사항

### 1. OpenAPI 스펙 개선

- [ ] LoginResponse 타입 명확화
- [ ] refresh, logout, profile 엔드포인트 추가
- [ ] 에러 응답 타입 정의

### 2. JWT 토큰 구조 명확화

- [ ] jwt_token 파라미터의 정확한 의미 설명
- [ ] sui_address가 필요한 이유 문서화
- [ ] 토큰 관리 방식 (Stateless vs Stateful) 결정

### 3. 보안 요구사항

- [ ] refresh 토큰 서버 관리 방식
- [ ] 로그아웃 시 토큰 무효화 정책
- [ ] 다중 기기 세션 관리 정책

## �� 결론

현재 인증 시스템은 **기본 기능은 동작하지만 보안과 완성도 측면에서 개선이 필요**합니다.

**단기적으로는** 현재 구조로 개발을 진행하고, **중장기적으로는** 백엔드와 협의하여 완전한 인증 플로우를 구현하는 것이 권장됩니다.

### 다음 액션 아이템

1. [ ] 백엔드 팀과 인증 플로우 개선 논의
2. [ ] OpenAPI 스펙 개선 요청
3. [ ] 보안 강화 계획 수립
4. [ ] 사용자 경험 개선 방안 검토

---