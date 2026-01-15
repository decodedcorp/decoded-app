# [SCR-MOBL-01] 홈 화면 (Home Screen)

| 항목 | 내용 |
|:---|:---|
| **문서 ID** | SCR-MOBL-01 |
| **경로** | `/(tabs)/` |
| **작성일** | 2026-01-15 |
| **버전** | v1.0 |
| **상태** | 구현됨 (80%) |

---

## 1. 화면 개요

- **목적**: 이미지 피드를 2열 그리드로 탐색, 무한 스크롤 지원
- **선행 조건**: Supabase 초기화 완료
- **후속 화면**: 이미지 상세 (SCR-MOBL-02)
- **관련 기능 ID**: [M-03](../spec.md#m-03-홈-화면-이미지-그리드)

---

## 2. UI 와이어프레임

```
┌────────────────────────────────┐
│  [Status Bar]                  │
├────────────────────────────────┤
│  [Tab Bar - Home 활성화]       │
├────────────────────────────────┤
│                                │
│  ┌────────────┐ ┌────────────┐ │
│  │ [CARD-01]  │ │ [CARD-02]  │ │
│  │            │ │            │ │
│  │    IMG     │ │    IMG     │ │
│  │   (1:1.25) │ │   (1:1.25) │ │
│  │            │ │            │ │
│  └────────────┘ └────────────┘ │
│  ┌────────────┐ ┌────────────┐ │
│  │ [CARD-03]  │ │ [CARD-04]  │ │
│  │            │ │            │ │
│  │    IMG     │ │    IMG     │ │
│  │            │ │            │ │
│  └────────────┘ └────────────┘ │
│  ┌────────────┐ ┌────────────┐ │
│  │ [CARD-05]  │ │ [CARD-06]  │ │
│  │    ...     │ │    ...     │ │
│  └────────────┘ └────────────┘ │
│                                │
│  ... (Infinite Scroll)         │
│                                │
│  ┌──────────────────────────┐  │
│  │   [ActivityIndicator]    │  │
│  │   Loading more...        │  │
│  └──────────────────────────┘  │
│                                │
└────────────────────────────────┘
```

---

## 3. UI 요소 정의

| UI ID | 구분 | 요소명 | 속성/상태 | 인터랙션/로직 |
|:---|:---|:---|:---|:---|
| MOBL-01-001 | 컨테이너 | FlatList | flex: 1, numColumns: 2 | 무한 스크롤 |
| MOBL-01-002 | 카드 | ImageCard | width: (화면폭-12)/2, height: width*1.25 | 탭 → 상세 이동 |
| MOBL-01-003 | 이미지 | Image | resizeMode: cover, borderRadius: 8 | - |
| MOBL-01-004 | 로딩 | ActivityIndicator | 초기 로딩, 추가 로딩 | - |
| MOBL-01-005 | 빈 상태 | EmptyView | "No images found" | - |

---

## 4. 인터랙션 명세

### 4.1 무한 스크롤
```
사용자가 스크롤
    │
    ▼ onEndReached (threshold: 0.5)
    │
    ├─ hasNextPage && !isFetchingNextPage?
    │      │
    │      ├─ Yes: fetchNextPage()
    │      │        └─ 40개 추가 로드
    │      │
    │      └─ No: 대기
    │
    ▼
다음 페이지 렌더링
```

### 4.2 이미지 탭
```
사용자가 카드 탭
    │
    ▼ Link href={`/images/${item.id}`}
    │
    ▼
SCR-MOBL-02 상세 화면으로 이동
```

---

## 5. 상태 관리

### 5.1 서버 상태 (React Query)
```typescript
const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
  useInfiniteFilteredImages({
    limit: 40,
    filter: activeFilter,
    search: "",
    deduplicateByImageId: true,
  });
```

### 5.2 클라이언트 상태 (Zustand)
```typescript
const { activeFilter } = useFilterStore();
```

---

## 6. 레이아웃 계산

```typescript
const { width } = Dimensions.get("window");
const COLUMN_COUNT = 2;
const GAP = 4;
const CARD_WIDTH = (width - GAP * (COLUMN_COUNT + 1)) / COLUMN_COUNT;
const CARD_HEIGHT = CARD_WIDTH * 1.25;
```

---

## 7. 로딩 상태

| 상태 | UI | 조건 |
|:---|:---|:---|
| 초기화 중 | ActivityIndicator + "Initializing..." | !isInitialized |
| 로딩 중 | ActivityIndicator + "Loading images..." | isLoading |
| 추가 로딩 | Footer ActivityIndicator | isFetchingNextPage |
| 빈 상태 | "No images found" | items.length === 0 |

---

## 8. 구현 파일

| 파일 | 설명 |
|:---|:---|
| `packages/mobile/app/(tabs)/index.tsx` | 홈 화면 컴포넌트 |
| `packages/shared/hooks/useImages.ts` | 이미지 쿼리 훅 |
| `packages/shared/stores/filterStore.ts` | 필터 상태 |

---

## 9. 미구현 항목

| 항목 | 상태 | 우선순위 |
|:---|:---:|:---|
| 필터 UI (탭/드롭다운) | ❌ | P1 |
| 검색 UI | ❌ | P1 |
| Pull-to-refresh | ❌ | P2 |
| 스켈레톤 로딩 | ❌ | P3 |

---

## 10. 관련 문서

- [M-03 기능 명세](../spec.md#m-03-홈-화면-이미지-그리드)
- [웹 홈 화면 (SCR-DISC-01)](../../discovery/screens/SCR-DISC-01-home.md)
