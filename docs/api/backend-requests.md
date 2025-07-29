# 백엔드 API 개선 요청사항

## 📋 개요

프론트엔드 개발 진행 중 발견된 API 관련 개선사항들을 정리하여 백엔드 팀에 전달합니다. 현재 프론트엔드에서 Google OAuth 2.0 기반의 완전한 인증 시스템을 구현했으며, 일부 기능은 Next.js API route를 통해 임시 구현하고 있습니다. 장기적으로는 백엔드 API로 통합하여 보안성과 안정성을 향상시키는 것이 필요합니다.

## ✅ 완료 현황 요약

**Phase 1 (긴급)**: 일부 완료 ⚠️

- [x] 사용자 프로필 API (`GET /users/me/profile`) ✅ 완료
- [ ] 토큰 갱신 API (`POST /auth/refresh`) ❌ 미완료
- [ ] 로그아웃 API (`POST /auth/logout`) ❌ 미완료
- [ ] LoginResponse 타입 명확화 ❌ 미완료

**백엔드 구현**: 일부 완료 ⚠️

- [x] 사용자 프로필 조회 API ✅ 완료
- [ ] 인증 엔드포인트 (refresh, logout) ❌ 미완료
- [ ] 타입 정의 및 에러 응답 표준화 ❌ 미완료
- [ ] CORS 설정 및 Rate limiting ❌ 미완료
- [ ] 로깅 시스템 구축 ❌ 미완료

**프론트엔드 임시 구현**: 완료 ✅

- Next.js API route로 임시 구현
- 타입 정의 및 에러 처리 구현
- 테스트 코드 및 문서 업데이트

## 🎯 현재 구현 현황

### ✅ 완료된 기능

- **Google OAuth 2.0 로그인 플로우** - 완전 구현
- **토큰 관리 시스템** - sessionStorage 기반
- **인증 상태 관리** - Zustand + React Query
- **사용자 프로필 조회** - typgen API 활용
- **페이지 새로고침 시 로그인 유지**
- **프록시 API 라우트** - CORS 우회

### 🔄 임시 구현 중인 기능

- **토큰 갱신** - Next.js API route (`/api/auth/refresh`)
- **로그아웃** - 클라이언트 측 토큰 삭제만

## 🚨 긴급 요청사항

### 1. 누락된 인증 API 엔드포인트

현재 프론트엔드에서 Next.js API route로 임시 구현하고 있는 엔드포인트들을 백엔드에서 구현해주세요.

#### 1.1 토큰 갱신 API

```yaml
POST /auth/refresh
summary: Access Token 갱신
description: Refresh Token을 사용하여 새로운 Access Token을 발급받습니다.

requestBody:
  content:
    application/json:
      schema:
        type: object
        required:
          - refresh_token
        properties:
          refresh_token:
            type: string
            description: 현재 저장된 refresh token

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
              description: 새로운 access token
            refresh_token:
              type: string
              description: 새로운 refresh token (선택적, 기존 토큰 유지 가능)
            expires_in:
              type: number
              description: access token 만료 시간 (초)
  '401':
    description: Refresh token이 유효하지 않음
  '400':
    description: 잘못된 요청 형식
```

#### 1.2 로그아웃 API

```yaml
POST /auth/logout
summary: 사용자 로그아웃
description: 현재 세션을 종료하고 refresh token을 무효화합니다.

requestBody:
  content:
    application/json:
      schema:
        type: object
        required:
          - refresh_token
        properties:
          refresh_token:
            type: string
            description: 무효화할 refresh token

responses:
  '200':
    description: 로그아웃 성공
    content:
      application/json:
        schema:
          type: object
          properties:
            message:
              type: string
              example: "Successfully logged out"
  '401':
    description: 인증 실패
```

#### 1.3 사용자 프로필 조회 API

```yaml
# ✅ 이미 구현됨
GET /users/me/profile
summary: 사용자 프로필 조회
description: 현재 로그인한 사용자의 프로필 정보를 조회합니다.

security:
  - bearerAuth: []

responses:
  '200':
    description: 프로필 조회 성공
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/GetUserProfile'
  '401':
    description: 인증 실패
  '404':
    description: 사용자를 찾을 수 없음
```

### 2. 타입 안전성 개선

