# Decoded App - 기능 명세서

> 버전: 1.0.0
> 최종 업데이트: 2026-01-08
> 원본: `docs/기능명세서.md`

---

## 개요

Decoded는 K-콘텐츠 패션 디스커버리 플랫폼으로, 팬들이 드라마, 음악 방송, 공개 행사에서 한국 셀럽이 착용한 아이템을 식별하고 구매할 수 있도록 돕습니다.

### 핵심 가치 제안
1. **딥다이브 디스커버리**: 콘텐츠 → 출연진 → 컨텍스트 → 아이템 순으로 탐색
2. **팬덤 참여**: 좋아하는 아티스트에 기여한 팬에게 뱃지 시스템으로 보상
3. **전환**: 어필리에이트 추적이 포함된 직접 구매 링크

---

## 문서 인덱스

| 파일 | 카테고리 | 기능 | 상태 |
|------|----------|----------|--------|
| [01-user-system.md](./01-user-system.md) | 사용자 시스템 | U-01 ~ U-05 | 0% 구현 |
| [02-discovery.md](./02-discovery.md) | 디스커버리 | D-01 ~ D-04 | 30% 구현 |
| [03-detail-interaction.md](./03-detail-interaction.md) | 상세 & 인터랙션 | V-01 ~ V-06 | 40% 구현 |
| [04-creation-ai.md](./04-creation-ai.md) | 생성 & AI | C-01 ~ C-04 | 10% 구현 |
| [05-system-backend.md](./05-system-backend.md) | 시스템 & 백엔드 | S-01 ~ S-08 | 20% 구현 |
| [06-admin.md](./06-admin.md) | 관리자 패널 | A-01 ~ A-03 | 0% 구현 |
| [07-mobile-platform.md](./07-mobile-platform.md) | 모바일 플랫폼 | M-01 ~ M-06 | 30% 구현 |
| [data-models.md](./data-models.md) | 데이터 모델 | TypeScript 타입 | 참조 |

---

## 우선순위 매트릭스

### P0 - 핵심 (MVP 필수)

| ID | 기능 | 카테고리 | 상태 |
|----|---------|----------|--------|
| U-01 | 소셜 로그인 | 사용자 | 미시작 |
| U-03 | 프로필 대시보드 | 사용자 | 미시작 |
| D-01 | 반응형 매거진 피드 | 디스커버리 | **구현됨** |
| D-02 | 계층적 필터 (딥 필터) | 디스커버리 | 미시작 |
| D-04 | 통합 검색 | 디스커버리 | 부분 구현 |
| V-01 | 반응형 상세 뷰 | 상세 | **구현됨** |
| V-02 | 핀 인터랙션 | 상세 | 부분 구현 |
| V-03 | 듀얼 매치 리스트 | 상세 | 미시작 |
| V-04 | 스마트 태그 (브레드크럼) | 상세 | 미시작 |
| V-05 | 구매 링크 (아웃링크) | 상세 | 미시작 |
| V-06 | 투표 & 댓글 | 상세 | 미시작 |
| C-01 | 이미지 업로드 | 생성 | 미시작 |
| C-02 | AI 객체 인식 | 생성 | 부분 구현 |
| C-03 | 메타데이터 태깅 | 생성 | 미시작 |
| C-04 | 스팟 등록 (URL 파싱) | 생성 | 미시작 |
| M-01 | 공유 코드 레이어 | 모바일 | **구현됨** |
| M-02 | Expo 프로젝트 설정 | 모바일 | **구현됨** |
| M-03 | 홈 화면 (이미지 그리드) | 모바일 | **구현됨** |
| M-04 | 이미지 상세 화면 | 모바일 | **구현됨** |

### P1 - 중요

| ID | 기능 | 카테고리 | 상태 |
|----|---------|----------|--------|
| U-02 | 다국어 (KO/EN) | 사용자 | 미시작 |
| U-04 | 활동 내역 | 사용자 | 미시작 |
| D-03 | 미디어 갤러리 | 디스커버리 | 미시작 |
| M-05 | 푸시 알림 | 모바일 | 대기 중 |
| M-06 | 카메라/갤러리 연동 | 모바일 | 대기 중 |

