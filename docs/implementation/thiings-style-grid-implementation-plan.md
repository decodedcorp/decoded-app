# ThiingsGrid Style Implementation Plan

**버전:** 2.0  
**날짜:** 2025-08-18  
**상태:** Active Implementation  
**기반 PRD:** infinity-quilt-grid-thiings-style-prd-v2.0.md  

---

## 개요

**ThiingsGrid 라이브러리**를 기반으로 2D 드래그 탐색이 가능한 콘텐츠 스트림을 구현하고, Mock Provider를 통해 실서버 없이도 완전한 UX를 제공하는 구현 계획.

---

## 1. 핵심 목표 (ThiingsGrid Style)

### 주요 목표
- **2D 드래그 탐색**: 상하좌우 자유로운 콘텐츠 탐색 경험
- **나선형 배치**: 중앙에서 시작해 나선형으로 확장되는 카드 배치
- **관성 물리 엔진**: 드래그 후 자연스러운 감속과 관성 움직임
- **뷰포트 가상화**: 보이는 영역만 렌더링하여 성능 최적화

### 성공 기준
- 2D 드래그의 부드러운 60fps 유지
- 관성 스크롤의 자연스러운 물리 감각
- 1000개+ 카드에서도 안정적인 메모리 사용량
- 터치/마우스 모든 디바이스에서 일관된 경험

---

## 2. 기술 스택

### Core Libraries
```json
{
  "thiingsGrid": "직접 통합 (charlieclark/thiings-grid)",
  "react": "^18.0.0",
  "react-query": "^5.0.0",
  "typescript": "^5.0.0"
}
```

### ThiingsGrid 인터페이스
```typescript
// 핵심 Props
interface ThiingsGridProps {
  gridSize: number                    // 셀 크기 (반응형: 100-120px)
  renderItem: (config: ItemConfig) => React.ReactNode
  className?: string
  initialPosition?: { x: number, y: number }
}

// 렌더링 설정
interface ItemConfig {
  gridIndex: number      // 나선형 인덱스 (0부터 무한)
  position: { x: number, y: number }  // 그리드 좌표 (-∞ ~ +∞)
  isMoving: boolean     // 드래그/관성 움직임 상태
}
```

---

## 3. 아키텍처 설계

### 모듈 구성
```
src/domains/main/
├── components/
│   ├── ThiingsGrid.tsx              # 원본 라이브러리 (GitHub)
│   ├── DecodedThiingsGrid.tsx       # 카드 데이터 연동 래퍼
│   ├── SimpleColorGrid.tsx          # 테스트용 색상 그리드
│   └── MainPage.tsx                 # 메인 페이지
├── hooks/
│   └── useCards.ts                  # React Query 무한 스크롤 훅
├── data/
│   └── cardsProvider.ts             # Mock Provider (→ 실서버 전환점)
├── mocks/
│   └── factory.ts                   # 950개 시드 데이터 생성
├── types/
│   └── card.ts                      # Card, CardsResponse 타입
└── utils/
    └── cursor.ts                    # 커서 기반 페이지네이션
```

### 데이터 흐름
```
ThiingsGrid Library
    ↓ (gridIndex)
DecodedThiingsGrid
    ↓ (cardIndex = gridIndex % cards.length)
useCards Hook (React Query)
    ↓ (useInfiniteQuery)
CardsProvider.getCards()
    ↓ (Mock Data)
950개 시드 카드 배열
```

---

## 4. 핵심 구현 내용

### Phase 1: ThiingsGrid 통합 ✅

#### 1.1 라이브러리 통합
```typescript
// ThiingsGrid.tsx - GitHub에서 직접 복사
'use client'
import React, { Component } from "react"
// ... (물리 엔진, 드래그 처리, 가상화 로직)
```

#### 1.2 기본 테스트
```typescript
// SimpleColorGrid.tsx - 색상 셀로 동작 확인
const renderColorItem = ({ gridIndex, isMoving }: ItemConfig) => (
  <div style={{ backgroundColor: getColor(gridIndex) }}>
    {gridIndex}
  </div>
)

<ThiingsGrid gridSize={100} renderItem={renderColorItem} />
```

