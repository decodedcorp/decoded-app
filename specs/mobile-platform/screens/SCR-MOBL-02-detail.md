# [SCR-MOBL-02] 이미지 상세 화면 (Image Detail Screen)

| 항목 | 내용 |
|:---|:---|
| **문서 ID** | SCR-MOBL-02 |
| **경로** | `/images/[id]` |
| **작성일** | 2026-01-15 |
| **버전** | v1.0 |
| **상태** | 구현됨 (75%) |

---

## 1. 화면 개요

- **목적**: 선택한 이미지의 상세 정보와 감지된 아이템 목록 표시
- **선행 조건**: 홈 화면에서 이미지 탭
- **후속 화면**: 홈 화면 (뒤로가기)
- **관련 기능 ID**: [M-04](../spec.md#m-04-이미지-상세-화면)

---

## 2. UI 와이어프레임

```
┌────────────────────────────────┐
│  [Status Bar]                  │
├────────────────────────────────┤
│  [← Back]     Image Detail     │
├────────────────────────────────┤
│                                │
│  ┌──────────────────────────┐  │
│  │                          │  │
│  │                          │  │
│  │      [HERO IMAGE]        │  │
│  │      (1:1.25 ratio)      │  │
│  │                          │  │
│  │                          │  │
│  └──────────────────────────┘  │
│                                │
│  ┌──────────────────────────┐  │
│  │  @username               │  │
│  │  2026-01-15              │  │
│  └──────────────────────────┘  │
│                                │
│  ┌──────────────────────────┐  │
│  │  Items                   │  │
│  ├──────────────────────────┤  │
│  │  ┌────────────────────┐  │  │
│  │  │ Product Name       │  │  │
│  │  │ Brand              │  │  │
│  │  │ ₩99,000            │  │  │
│  │  └────────────────────┘  │  │
│  │  ┌────────────────────┐  │  │
│  │  │ Product Name 2     │  │  │
│  │  │ Brand 2            │  │  │
│  │  │ ₩149,000           │  │  │
│  │  └────────────────────┘  │  │
│  └──────────────────────────┘  │
│                                │
└────────────────────────────────┘
```

---

## 3. UI 요소 정의

| UI ID | 구분 | 요소명 | 속성/상태 | 인터랙션/로직 |
|:---|:---|:---|:---|:---|
| MOBL-02-001 | 컨테이너 | ScrollView | flex: 1 | 세로 스크롤 |
| MOBL-02-002 | 이미지 | HeroImage | width: 화면폭, height: 화면폭*1.25 | - |
| MOBL-02-003 | 텍스트 | Account | fontSize: 18, fontWeight: 600 | - |
| MOBL-02-004 | 텍스트 | Date | fontSize: 14, opacity: 0.6 | - |
| MOBL-02-005 | 섹션 | ItemsSection | marginTop: 8 | - |
| MOBL-02-006 | 카드 | ItemCard | padding: 12, borderRadius: 8 | 향후: 탭 → 구매 링크 |
| MOBL-02-007 | 텍스트 | ItemName | fontSize: 15, fontWeight: 500 | - |
| MOBL-02-008 | 텍스트 | ItemBrand | fontSize: 13, opacity: 0.7 | - |
| MOBL-02-009 | 텍스트 | ItemPrice | fontSize: 14, color: #007AFF | - |

---

## 4. 데이터 구조

### 4.1 이미지 데이터
```typescript
interface ImageData {
  id: string;
  image_url: string | null;
  created_at: string;
  postImages?: Array<{
    post?: {
      account: string;
    };
  }>;
  items?: Array<{
    id: string;
    product_name: string | null;
    brand: string | null;
    price: string | null;
  }>;
}
```

### 4.2 React Query 훅
```typescript
const { data: image, isLoading, error } = useImageById(id ?? "");
```

---

## 5. 상태 처리

| 상태 | UI | 조건 |
|:---|:---|:---|
| 로딩 중 | ActivityIndicator + "Loading..." | isLoading |
| 에러 | "Image not found" | error \|\| !image |
| 정상 | 이미지 + 아이템 목록 | image 존재 |

---

## 6. 레이아웃 계산

```typescript
const { width } = Dimensions.get("window");

// Hero Image
const heroImageStyle = {
  width: width,
  height: width * 1.25,
  backgroundColor: "#f0f0f0",
};
```

---

## 7. 구현 파일

| 파일 | 설명 |
|:---|:---|
| `packages/mobile/app/images/[id].tsx` | 상세 화면 컴포넌트 |
| `packages/shared/hooks/useImages.ts` | useImageById 훅 |

---

## 8. 미구현 항목

| 항목 | 상태 | 우선순위 | 설명 |
|:---|:---:|:---|:---|
| 핀 시스템 | ❌ | P1 | 이미지 위 아이템 위치 표시 |
| 구매 링크 | ❌ | P1 | 아이템 탭 → 외부 쇼핑몰 |
| 공유 기능 | ❌ | P2 | 이미지 공유 |
| 좋아요/북마크 | ❌ | P2 | 사용자 인터랙션 |
| 관련 이미지 | ❌ | P3 | 유사 이미지 추천 |

---

## 9. 웹 vs 모바일 비교

| 기능 | 웹 (SCR-VIEW-01) | 모바일 (SCR-MOBL-02) |
|:---|:---|:---|
| 레이아웃 | 50/50 Split (Sticky) | 세로 ScrollView |
| 핀 시스템 | ✅ 구현됨 | ❌ 미구현 |
| 연결선 | ✅ SVG Bezier | ❌ 미구현 |
| 아이템 카드 | 상세 정보 + 인터랙션 | 기본 정보만 |
| 구매 링크 | ❌ 미구현 | ❌ 미구현 |

---

## 10. 관련 문서

- [M-04 기능 명세](../spec.md#m-04-이미지-상세-화면)
- [웹 상세 화면 (SCR-VIEW-01)](../../detail-view/screens/SCR-VIEW-01-detail.md)
- [핀 시스템 (SCR-VIEW-02)](../../detail-view/screens/SCR-VIEW-02-pins.md)
