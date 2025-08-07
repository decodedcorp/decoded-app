# Google OAuth 설정 가이드

## 🚨 현재 문제

Google OAuth에서 IP 주소(`121.130.214.186`)를 사용한 리다이렉트 URI가 허용되지 않습니다.

**오류 메시지:**

- `Invalid Redirect: must end with a public top-level domain`
- `Invalid Origin: must end with a public top-level domain`

## ✅ 해결 방법

### 방법 1: 도메인 사용 (권장)

#### 1. 도메인 확인

- **보유 도메인**: `decoded.style`
- **개발 서브도메인**: `dev.decoded.style`

#### 2. DNS 설정

```
A 레코드: dev.decoded.style → 121.130.214.186
```

#### 3. Google OAuth 콘솔 설정

**Authorized redirect URIs:**

```
✅ https://decoded.style/auth/callback
✅ https://dev.decoded.style/auth/callback
✅ http://localhost:3000/auth/callback (개발용)
❌ http://121.130.214.186:3000/auth/callback (제거)
```

**Authorized JavaScript origins:**

```
✅ https://decoded.style
✅ https://dev.decoded.style
✅ http://localhost:3000 (개발용)
❌ http://121.130.214.186:3000 (제거)
```

### 방법 2: 로컬 개발용 설정

개발 중에는 로컬에서만 테스트:

**Authorized redirect URIs:**

```
✅ http://localhost:3000/auth/callback
✅ http://127.0.0.1:3000/auth/callback
```

**Authorized JavaScript origins:**

```
✅ http://localhost:3000
✅ http://127.0.0.1:3000
```

### 방법 3: 테스트 사용자 설정

Google OAuth 동의 화면에서 테스트 사용자 추가:

1. **OAuth 동의 화면** → **테스트 사용자**
2. **사용자 추가** → 개발자 이메일 입력
3. **저장**

## 🔧 환경 변수 설정

### 로컬 개발

```bash
# .env.local
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback
```

### 개발 서버 (Mac Mini)

```bash
# .env.development
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=https://dev.decoded.style/auth/callback
```

### 프로덕션

```bash
# .env.production
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=https://decoded.style/auth/callback
```

## 📋 설정 단계

### 1. Google Cloud Console 접속

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 선택 또는 생성

### 2. OAuth 동의 화면 설정

1. **API 및 서비스** → **OAuth 동의 화면**
2. **사용자 유형**: 외부
3. **앱 정보** 입력
4. **테스트 사용자** 추가

### 3. 사용자 인증 정보 설정

1. **API 및 서비스** → **사용자 인증 정보**
2. **OAuth 2.0 클라이언트 ID** 생성 또는 편집
3. **승인된 리디렉션 URI** 설정
4. **승인된 JavaScript 원본** 설정

### 4. 클라이언트 ID 복사

- 생성된 **클라이언트 ID**를 환경 변수에 설정

## 🔍 문제 해결

### 일반적인 오류

#### 1. "Invalid Redirect URI"

- **원인**: Google OAuth에 등록되지 않은 URI
- **해결**: Google Cloud Console에서 URI 추가

#### 2. "Invalid Origin"

- **원인**: JavaScript 원본이 등록되지 않음
- **해결**: 승인된 JavaScript 원본에 도메인 추가

#### 3. "Access Blocked"

- **원인**: 테스트 사용자가 아닌 경우
- **해결**: OAuth 동의 화면에서 테스트 사용자 추가

### 디버깅 팁

1. **브라우저 개발자 도구**에서 네트워크 탭 확인
2. **Google OAuth 콘솔**에서 오류 로그 확인
3. **환경 변수**가 올바르게 설정되었는지 확인

## 📚 참고 자료

- [Google OAuth 2.0 가이드](https://developers.google.com/identity/protocols/oauth2)
- [Next.js OAuth 예제](https://nextjs.org/docs/authentication)
- [Google Cloud Console](https://console.cloud.google.com/)

---

**참고**: IP 주소 대신 도메인을 사용하는 것이 Google OAuth의 보안 정책입니다.