**결과**: ✅ 2D 드래그, 관성 스크롤, 터치 지원 모두 정상 동작

### Phase 2: 카드 데이터 연동 ✅

#### 2.1 카드 데이터 매핑
```typescript
// DecodedThiingsGrid.tsx
const renderCard = ({ gridIndex, isMoving }: ItemConfig) => {
  const cardIndex = gridIndex % cards.length  // 나선형 인덱스 → 카드 인덱스
  const card = cards[cardIndex]
  
  return <ThiingsCard card={card} isMoving={isMoving} />
}
```

#### 2.2 무한 로딩 연동
```typescript
// useCards.ts - React Query 무한 스크롤
const { cards, fetchNextPage, hasNextPage } = useCards({
  limit: 50,  // 최대 허용 한도
  sortBy: 'latest'
})

// 자동 로딩 (5초마다 더 많은 데이터)
useEffect(() => {
  const interval = setInterval(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, 5000)
}, [hasNextPage, isFetchingNextPage])
```

**결과**: ✅ 950개 시드 데이터 + 커서 기반 무한 로딩 정상 동작

### Phase 3: UX 개선 (진행중) 🟡

#### 3.1 반응형 그리드 크기
```typescript
const [gridSize, setGridSize] = useState(120)

useEffect(() => {
  const updateGridSize = () => {
    const width = window.innerWidth
    if (width < 768) setGridSize(100)      // 모바일
    else if (width < 1024) setGridSize(110) // 태블릿  
    else setGridSize(120)                   // 데스크탑
  }
  // ...
}, [])
```

#### 3.2 카드 인터랙션 개선
```typescript
// ThiingsCard 컴포넌트
<div className="transition-all duration-200 hover:scale-105">
  {/* 배경색 플레이스홀더 */}
  <div style={{ backgroundColor: card.avgColor }} />
  
  {/* 이미지 + lazy loading */}
  <img 
    src={card.thumbnailUrl} 
    className={isMoving ? 'filter blur-[1px]' : ''}  // 움직일 때 블러
    loading="lazy"
  />
  
  {/* 호버 오버레이 */}
  <div className="hover:opacity-100 transition-opacity">
    <div>{card.metadata.title}</div>
    <div>{card.metadata.author?.name}</div>
    <div>❤️ {card.metadata.likeCount} 💬 {card.metadata.commentCount}</div>
  </div>
</div>
```

#### 3.3 성능 최적화
- **GPU 가속**: ThiingsGrid 내장 `transform3d` + `willChange`
- **뷰포트 가상화**: ThiingsGrid 내장 (보이는 영역만 렌더링)
- **메모리 관리**: 컴포넌트 언마운트시 자동 정리

---

## 5. 현재 구현 상태

### ✅ 완료된 기능
1. **ThiingsGrid 라이브러리 통합** - 원본 코드 직접 복사 및 커스터마이징
2. **2D 드래그 탐색** - 상하좌우 자유로운 탐색 + 관성 스크롤
3. **나선형 배치** - gridIndex 기반 무한 확장
4. **카드 데이터 연동** - 950개 시드 데이터 + Mock Provider
5. **React Query 통합** - useInfiniteQuery 무한 스크롤
6. **기본 UX** - 터치/마우스 지원, 반응형 그리드 크기

### 🟡 진행중인 기능  
1. **카드 인터랙션 개선** - 호버 효과, 메타데이터 표시
2. **이미지 최적화** - lazy loading 개선, 에러 처리
3. **무한 로딩 최적화** - 자동 트리거 조건 개선

### ⏳ 계획된 기능
1. **실서버 전환 준비** - CardsProvider 인터페이스 확정
2. **성능 모니터링** - 메모리, FPS 추적
3. **접근성 개선** - 키보드 내비게이션, ARIA 라벨
4. **SEO 고려사항** - SSR 호환성 검토

---

## 6. 기술적 특징

