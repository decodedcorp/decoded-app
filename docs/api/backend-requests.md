# 백엔드 API 개선 요청사항

## 📋 개요

프론트엔드 개발 진행 중 발견된 API 관련 개선사항들을 정리하여 백엔드 팀에 전달합니다. 현재 프론트엔드에서 임시 해결책으로 Next.js API route를 사용하고 있으나, 장기적으로는 백엔드 API로 통합하는 것이 필요합니다.

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

## 📋 구현 우선순위

### Phase 1: 긴급 (1-2주)

1. [ ] 토큰 갱신 API (`POST /auth/refresh`)
2. [ ] 로그아웃 API (`POST /auth/logout`)
3. [x] 사용자 프로필 API (`GET /users/me/profile`) ✅ 완료
4. [ ] LoginResponse 타입 명확화

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

- [ ] `POST /auth/refresh` 엔드포인트 구현
- [ ] `POST /auth/logout` 엔드포인트 구현
- [x] `GET /users/me/profile` 엔드포인트 구현 ✅ 완료
- [ ] LoginResponse 타입 명확화
- [ ] 에러 응답 타입 정의
- [ ] CORS 설정
- [ ] Rate limiting 구현
- [ ] 로깅 설정

### 프론트엔드 마이그레이션 체크리스트

- [ ] Next.js API route에서 백엔드 API로 전환
- [ ] 타입 정의 업데이트
- [ ] 에러 처리 로직 업데이트
- [ ] 테스트 코드 업데이트
- [ ] 문서 업데이트

## 📞 연락처

**프론트엔드 담당자**: Frontend Team  
**문서 작성일**: 2024년 12월 19일  
**최종 업데이트**: 2024년 12월 19일

---

**참고 문서:**

- [API 토큰 관리 시스템 현황](./token-management.md)
- [인증 시스템 현황](./auth.md)
