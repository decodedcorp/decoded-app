# Decoded App 접속 가이드

## 🌐 개발 서버 접속

### 기본 접속 정보

- **URL**: `http://121.130.214.186:3000`
- **환경**: Development
- **API**: `https://dev.decoded.style`

### 접속 방법

#### 1. 웹 브라우저로 접속

1. 웹 브라우저 열기 (Chrome, Safari, Firefox 등)
2. 주소창에 다음 URL 입력:
   ```
   http://121.130.214.186:3000
   ```
3. Enter 키 누르기

#### 2. 모바일에서 접속

1. 모바일 브라우저 열기
2. 주소창에 다음 URL 입력:
   ```
   http://121.130.214.186:3000
   ```
3. 접속

### 주요 페이지

- **메인 페이지**: `http://121.130.214.186:3000`
- **채널 페이지**: `http://121.130.214.186:3000/channels`
- **로그인**: `http://121.130.214.186:3000/login`

## 🔧 서버 관리 (개발자용)

### 서버 상태 확인

```bash
ssh decoded@121.130.214.186 -p 2202 "lsof -i :3000"
```

### 서버 로그 확인

```bash
ssh decoded@121.130.214.186 -p 2202 "cd /Users/decoded/decoded-app && tail -f server.log"
```

### 서버 재시작

```bash
ssh decoded@121.130.214.186 -p 2202 "export NVM_DIR=\"\$HOME/.nvm\" && [ -s \"\$NVM_DIR/nvm.sh\" ] && \. \"\$NVM_DIR/nvm.sh\" && cd /Users/decoded/decoded-app && pkill -f 'next start' && nohup npx next start -p 3000 > server.log 2>&1 &"
```

### 서버 중지

```bash
ssh decoded@121.130.214.186 -p 2202 "pkill -f 'next start'"
```

### 의존성 재설치 (문제 발생 시)

```bash
ssh decoded@121.130.214.186 -p 2202 "export NVM_DIR=\"\$HOME/.nvm\" && [ -s \"\$NVM_DIR/nvm.sh\" ] && \. \"\$NVM_DIR/nvm.sh\" && cd /Users/decoded/decoded-app && rm -rf node_modules package-lock.json && npm install"
```

## 🚨 서버 접속 문제 해결

### 현재 상황

- **서버 상태**: 정상 실행 중 ✅
- **로컬 접속**: 정상 작동 ✅
- **외부 접속**: 차단됨 ❌

### 문제 원인

맥미니의 방화벽에서 포트 3000이 외부 접속을 차단하고 있습니다.

### 해결 방법

#### 방법 1: 방화벽 설정 (관리자 권한 필요)

```bash
# 맥미니에서 직접 실행
sudo pfctl -e
echo "pass in proto tcp from any to any port 3000" | sudo pfctl -f -
```

#### 방법 2: 라우터 포트 포워딩

1. 라우터 관리 페이지 접속 (보통 192.168.1.1)
2. 포트 포워딩 설정에서:
   - 외부 포트: 3000
   - 내부 IP: 172.30.1.7 (맥미니 IP)
   - 내부 포트: 3000

#### 방법 3: SSH 터널링 (임시 해결책)

```bash
# 로컬에서 실행
ssh -L 3000:localhost:3000 decoded@121.130.214.186 -p 2202
```

그 후 `http://localhost:3000`으로 접속

### 기능 테스트

#### 1. 기본 기능

- [ ] 메인 페이지 로딩
- [ ] 채널 목록 표시
- [ ] 이미지 로딩
- [ ] 반응형 디자인

#### 2. 인증 기능

- [ ] Google 로그인
- [ ] 로그아웃
- [ ] 사용자 프로필

#### 3. 콘텐츠 기능

- [ ] 채널 생성
- [ ] 콘텐츠 업로드
- [ ] 좋아요/북마크

### 문제 해결

#### 접속이 안 되는 경우

1. **네트워크 연결 확인**

   - 인터넷 연결 상태 확인
   - 같은 네트워크에 연결되어 있는지 확인

2. **URL 확인**

   - `http://121.130.214.186:3000` 정확히 입력했는지 확인
   - `https://`가 아닌 `http://`로 입력했는지 확인

3. **포트 번호 확인**

   - URL 끝에 `:3000`이 포함되어 있는지 확인

4. **브라우저 캐시 삭제**

   - 브라우저 캐시 및 쿠키 삭제
   - 새로고침 (Ctrl+F5 또는 Cmd+Shift+R)

5. **서버 상태 확인**

   - 개발팀에 서버 상태 문의
   - 서버 재시작 요청

6. **방화벽 설정 확인**

   - 맥미니 방화벽에서 포트 3000 허용
   - 라우터 포트 포워딩 설정

#### 성능 문제

1. **페이지 로딩이 느린 경우**

   - 네트워크 속도 확인
   - 브라우저 새로고침
   - 다른 브라우저로 시도

2. **이미지가 안 보이는 경우**

   - 네트워크 연결 확인
   - 브라우저 새로고침
   - 개발팀에 문의

### 개발팀 연락처

문제가 발생하거나 개선사항이 있으면 개발팀에 문의해주세요.

### 기술 스택 정보

- **Frontend**: Next.js 15.4.1
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **API**: React Query
- **Authentication**: Google OAuth
- **Node.js**: 18.20.8

### 환경 정보

- **서버**: macOS Mini
- **IP**: 121.130.214.186
- **포트**: 3000
- **API Base**: https://dev.decoded.style
- **배포일**: 2024년 현재

---

**참고**: 이 서버는 개발용 서버입니다. 프로덕션 환경과 다를 수 있습니다.