#### 2.1 LoginResponse 타입 명확화

현재 OpenAPI 생성 코드에서 `any` 타입을 사용하고 있어 타입 안전성이 떨어집니다.

**현재 문제:**

```typescript
public static loginAuthLoginPost(
    requestBody: LoginRequest,
): CancelablePromise<any> // ❌ any 타입
```

**개선 요청:**

```typescript
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

enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}
```

#### 2.2 에러 응답 타입 정의

```typescript
interface ApiError {
  code: string;
  message: string;
  details?: any;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}
```

## 🔒 보안 강화 요청사항

### 1. 토큰 관리 개선

#### 1.1 Refresh Token 서버 관리

현재 refresh token이 클라이언트에서만 관리되고 있어 보안상 취약합니다.

**요청사항:**

- Refresh token을 서버에서 관리 (DB/Redis)
- 토큰 블랙리스트 구현
- 다중 기기 세션 관리

#### 1.2 로그아웃 보안 강화

**현재 문제:** 프론트엔드에서만 토큰 삭제 (서버 무효화 없음)

**개선 요청:**

- 로그아웃 시 서버에서 refresh token 무효화
- 모든 기기에서 로그아웃 옵션 제공
- 세션 만료 시간 설정

### 2. JWT 토큰 구조 명확화

#### 2.1 토큰 파라미터 설명

**요청사항:**

- `jwt_token` 파라미터의 정확한 의미와 용도 설명
- `sui_address`가 인증에 필요한 이유 문서화
- 토큰 만료 시간 정책 (access_token, refresh_token) 명시

#### 2.2 토큰 갱신 정책

**질문사항:**

- 토큰 갱신 시 refresh_token도 함께 교체하는가?
- Refresh token의 만료 시간은 얼마인가?
- 다중 기기 로그인 시 refresh token 관리 방식은?

## 📊 API 응답 표준화

### 1. 일관된 응답 형식

모든 API 응답에 일관된 형식을 적용해주세요.

```typescript
// 성공 응답
{
  "success": true,
  "data": {
    // 실제 데이터
  }
}

// 에러 응답
{
  "success": false,
  "error": {
    "code": "AUTH_INVALID_TOKEN",
    "message": "Invalid or expired token",
    "details": {
      // 추가 에러 정보
    }
  }
}
```

### 2. HTTP 상태 코드 표준화

```yaml
# 권장 HTTP 상태 코드
200: 성공
201: 생성 성공 (회원가입 등)
400: 잘못된 요청
401: 인증 실패
403: 권한 없음
404: 리소스 없음
409: 충돌 (중복 이메일 등)
422: 유효성 검사 실패
500: 서버 오류
```

## 🔧 기술적 요구사항

### 1. CORS 설정

프론트엔드 도메인에서의 API 호출을 허용해주세요.

