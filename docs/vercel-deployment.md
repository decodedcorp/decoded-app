# Vercel 배포 가이드

## 🎯 Vercel 배포의 장점

### ✅ 맥미니 vs Vercel 비교

| 항목 | 맥미니 | Vercel |
|------|--------|--------|
| **설정 복잡도** | 🔴 복잡 (방화벽, DNS, 서버 관리) | 🟢 간단 (Git 연동) |
| **유지보수** | 🔴 수동 관리 필요 | 🟢 자동 관리 |
| **비용** | 🔴 서버 비용 + 전기료 | 🟢 무료 플랜 있음 |
| **성능** | 🟡 제한적 | 🟢 글로벌 CDN |
| **SSL/HTTPS** | 🔴 수동 설정 | 🟢 자동 설정 |
| **도메인** | 🔴 DNS 설정 필요 | 🟢 자동 연결 |
| **Google OAuth** | 🔴 IP 주소 문제 | 🟢 도메인 자동 제공 |

## 🚀 Vercel 배포 방법

### 방법 1: Vercel CLI 사용

#### 1. 로그인
```bash
npx vercel login
```

#### 2. 프로젝트 배포
```bash
npx vercel
```

#### 3. 프로덕션 배포
```bash
npx vercel --prod
```

### 방법 2: Vercel 웹 대시보드 사용

#### 1. GitHub 연동
1. [vercel.com](https://vercel.com) 접속
2. GitHub 계정으로 로그인
3. **New Project** 클릭
4. `decoded-app` 저장소 선택

#### 2. 프로젝트 설정
```
Framework Preset: Next.js
Root Directory: ./
Build Command: yarn build
Output Directory: .next
Install Command: yarn install
```

#### 3. 환경 변수 설정
```
NEXT_PUBLIC_API_BASE_URL=https://dev.decoded.style
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=https://your-app.vercel.app/auth/callback
```

## 🔧 환경 변수 설정

### 개발 환경
```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=https://dev.decoded.style
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback
```

### Vercel 환경
```bash
# Vercel 대시보드에서 설정
NEXT_PUBLIC_API_BASE_URL=https://dev.decoded.style
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=https://your-app.vercel.app/auth/callback
```

## 🌐 도메인 설정

### Vercel 제공 도메인
- **개발**: `your-app.vercel.app`
- **프로덕션**: `your-app.vercel.app`

### 커스텀 도메인 연결
1. **Vercel 대시보드** → **Settings** → **Domains**
2. **Add Domain** 클릭
3. `decoded.style` 또는 `dev.decoded.style` 입력
4. DNS 설정 안내에 따라 설정

## 🔐 Google OAuth 설정

### Vercel 도메인 사용
```
Authorized redirect URIs:
✅ https://your-app.vercel.app/auth/callback
✅ https://decoded.style/auth/callback (커스텀 도메인)

Authorized JavaScript origins:
✅ https://your-app.vercel.app
✅ https://decoded.style
```

### 환경별 설정
```bash
# 개발 (로컬)
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback

# Vercel (배포)
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=https://your-app.vercel.app/auth/callback
```

## 📋 배포 단계

### 1. 코드 준비
```bash
# 빌드 테스트
yarn build

# 타입 체크
yarn type-check
```

### 2. Vercel 배포
```bash
# 초기 배포
npx vercel

# 프로덕션 배포
npx vercel --prod
```

### 3. 환경 변수 설정
1. **Vercel 대시보드** → **Settings** → **Environment Variables**
2. 필요한 환경 변수 추가

### 4. 도메인 연결
1. **Settings** → **Domains**
2. 커스텀 도메인 추가

## 🔍 배포 확인

### 1. 배포 상태 확인
```bash
npx vercel ls
```

### 2. 로그 확인
```bash
npx vercel logs
```

### 3. 웹사이트 접속
```
https://your-app.vercel.app
```

## 🚨 문제 해결

### 일반적인 문제들

#### 1. 빌드 실패
- **원인**: 환경 변수 누락, 의존성 문제
- **해결**: Vercel 대시보드에서 환경 변수 설정

#### 2. Google OAuth 오류
- **원인**: 리다이렉트 URI 불일치
- **해결**: Google Cloud Console에서 Vercel 도메인 추가

#### 3. API 연결 실패
- **원인**: CORS 설정, API URL 문제
- **해결**: API 서버 CORS 설정 확인

### 디버깅 명령어
```bash
# 배포 상태 확인
npx vercel ls

# 로그 확인
npx vercel logs

# 환경 변수 확인
npx vercel env ls

# 프로젝트 정보
npx vercel inspect
```

## 💰 비용

### Vercel 무료 플랜
- **월 방문자**: 100,000명
- **서버리스 함수**: 100GB-hours
- **대역폭**: 100GB
- **도메인**: 무제한
- **SSL**: 자동

### 유료 플랜 (Pro)
- **월 방문자**: 1,000,000명
- **서버리스 함수**: 1,000GB-hours
- **대역폭**: 1TB
- **가격**: $20/월

## 📚 참고 자료

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Vercel CLI 문서](https://vercel.com/docs/cli)

---

**결론**: Vercel 배포가 맥미니보다 훨씬 간단하고 안정적입니다! 🎉
