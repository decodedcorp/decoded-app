# DNS A 레코드 설정 가이드

## 🎯 목표
`dev.decoded.style` 서브도메인을 맥미니 서버(`121.130.214.186`)로 연결

## 🔍 현재 상황
- **도메인**: `decoded.style`
- **현재 IP**: `76.76.21.21` (기본 도메인)
- **목표**: `dev.decoded.style` → `121.130.214.186`

## 📋 DNS 관리자 찾기

### 1. 도메인 등록업체 확인
```bash
whois decoded.style
```

### 2. 일반적인 DNS 관리자들
- **Namecheap**: namecheap.com
- **Cloudflare**: cloudflare.com
- **GoDaddy**: godaddy.com
- **Google Domains**: domains.google.com
- **AWS Route 53**: aws.amazon.com/route53

## 🔧 DNS 설정 방법

### 방법 1: Namecheap (가장 일반적)

#### 1. Namecheap 로그인
1. [namecheap.com](https://namecheap.com) 접속
2. 계정 로그인

#### 2. 도메인 관리
1. **Domain List** → `decoded.style` 선택
2. **Manage** 클릭

#### 3. DNS 설정
1. **Domain** 탭 → **Advanced DNS**
2. **Host Records** 섹션

#### 4. A 레코드 추가
```
Type: A Record
Host: dev
Value: 121.130.214.186
TTL: Automatic
```

### 방법 2: Cloudflare

#### 1. Cloudflare 로그인
1. [cloudflare.com](https://cloudflare.com) 접속
2. 계정 로그인

#### 2. 도메인 선택
1. **Dashboard** → `decoded.style` 선택

#### 3. DNS 설정
1. **DNS** 탭 → **Records**
2. **Add record** 클릭

#### 4. A 레코드 추가
```
Type: A
Name: dev
IPv4 address: 121.130.214.186
Proxy status: DNS only (회색 구름)
TTL: Auto
```

### 방법 3: GoDaddy

#### 1. GoDaddy 로그인
1. [godaddy.com](https://godaddy.com) 접속
2. 계정 로그인

#### 2. 도메인 관리
1. **My Products** → `decoded.style` → **DNS**

#### 3. A 레코드 추가
```
Type: A
Name: dev
Value: 121.130.214.186
TTL: 600 (10 minutes)
```

### 방법 4: Google Domains

#### 1. Google Domains 접속
1. [domains.google.com](https://domains.google.com) 접속
2. 계정 로그인

#### 2. DNS 설정
1. `decoded.style` 선택 → **DNS** 탭
2. **Custom records** 섹션

#### 3. A 레코드 추가
```
Record type: A
Host name: dev
TTL: 3600
Data: 121.130.214.186
```

## ⏱️ DNS 전파 시간

### 일반적인 전파 시간
- **TTL 300 (5분)**: 5-10분
- **TTL 3600 (1시간)**: 1-2시간
- **TTL 86400 (24시간)**: 24-48시간

### 전파 확인 방법
```bash
# 전파 확인
nslookup dev.decoded.style

# 또는
dig dev.decoded.style

# 또는 온라인 도구
# https://www.whatsmydns.net/
```

## 🔍 설정 확인

### 1. DNS 전파 확인
```bash
nslookup dev.decoded.style
```

**예상 결과:**
```
Name:   dev.decoded.style
Address: 121.130.214.186
```

### 2. 웹 접속 테스트
```bash
curl -I http://dev.decoded.style:3000
```

### 3. 브라우저에서 확인
```
http://dev.decoded.style:3000
```

## 🚨 문제 해결

### 일반적인 문제들

#### 1. DNS 전파가 안 되는 경우
- **TTL 값 확인**: 너무 길면 전파 시간이 오래 걸림
- **캐시 삭제**: 브라우저 캐시, DNS 캐시 삭제
- **시간 대기**: 최대 48시간까지 기다려보기

#### 2. 잘못된 IP로 연결되는 경우
- **DNS 캐시 확인**: `nslookup dev.decoded.style`
- **브라우저 캐시 삭제**: Ctrl+Shift+R (하드 리프레시)
- **다른 네트워크에서 테스트**: 모바일 데이터 등

#### 3. 서브도메인이 작동하지 않는 경우
- **레코드 타입 확인**: A 레코드가 맞는지 확인
- **호스트명 확인**: `dev`만 입력했는지 확인
- **TTL 값 확인**: 너무 짧으면 안정성 문제

### 디버깅 명령어
```bash
# DNS 조회
nslookup dev.decoded.style

# 상세 DNS 정보
dig dev.decoded.style

# 전 세계 DNS 전파 확인
# https://www.whatsmydns.net/

# 포트 스캔 (서버가 응답하는지)
telnet dev.decoded.style 3000
```

## 📞 도움말

### DNS 관리자 문의
- **Namecheap**: [support.namecheap.com](https://support.namecheap.com)
- **Cloudflare**: [support.cloudflare.com](https://support.cloudflare.com)
- **GoDaddy**: [support.godaddy.com](https://support.godaddy.com)

### 온라인 도구
- **DNS 전파 확인**: [whatsmydns.net](https://www.whatsmydns.net/)
- **DNS 조회**: [mxtoolbox.com](https://mxtoolbox.com/)

---

**참고**: DNS 설정 후 전파까지 시간이 걸릴 수 있습니다. 인내심을 가지고 기다려주세요!