```yaml
# 권장 CORS 설정
Access-Control-Allow-Origin: https://decoded.style
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

### 2. Rate Limiting

보안을 위해 API 호출 제한을 설정해주세요.

```yaml
# 권장 Rate Limiting
- 로그인: 5회/분
- 토큰 갱신: 10회/분
- 일반 API: 100회/분
```

### 3. 로깅 및 모니터링

```yaml
# 요청 로깅
- 인증 실패 로그
- 토큰 갱신 로그
- 비정상적인 API 호출 패턴 감지
```

## 🚀 향후 발전 방향

### Phase 1: 즉시 가능한 개선 (백엔드 협의 불필요)

1. **멀티탭 인증 동기화**

   - Storage event 활용한 탭 간 상태 공유
   - 로그아웃 시 모든 탭에서 동시 로그아웃

2. **Zustand persist 구조 보완**

   - 더 안정적인 상태 복원
   - 에러 복구 메커니즘 강화

3. **UX 개선**
   - 로딩 상태 표시 개선
   - 에러 메시지 사용자 친화적 처리

### Phase 2: 백엔드 협의 후 구현

1. **Refresh Token 도입**

   - 자동 토큰 갱신
   - 보안성 향상

2. **HttpOnly Cookie 적용**
   - XSS 방지
   - 서버 사이드 토큰 관리

## 📋 구현 우선순위

### Phase 1: 긴급 (1-2주)

1. [ ] 토큰 갱신 API (`POST /auth/refresh`) ❌ 미완료
2. [ ] 로그아웃 API (`POST /auth/logout`) ❌ 미완료
3. [x] 사용자 프로필 API (`GET /users/me/profile`) ✅ 완료
4. [ ] LoginResponse 타입 명확화 ❌ 미완료

### Phase 2: 중요 (2-4주)

1. [ ] Refresh token 서버 관리
2. [ ] 토큰 블랙리스트 구현
3. [ ] API 응답 표준화
4. [ ] 에러 응답 타입 정의

### Phase 3: 개선 (4-8주)

1. [ ] 다중 기기 세션 관리
2. [ ] Rate limiting 구현
3. [ ] 로깅 및 모니터링 강화
4. [ ] 보안 강화 (2FA 등)

## 📞 협의 필요 사항

### 1. 기술 스택 관련

- Refresh token 저장소 (DB vs Redis)
- JWT 라이브러리 선택
- 인증 미들웨어 구현 방식

### 2. 보안 정책

- 토큰 만료 시간 정책
- 다중 기기 로그인 정책
- 비밀번호 정책 (향후 구현 시)

### 3. 개발 프로세스

- API 문서화 방식
- 테스트 전략
- 배포 프로세스

## 📝 체크리스트

### 백엔드 구현 체크리스트

- [ ] `POST /auth/refresh` 엔드포인트 구현 ❌ 미완료
- [ ] `POST /auth/logout` 엔드포인트 구현 ❌ 미완료
- [x] `GET /users/me/profile` 엔드포인트 구현 ✅ 완료
- [ ] LoginResponse 타입 명확화 ❌ 미완료
- [ ] 에러 응답 타입 정의 ❌ 미완료
- [ ] CORS 설정 ❌ 미완료
- [ ] Rate limiting 구현 ❌ 미완료
- [ ] 로깅 설정 ❌ 미완료

### 프론트엔드 임시 구현 체크리스트

- [x] Next.js API route로 임시 구현 ✅ 완료
- [x] 타입 정의 구현 ✅ 완료
- [x] 에러 처리 로직 구현 ✅ 완료
- [x] 테스트 코드 구현 ✅ 완료
- [x] 문서 업데이트 ✅ 완료

---

**참고 문서:**

- [API 토큰 관리 시스템 현황](./token-management.md)
- [인증 시스템 현황](./auth.md)

## 🤝 백엔드 협의 목록 정리

아래는 백엔드와 협의가 필요한 주요 항목을 정리한 목록입니다. 각 항목은 구현, 설계 또는 정책 결정이 필요한 주제입니다.

### 🔐 인증 및 보안 관련

- [ ] Refresh Token 서버 저장 방식 (DB vs Redis)
- [ ] 다중 기기 로그인 및 세션 관리 정책
- [ ] Refresh Token의 만료 시간 및 갱신 정책
- [ ] 토큰 갱신 시 refresh_token 재발급 여부
- [ ] HttpOnly Cookie 기반 토큰 전달 여부
- [ ] JWT 내부 payload 구조 확정 (`sub`, `exp`, `role`, `doc_id` 등)

### 📦 API 명세 및 타입

- [ ] `POST /auth/refresh` 구현 명세 확인
- [ ] `POST /auth/logout` 구현 방식 및 토큰 무효화 방식
- [ ] LoginResponse 타입 명세 확정 (`access_token`, `refresh_token`, `user`, `expires_in`)
- [ ] 에러 응답 형식 및 ApiError 표준화

### 🧰 시스템 및 인프라

- [ ] CORS 설정 범위 (도메인, 인증 포함 여부)
- [ ] Rate Limiting 기준 설정 (로그인, 토큰 갱신 등)
- [ ] 인증 관련 요청 로깅 및 모니터링 방식
- [ ] 인증 실패/성공 로그 저장 위치 및 주기

### 📄 기타

- [ ] API 테스트 및 QA 프로세스 협의
- [ ] API 명세 문서 업데이트 주기
- [ ] 프론트엔드/백엔드 개발 주기 및 배포 계획 공유

위 목록은 백엔드와의 정기 미팅에서 하나씩 체크하며 진행하는 것을 추천합니다.