### P2 - 선택 사항

| ID | 기능 | 카테고리 | 상태 |
|----|---------|----------|--------|
| U-05 | 탈퇴 요청 | 사용자 | 미시작 |

---

## 아키텍처 개요

### 계층적 데이터 모델

```
Category (K-POP, K-Drama, K-Movie)
    └── Media/Group (BTS, Squid Game)
            └── Cast/Person (Jungkook, Jung Ho-yeon)
                    └── Context (Airport, Stage, Bedroom)
                            └── Item (Jacket, Bag, Shoes)
```

### 핵심 엔티티

```
POST (소셜 미디어 게시물 / 씬 캡처)
  ├── belongs_to: MEDIA (쇼, 드라마, 그룹)
  ├── features: CAST[] (이미지 속 인물)
  ├── has_context: CONTEXT (장소/시간)
  └── contains: ITEM[] (감지된 패션 아이템)

USER
  ├── has_many: CONTRIBUTIONS (게시물, 답변)
  ├── has_many: BADGES (획득한 타이틀)
  └── earns: REWARDS (수익 배분)
```

---

## 구현 로드맵

### 스프린트 1: 기반
- [ ] U-01 소셜 로그인 (Kakao, Google, Apple)
- [ ] U-03 프로필 대시보드 (기본)
- [ ] D-02 계층적 필터 UI

### 스프린트 2: 핵심 인터랙션
- [ ] V-02 핀 인터랙션 (완료)
- [ ] V-03 듀얼 매치 리스트
- [ ] V-05 구매 링크
- [ ] C-01 이미지 업로드

### 스프린트 3: AI & 참여
- [ ] C-02 AI 객체 인식 (UI)
- [ ] C-03 메타데이터 태깅
- [ ] V-06 투표 & 댓글
- [ ] S-07 뱃지 시스템

### 스프린트 4: 수익화 & 관리자
- [ ] S-05 클릭 트래커
- [ ] S-06 리워드 배치
- [ ] A-01 ~ A-03 관리자 패널

---

## 기술 스택

### 웹
| 레이어 | 기술 |
|-------|------------|
| 프론트엔드 | Next.js 16, React 18, TypeScript |
| 스타일링 | Tailwind CSS, GSAP, Motion |
| 상태 관리 | Zustand, React Query |
| 백엔드 | Supabase (PostgreSQL, Auth, Storage) |
| AI | Vision API (미정), Scraper Engine |

### 모바일 (크로스 플랫폼)
| 레이어 | 기술 |
|-------|------------|
| 프레임워크 | Expo SDK 54, React Native 0.81 |
| 라우팅 | Expo Router 6 |
| 애니메이션 | React Native Reanimated 4 |
| 상태 관리 | Zustand, React Query (공유) |
| 네이티브 | expo-notifications, expo-image-picker |

### 모노레포 구조
```
decoded-monorepo/
├── packages/
│   ├── shared/    # 공유 코드 (hooks, stores, queries)
│   ├── web/       # Next.js 웹 앱 (SSR)
│   └── mobile/    # Expo 네이티브 앱
└── package.json   # Yarn workspaces
```

---

## 파일 명명 규칙

- 기능 ID는 접두사 문자 사용:
  - `U-##`: 사용자 기능
  - `D-##`: 디스커버리 기능
  - `V-##`: 뷰/상세 기능
  - `C-##`: 생성 기능
  - `S-##`: 시스템 기능
  - `A-##`: 관리자 기능
  - `M-##`: 모바일 플랫폼 기능

- 우선순위 레벨:
  - `P0`: MVP 필수
  - `P1`: 출시 시 중요
  - `P2`: 선택 사항

---

## 관련 문서

- 원본 스펙 (한글): [`docs/기능명세서.md`](../../docs/기능명세서.md)
- 데이터베이스 스키마: [`docs/database/`](../../docs/database/)
- 아키텍처 결정: [`docs/adr/`](../../docs/adr/)
- 디자인 시스템: [`docs/design-system/`](../../docs/design-system/)