### ThiingsGrid 물리 엔진
- **관성 스크롤**: velocity 기반 자연스러운 감속
- **마찰력**: `FRICTION = 0.9` 적용으로 점진적 정지
- **최소 속도**: `MIN_VELOCITY = 0.2` 이하에서 정지
- **부드러운 애니메이션**: `requestAnimationFrame` 기반 60fps

### 나선형 인덱스 시스템
```typescript
// 나선형 배치 알고리즘 (ThiingsGrid 내장)
// Center (0,0) = index 0
// Layer 1: (1,0), (1,-1), (0,-1), (-1,-1), (-1,0), (-1,1), (0,1), (1,1) = index 1-8  
// Layer 2: ... = index 9-24
// 각 Layer = 8 * layer 개의 셀
```

### 뷰포트 가상화
```typescript
// ThiingsGrid 내장 가상화
calculateVisiblePositions() {
  const cellsX = Math.ceil(width / gridSize)
  const cellsY = Math.ceil(height / gridSize)
  // 보이는 영역 + 버퍼만 계산하여 렌더링
}
```

---

## 7. 성능 지표

### 현재 성능 (테스트 환경)
- **드래그 FPS**: 60fps 유지 ✅
- **관성 스크롤**: 부드러운 애니메이션 ✅  
- **메모리 사용량**: 안정적 (1000개 카드) ✅
- **초기 로딩**: 2초 이내 ✅

### 목표 성능 (프로덕션)
- **드래그 FPS**: 60fps (모바일 포함)
- **메모리 증가율**: 시간당 10MB 이하
- **터치 반응성**: 16ms 이하 지연
- **이미지 로딩**: 평균 1초 이내

---

## 8. 실서버 전환 계획

### 전환 포인트
```typescript
// Mock Provider (현재)
const CardsProvider = {
  getCards: async (request) => {
    const seedCards = getSeedCards()  // 950개 시드
    // 슬라이싱 + 커서 계산 로직
    return { items, hasMore, nextCursor }
  }
}

// Real Server (향후)
const CardsProvider = {
  getCards: async (request) => {
    const response = await fetch(`${API_BASE}/cards`, {
      method: 'POST',
      body: JSON.stringify(request)
    })
    return response.json()  // 동일한 CardsResponse 구조
  }
}
```

### 변경 최소화 원칙
- **컴포넌트**: 변경 없음 (ThiingsGrid, DecodedThiingsGrid)
- **훅**: 변경 없음 (useCards)
- **타입**: 변경 없음 (Card, CardsResponse)
- **전환점**: `CardsProvider.getCards()` 함수 내부만 교체

---

## 9. 다음 단계

### 단기 (1-2주)
1. **Phase 3 완료** - UX 개선 및 성능 최적화
2. **모바일 테스트** - 터치 인터랙션 개선
3. **카드 메타데이터** - 호버 효과 및 정보 표시 개선

### 중기 (1개월)  
1. **실서버 API 스펙** - 백엔드팀과 CardsResponse 구조 확정
2. **성능 모니터링** - 메모리, FPS 추적 시스템
3. **사용자 테스트** - 2D 탐색 UX 피드백 수집

### 장기 (2-3개월)
1. **프로덕션 배포** - 실서버 연동 후 점진적 출시
2. **고급 기능** - 카드 필터링, 검색, 개인화
3. **확장성** - 다른 콘텐츠 타입 지원 검토

---

## 10. 결론

ThiingsGrid 기반 구현을 통해 **"스크롤이 곧 탐색"**인 혁신적인 콘텐츠 경험을 제공하며, Mock Provider 패턴으로 실서버 전환시에도 최소한의 변경으로 확장 가능한 구조를 확보했습니다.

현재 구현된 2D 드래그 탐색과 관성 스크롤은 기존 세로 스크롤 방식을 넘어서는 차별화된 UX를 제공하며, 향후 Decoded만의 콘텐츠 탐색 경험으로 발전할 수 있는 기반을 마련했습니다.

---

**문서 메타데이터**
- 최종 수정일: 2025-08-18
- 구현 상태: Phase 2 완료, Phase 3 진행중  
- 기반 라이브러리: ThiingsGrid (charlieclark/thiings-grid)
- 담당자: Engineering Team