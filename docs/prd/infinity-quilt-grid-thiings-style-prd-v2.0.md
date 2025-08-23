# Infinity Quilt Grid - ThiingsGrid Style PRD
**Version:** 2.0  
**Date:** August 18, 2025  
**Authors:** Product Team, Engineering Team  
**Status:** Active Implementation  

---

## 배경 (Background)

Decoded는 현재 **단순 카드 기반 무한 스크롤 그리드**를 제공하고 있으나, 사용자 경험 차원에서 한계가 존재합니다. 콘텐츠는 단순 나열되며, 긴 세션에서도 성능 저하가 발생할 수 있습니다.

참고 사례인 **Thiings Grid(https://www.thiings.co/things)**는 "스크롤 자체가 경험(UX)"이 되는 최적화된 콘텐츠 탐색 방식을 보여줍니다. Thiings는 GPU 가속, 나선형 배치 알고리즘, 뷰포트 최적화, 2D 드래그 기반 탐색을 통해 수백~수천 개의 콘텐츠도 부드럽게 탐색할 수 있는 환경을 제공합니다.

Decoded는 이 아키텍처를 벤치마킹하여, 단순히 "무한 스크롤 그리드"가 아닌 **"콘텐츠 스트림(Content Stream)"** 경험을 구현하는 것을 목표로 합니다.

---

## 벤치마킹 (Benchmarking)

### Thiings Grid 주요 기능

1. **2D 드래그 기반 탐색** – 상하좌우 자유로운 콘텐츠 탐색
2. **GPU 가속 스크롤** – transform3d 기반 GPU 렌더링으로 DOM repaint 최소화
3. **나선형 배치 알고리즘** – 중앙에서 시작해 나선형으로 확장되는 고정 크기 셀 배치
4. **관성 기반 물리 엔진** – 드래그 후 자연스러운 감속과 관성 움직임
5. **뷰포트 가상화** – 보이는 콘텐츠만 렌더링, 화면 밖 요소는 언마운트
6. **터치 및 마우스 지원** – 멀티 플랫폼 인터랙션
7. **무한 확장** – 모든 방향으로 끝없이 확장되는 콘텐츠 공간

---

## Decoded Infinity Quilt Grid – ThiingsGrid Style 차별화 포인트

### 🎯 핵심 구현 목표 (ThiingsGrid 기반)

- **2D 드래그 탐색** (ThiingsGrid 라이브러리 활용)
- **나선형 배치** (중앙 기준 spiral index 계산)
- **GPU 가속 렌더링** (transform3d + willChange 최적화)
- **관성 물리 엔진** (velocity 기반 자연스러운 감속)
- **뷰포트 가상화** (보이는 영역만 렌더링)

### 추가 차별화 포인트

- **풍부한 메타데이터 지원** (작성자, 태그, 상호작용 데이터)
- **Mock Provider 기반 확장성** (실서버 전환 시 Provider만 교체)
- **반응형 그리드 크기** (디바이스별 최적 셀 크기 자동 조정)
- **카드 데이터 통합** (950개 시드 데이터 + 커서 기반 무한 로딩)
- **접근성 & UX** (hover 효과, 이미지 lazy loading, 에러 처리)

---

## 목표 (Objectives)

### 주요 목표
1. **ThiingsGrid 경험 구현**: 2D 드래그 + 나선형 배치 + 관성 스크롤
2. **성능 최적화**: 뷰포트 가상화 + GPU 가속으로 부드러운 60fps 유지
3. **콘텐츠 스트림 UX**: "스크롤이 곧 탐색"인 직관적 인터랙션
4. **확장 가능한 구조**: Mock Provider → 실서버 전환 용이성

### 성공 지표
- 2D 드래그 탐색의 부드러운 60fps 유지
- 1000개+ 카드에서도 메모리 안정성 확보
- 관성 스크롤의 자연스러운 물리 감각 구현
- 모든 디바이스에서 일관된 터치/마우스 인터랙션

---

## 범위 (Scope)

### In Scope (ThiingsGrid Style)

- **Core ThiingsGrid Integration**
  - ThiingsGrid 라이브러리 통합 및 커스터마이징
  - 나선형 인덱스 기반 카드 데이터 매핑
  - 2D 드래그 및 관성 물리 시스템

- **Card Data Layer**
  - Mock Provider (950개 시드 데이터)
  - 커서 기반 페이지네이션 (실서버 준비)
  - React Query useInfiniteQuery 통합

- **Performance Features**
  - GPU 가속 렌더링 (transform3d)
  - 뷰포트 기반 가상화 (ThiingsGrid 내장)
  - 반응형 그리드 셀 크기 최적화

- **UX Enhancements**
  - 카드 호버 효과 및 메타데이터 표시
  - 이미지 lazy loading + 평균 색상 플레이스홀더
  - 터치/마우스 멀티 플랫폼 지원

### Out of Scope
- 기존 세로 무한 스크롤 시스템 (단계적 교체)
- Pinterest-style Skyline 배치 알고리즘
- TanStack Virtual (ThiingsGrid 내장 가상화 사용)

---

## 기술 사양 (Technical Specifications)

### ThiingsGrid 라이브러리 스펙
```typescript
interface ThiingsGridProps {
  gridSize: number                    // 셀 크기 (100-120px, 반응형)
  renderItem: (config: ItemConfig) => React.ReactNode
  className?: string
  initialPosition?: { x: number, y: number }
}

interface ItemConfig {
  gridIndex: number      // 나선형 인덱스 (0부터 무한)
  position: {x: number, y: number}  // 그리드 좌표
  isMoving: boolean     // 드래그/관성 움직임 상태
}
```

### 카드 데이터 매핑
- **인덱스 순환**: `cardIndex = gridIndex % cards.length`
- **무한 로딩**: gridIndex 증가시 자동으로 `fetchNextPage` 트리거
- **메타데이터**: 제목, 작성자, 좋아요, 댓글 수 표시

### 성능 최적화
- **GPU 레이어**: `transform3d` + `willChange` 적용
- **물리 엔진**: Velocity 기반 관성 + friction 적용
- **뷰포트 가상화**: 보이는 영역 + 버퍼만 렌더링

---

## 구현 계획 (Implementation Plan)

### Phase 1: Core ThiingsGrid Integration ✅
- [x] ThiingsGrid 라이브러리 통합
- [x] 기본 색상 그리드 테스트 구현 
- [x] 2D 드래그 + 관성 스크롤 동작 확인

### Phase 2: Card Data Integration ✅  
- [x] Mock Provider 연동 (950개 시드 데이터)
- [x] React Query useInfiniteQuery 통합
- [x] 나선형 인덱스 → 카드 데이터 매핑

### Phase 3: UX Polish (진행중)
- [ ] 카드 호버 효과 및 메타데이터 오버레이
- [ ] 이미지 로딩 최적화 (lazy loading + 에러 처리)
- [ ] 반응형 그리드 크기 자동 조정
- [ ] 무한 로딩 트리거 최적화

### Phase 4: Production Ready
- [ ] 실서버 Provider 전환 준비
- [ ] 성능 모니터링 및 최적화
- [ ] 접근성 개선 (키보드 내비게이션)
- [ ] SEO 및 SSR 고려사항 검토

---

## 성공 기준 (Success Criteria)

### 기능적 요구사항
- [ ] 2D 드래그로 모든 방향 탐색 가능
- [ ] 관성 스크롤의 자연스러운 감속 구현
- [ ] 터치와 마우스 모두에서 일관된 경험
- [ ] 1000개+ 카드에서 메모리 안정성

### 성능 요구사항  
- [ ] 드래그 중 60fps 유지
- [ ] 관성 스크롤 중 부드러운 애니메이션
- [ ] 초기 로딩 시간 2초 이내
- [ ] 메모리 사용량 장시간 안정성

### 사용자 경험 요구사항
- [ ] 직관적인 2D 탐색 인터랙션
- [ ] 카드 메타데이터의 명확한 표시
- [ ] 모든 디바이스에서 반응형 동작
- [ ] 로딩/에러 상태의 적절한 피드백

---

## 위험 요소 및 대응 (Risk Management)

### 기술적 위험
1. **ThiingsGrid 라이브러리 의존성** (중간)
   - 대응: 라이브러리 소스 코드 직접 통합으로 커스터마이징 자유도 확보

2. **모바일 성능** (높음)  
   - 대응: 모바일에서 그리드 크기 축소 + 렌더링 최적화

3. **무한 데이터 메모리** (중간)
   - 대응: 뷰포트 가상화 + 적극적인 언마운트 정책

### UX 위험
1. **2D 탐색의 혼란** (중간)
   - 대응: 명확한 안내 UI + 중앙 기준점 표시

2. **터치 인터랙션 충돌** (낮음)
   - 대응: 네이티브 스크롤과 구분되는 터치 이벤트 처리

---

## 다음 단계

1. **Phase 3 UX Polish 완료** (우선순위 높음)
2. **실서버 전환 준비** (Provider 인터페이스 확정)
3. **성능 모니터링 구축** (메모리, FPS 추적)
4. **사용자 테스트** (2D 탐색 UX 피드백 수집)

---

👉 **요약**: Decoded는 단순 카드 리스트가 아닌 **"ThiingsGrid-style 2D 콘텐츠 탐색 경험"**으로 진화하며, 드래그 기반 무한 탐색 UX를 핵심 경쟁력으로 삼습니다.

---

**문서 메타데이터**
- 최종 수정일: 2025-08-18
- 기반 구현: ThiingsGrid 라이브러리
- 구현 상태: Phase 2 완료, Phase 3 진행중
- 담당자: Engineering Team