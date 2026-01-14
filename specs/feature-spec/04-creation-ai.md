# 생성 & AI

> 기능: C-01 ~ C-04
> 상태: 10% 구현됨
> 의존성: Vision API, Scraper 인프라

---

## 개요

생성 기능은 사용자가 플랫폼에 콘텐츠를 기여할 수 있게 합니다. AI 기능은 자동으로 아이템을 감지하고 메타데이터를 추출하여 수동 작업을 줄이고 정확도를 향상시킵니다.

### 관련 화면
- `/create` - 게시물 생성 플로우
- `/create/upload` - 이미지 업로드 단계
- `/create/detect` - AI 감지 단계
- `/create/tag` - 메타데이터 태깅 단계
- `/create/spot` - 스팟 등록

### 현재 구현 상태
- `app/lab/fashion-scan/` - 실험적 AI 시각화
- 아이템 감지용 백엔드 파이프라인 존재
- 사용자용 업로드 플로우 없음

---

## 기능

### C-01 이미지 업로드

- **설명**: 사용자가 모바일 또는 웹에서 이미지 업로드
- **우선순위**: P0
- **상태**: 미시작
- **의존성**: U-01 (인증), Supabase Storage

#### 인수 조건
- [ ] 사용자가 기기 갤러리에서 이미지 선택 가능
- [ ] 웹에서 드래그 앤 드롭 가능
- [ ] 웹에서 클립보드 붙여넣기 가능
- [ ] 다중 이미지 업로드 지원 (최대 5개)
- [ ] 제출 전 이미지 미리보기
- [ ] 업로드 중 진행률 표시
- [ ] 이미지 검증 (크기, 형식, 해상도)
- [ ] 필요시 자동 이미지 압축
- [ ] 진행 중인 업로드 취소
- [ ] 재시도 옵션이 있는 에러 처리

#### UI/UX 요구사항

**업로드 화면 (1단계)**:
```
┌─────────────────────────────────────────────────────────────┐
│  Create New Post                              [Cancel]      │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                      │   │
│  │         📷                                          │   │
│  │                                                      │   │
│  │    Drag & drop images here                          │   │
│  │    or click to select                               │   │
│  │                                                      │   │
│  │    Supports: JPG, PNG, WebP                         │   │
│  │    Max size: 10MB per image                         │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ── or paste from clipboard (Ctrl+V) ──                    │
│                                                             │
│  Selected Images (2/5):                                     │
│  ┌─────┐ ┌─────┐ ┌─────┐                                  │
│  │ [1] │ │ [2] │ │  +  │                                  │
│  │  ✕  │ │  ✕  │ │ add │                                  │
│  └─────┘ └─────┘ └─────┘                                  │
│                                                             │
│                                     [Next: Detect Items →] │
└─────────────────────────────────────────────────────────────┘
```

**모바일 업로드**:
```
┌─────────────────────────────┐
│  Create New Post      [✕]   │
│                             │
│  ┌─────────────────────┐   │
│  │                     │   │
│  │     [Camera]        │   │
│  │                     │   │
│  │   Take Photo        │   │
│  │                     │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │                     │   │
│  │     [Gallery]       │   │
│  │                     │   │
│  │   Choose from       │   │
│  │   Library           │   │
│  └─────────────────────┘   │
│                             │
└─────────────────────────────┘
```

#### 데이터 요구사항
- 업로드용 Supabase Storage 버킷
- 각 업로드에 대한 이미지 테이블 항목
- 처리용 임시 업로드 디렉토리

#### 구현 노트
```typescript
// lib/hooks/useImageUpload.ts
interface UploadProgress {
  status: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
  progress: number; // 0-100
  error?: string;
}

async function uploadImage(file: File): Promise<UploadResult> {
  // 검증
  if (file.size > 10 * 1024 * 1024) throw new Error('File too large');
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Invalid file type');
  }

  // 필요시 압축
  const processedFile = await compressImage(file);

  // Supabase Storage에 업로드
  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(`${userId}/${Date.now()}-${file.name}`, processedFile);

  return { url: data.path, id: generateImageId() };
}
```

#### 생성/수정할 파일
- `app/create/page.tsx` - 생성 플로우 진입점
- `app/create/upload/page.tsx` - 업로드 단계
- `lib/components/create/ImageUploader.tsx`
- `lib/components/create/ImagePreviewGrid.tsx`
- `lib/components/create/DropZone.tsx`
- `lib/hooks/useImageUpload.ts`
- `lib/utils/imageCompression.ts`

---

### C-02 AI 객체 인식

- **설명**: 업로드된 이미지에서 패션 아이템을 자동으로 감지하고 크롭
- **우선순위**: P0
- **상태**: 부분 구현 (백엔드 존재, UI 없음)
- **의존성**: C-01, Vision API 모듈 (S-01)

#### 인수 조건
- [ ] 업로드된 이미지를 감지 API로 전송
- [ ] "이미지 분석 중..." 로딩 상태 표시
- [ ] 감지된 아이템을 바운딩 박스와 함께 표시
- [ ] 사용자가 바운딩 박스를 수동으로 조정 가능
- [ ] 사용자가 잘못된 감지 제거 가능
- [ ] 사용자가 누락된 아이템 수동 추가 가능
- [ ] 각 아이템에 대해 크롭된 이미지 생성
- [ ] 각 아이템에 대해 카테고리 자동 제안
- [ ] 신뢰도 점수 표시
- [ ] 감지 가능한 아이템이 없는 이미지 처리

#### UI/UX 요구사항

**감지 화면 (2단계)**:
```
┌─────────────────────────────────────────────────────────────┐
│  Detect Items                                 [← Back]      │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                      │   │
│  │     [Image with detection overlays]                 │   │
│  │                                                      │   │
│  │     ┌──────────┐      Detected items shown with    │   │
│  │     │  Item 1  │      dashed bounding boxes        │   │
│  │     │  93%     │                                    │   │
│  │     └──────────┘                                    │   │
│  │              ┌─────────┐                            │   │
│  │              │ Item 2  │                            │   │
│  │              │ 87%     │                            │   │
│  │              └─────────┘                            │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Found 2 items:                                             │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ┌────┐ Item 1                                 [✕]  │   │
│  │ │crop│ Category: Top (93%)                         │   │
│  │ └────┘ [Edit Box] [Remove]                         │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ┌────┐ Item 2                                 [✕]  │   │
│  │ │crop│ Category: Bag (87%)                         │   │
│  │ └────┘ [Edit Box] [Remove]                         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [+ Add Item Manually]                                     │
│                                                             │
│                                  [Next: Add Details →]     │
└─────────────────────────────────────────────────────────────┘
```

**수동 박스 그리기**:
```
클릭하고 드래그하여 바운딩 박스 그리기:
┌─────────────────────────────────────┐
│                                     │
│     ┌ ─ ─ ─ ─ ─ ─ ┐               │
│     │             │                │
│     │   dragging  │                │
│     │             │                │
│     └ ─ ─ ─ ─ ─ ─ ┘               │
│              ↑                      │
│         resize handles              │
└─────────────────────────────────────┘
```

#### 데이터 요구사항
- Vision API 엔드포인트
- 감지 결과 스키마
- 크롭된 이미지 저장소

#### API 엔드포인트
```
POST /api/ai/detect
  body: { imageUrl: string }
  response: {
    items: Array<{
      bbox: BoundingBox;
      category: ItemCategory;
      confidence: number;
      croppedImageUrl: string;
    }>
  }
```

#### 구현 노트
```typescript
// lib/components/create/DetectionOverlay.tsx
interface DetectionResult {
  id: string;
  bbox: BoundingBox;
  category: ItemCategory;
  confidence: number;
  croppedImageUrl: string;
}

function DetectionOverlay({ imageUrl, detections, onUpdate }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleBoxResize = (id: string, newBbox: BoundingBox) => {
    onUpdate(detections.map(d =>
      d.id === id ? { ...d, bbox: newBbox } : d
    ));
  };

  // ... 드래그 핸들이 있는 바운딩 박스 렌더링
}
```

#### 생성/수정할 파일
- `app/create/detect/page.tsx` - 감지 단계
- `lib/components/create/DetectionOverlay.tsx`
- `lib/components/create/BoundingBox.tsx`
- `lib/components/create/DetectedItemList.tsx`
- `lib/hooks/useAIDetection.ts`
- `app/api/ai/detect/route.ts`

---

### C-03 메타데이터 태깅

- **설명**: 사용자가 게시물에 Media, Cast, Context 태그 선택
- **우선순위**: P0
- **상태**: 미시작
- **의존성**: C-01, D-02 (계층적 필터), 데이터베이스 구조

#### 인수 조건
- [ ] Media 선택 단계 (필수)
- [ ] Cast 멤버 선택 단계 (선택, 다중 선택)
- [ ] Context 선택 단계 (선택)
- [ ] Media/Cast 자동완성 검색
- [ ] 찾을 수 없는 경우 새 태그 요청 가능
- [ ] 필수 vs 선택 필드 명확한 표시
- [ ] 제출 전 선택한 태그 요약
- [ ] 사용자가 돌아가서 편집해도 태그 유지

#### UI/UX 요구사항

**태깅 화면 (3단계)**:
```
┌─────────────────────────────────────────────────────────────┐
│  Add Tags                                     [← Back]      │
│                                                             │
│  Where is this from? *                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🔍 Search show, drama, or group...                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Popular:                                                   │
│  [BLACKPINK] [NewJeans] [Squid Game] [IVE]                │
│                                                             │
│  Selected: 🎵 BLACKPINK                             [✕]    │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  Who is wearing this?                                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🔍 Search member name...                            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Members of BLACKPINK:                                      │
│  [Jisoo] [Jennie] [Rosé] [Lisa]                           │
│                                                             │
│  Selected: 👤 Jisoo                                 [✕]    │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  What's the context?                                        │
│  [✓ Airport] [ Stage] [ MV] [ Photoshoot] [ Daily]        │
│                                                             │
│                                      [Next: Review →]      │
└─────────────────────────────────────────────────────────────┘
```

**새 태그 요청 모달**:
```
┌─────────────────────────────────────────────────────────────┐
│  Request New Tag                              [✕]          │
│                                                             │
│  Can't find what you're looking for?                       │
│  Request a new tag to be added.                            │
│                                                             │
│  Tag Type: [Media ▼]                                       │
│                                                             │
│  Name: [                                                ]   │
│                                                             │
│  Korean Name: [                                         ]   │
│                                                             │
│  Type: [Group ▼] (for Media)                               │
│                                                             │
│                            [Cancel] [Submit Request]        │
└─────────────────────────────────────────────────────────────┘
```

#### 데이터 요구사항
- Media 검색 API
- Cast 검색 API (media로 필터 가능)
- 관리자 검토용 태그 요청 테이블

#### API 엔드포인트
```
GET /api/tags/media/search?q=black
GET /api/tags/cast/search?q=jisoo&mediaId=xxx
POST /api/tags/request
  body: { type: 'media' | 'cast', name: string, nameKo: string, ... }
```

#### 생성/수정할 파일
- `app/create/tag/page.tsx` - 태깅 단계
- `lib/components/create/MediaSelector.tsx`
- `lib/components/create/CastSelector.tsx`
- `lib/components/create/ContextSelector.tsx`
- `lib/components/create/TagRequestModal.tsx`
- `lib/hooks/useTagSearch.ts`

---

### C-04 스팟 등록 (URL 파싱)

- **설명**: 사용자가 쇼핑 URL을 입력하면 시스템이 제품 정보 추출
- **우선순위**: P0
- **상태**: 미시작
- **의존성**: C-02, S-02 (Scraper Engine)

#### 인수 조건
- [ ] 감지된 각 아이템에 쇼핑 URL 붙여넣기 가능
- [ ] 시스템이 스크래핑: 제품명, 브랜드, 가격, 이미지
- [ ] 확인 전 스크래핑된 데이터 미리보기
- [ ] 모든 필드에 대해 수동 재정의 가능
- [ ] 주요 한국/해외 쇼핑 사이트 지원
- [ ] 스크래핑 실패 시 수동 입력으로 대체
- [ ] 아이템당 여러 URL (original + vibe 대안)
- [ ] 어필리에이트 링크 처리

#### UI/UX 요구사항

**스팟 등록 (4단계)**:
```
┌─────────────────────────────────────────────────────────────┐
│  Add Product Links                            [← Back]      │
│                                                             │
│  Item 1: Top                                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ [crop] Category: Top                                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  THE ORIGINAL (Exact Match)                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🔗 Paste shopping URL...                            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Parsed: ✓                                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ [Product Image]                                      │   │
│  │ Brand: Celine                            [Edit]      │   │
│  │ Name: Triomphe Jacket                    [Edit]      │   │
│  │ Price: ₩2,850,000                        [Edit]      │   │
│  │ URL: celine.com/...                      ✓ Valid     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  THE VIBE (Similar Alternative)                [+ Add]     │
│  (No alternatives added yet)                               │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  Item 2: Bag                                                │
│  ...                                                        │
│                                                             │
│                                       [Publish Post →]     │
└─────────────────────────────────────────────────────────────┘
```

**URL 파싱 흐름**:
```
사용자가 URL 붙여넣기
    ↓
[Loading: Fetching product info...]
    ↓
성공 → 파싱된 데이터 표시, 사용자 확인
    ↓
실패 → 수동 입력 폼 표시
```

#### 데이터 요구사항
- Scraper API 엔드포인트
- 지원 사이트 설정
- 제품 메타데이터 스키마

#### API 엔드포인트
```
POST /api/scrape
  body: { url: string }
  response: {
    success: boolean;
    data?: {
      productName: string;
      brand: string;
      price: number;
      currency: string;
      imageUrl: string;
    };
    error?: string;
  }
```

#### 지원 사이트 (초기)
- 한국: Musinsa, 29CM, W Concept, SSF Shop
- 해외: Farfetch, SSENSE, Net-a-Porter
- 일반: Amazon, Coupang

#### 구현 노트
```typescript
// lib/hooks/useScrapeUrl.ts
interface ScrapeResult {
  status: 'idle' | 'loading' | 'success' | 'error';
  data?: ProductData;
  error?: string;
}

function useScrapeUrl() {
  const [result, setResult] = useState<ScrapeResult>({ status: 'idle' });

  const scrape = async (url: string) => {
    setResult({ status: 'loading' });
    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        body: JSON.stringify({ url })
      });
      const data = await response.json();
      if (data.success) {
        setResult({ status: 'success', data: data.data });
      } else {
        setResult({ status: 'error', error: data.error });
      }
    } catch (e) {
      setResult({ status: 'error', error: 'Network error' });
    }
  };

  return { ...result, scrape };
}
```

#### 생성/수정할 파일
- `app/create/spot/page.tsx` - 스팟 등록 단계
- `lib/components/create/SpotRegistration.tsx`
- `lib/components/create/UrlInput.tsx`
- `lib/components/create/ParsedProductCard.tsx`
- `lib/components/create/ManualProductForm.tsx`
- `lib/hooks/useScrapeUrl.ts`
- `app/api/scrape/route.ts`

---

## 데이터 모델

전체 타입 정의는 [data-models.md](./data-models.md)를 참조하세요.

### 생성 & AI의 주요 타입

```typescript
interface CreatePostState {
  step: 'upload' | 'detect' | 'tag' | 'spot' | 'review';
  images: UploadedImage[];
  detections: DetectionResult[];
  tags: {
    mediaId?: string;
    castIds: string[];
    contextType?: ContextType;
  };
  items: ItemDraft[];
}

interface UploadedImage {
  id: string;
  file: File;
  previewUrl: string;
  uploadedUrl?: string;
  status: 'pending' | 'uploading' | 'uploaded' | 'error';
}

interface DetectionResult {
  id: string;
  imageId: string;
  bbox: BoundingBox;
  category: ItemCategory;
  confidence: number;
  croppedImageUrl: string;
  isManual: boolean;
}

interface ItemDraft {
  detectionId: string;
  original?: ProductData;
  vibes: ProductData[];
}

interface ProductData {
  productName: string;
  brand: string;
  price?: number;
  currency?: string;
  purchaseUrl: string;
  imageUrl?: string;
}
```

---

## 생성 플로우 상태 머신

```
START
  ↓
[Upload Images] → 이미지 선택됨
  ↓
[AI Detection] → 아이템 감지됨, 편집 가능
  ↓
[Metadata Tagging] → 태그 선택됨
  ↓
[Spot Registration] → 제품 URL 추가됨
  ↓
[Review & Publish] → 모든 데이터 확인
  ↓
PUBLISHED
```

---

## 마이그레이션 경로

### 1단계: 기본 업로드
1. Supabase Storage 설정
2. 업로드 UI 구축
3. 이미지 검증 및 압축

### 2단계: AI 감지
1. Vision API 연결
2. 감지 오버레이 UI 구축
3. 수동 편집 도구

### 3단계: 태깅
1. 태그 선택자 컴포넌트 구축
2. 태그 검색 API
3. 태그 요청 플로우

### 4단계: 스팟 등록
1. Scraper 통합
2. URL 파싱 UI
3. 수동 대체 폼

---

## 보안 고려사항

- 파일 타입 검증 (확장자가 아닌 magic bytes)
- 이미지 크기 제한 서버측 적용
- 업로드 엔드포인트 레이트 리미팅
- Scraper는 임의 리다이렉트 따르지 않음
- 사용자 업로드 콘텐츠 모더레이션 큐

---

## 컴포넌트 매핑 (상세 구현 참조)

> 이 섹션은 AI 파이프라인과 각 UI 요소가 실제 코드에서 어떻게 구현되는지 매핑합니다.

### AI Detection Pipeline - 전체 흐름

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         AI ITEM DETECTION PIPELINE                            │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  [1. IMAGE INGESTION]                                                        │
│       │                                                                      │
│       ├─── 사용자 업로드 (C-01)                                              │
│       │    └─── Supabase Storage: uploads/{userId}/{timestamp}-{filename}   │
│       │                                                                      │
│       ├─── Instagram Scraper (배치)                                          │
│       │    └─── S3 Storage → CDN URL                                        │
│       │                                                                      │
│       ▼                                                                      │
│  [2. IMAGE PREPROCESSING]                                                    │
│       │                                                                      │
│       ├─── 이미지 유효성 검사                                                │
│       │    ├─── Magic bytes 검증 (not just extension)                       │
│       │    ├─── 해상도 체크 (min: 200x200, max: 4096x4096)                  │
│       │    └─── 파일 크기 체크 (max: 10MB)                                  │
│       │                                                                      │
│       ├─── 이미지 정규화                                                     │
│       │    ├─── EXIF orientation 보정                                       │
│       │    ├─── 리사이징 (max 1920px on longer side)                       │
│       │    └─── 포맷 통일 (→ JPEG quality 85)                              │
│       │                                                                      │
│       ▼                                                                      │
│  [3. AI DETECTION]                                                           │
│       │                                                                      │
│       ├─── Fashion Detection Model                                          │
│       │    │                                                                 │
│       │    ├─── Model: YOLO v8 (custom trained on fashion)                 │
│       │    │                                                                 │
│       │    ├─── Categories:                                                 │
│       │    │    ├─── top (상의)                                             │
│       │    │    ├─── bottom (하의)                                          │
│       │    │    ├─── dress (드레스/원피스)                                  │
│       │    │    ├─── outerwear (아우터)                                     │
│       │    │    ├─── bag (가방)                                             │
│       │    │    ├─── shoes (신발)                                           │
│       │    │    ├─── accessory (액세서리)                                   │
│       │    │    ├─── jewelry (주얼리)                                       │
│       │    │    └─── eyewear (안경/선글라스)                                │
│       │    │                                                                 │
│       │    └─── Output per item:                                            │
│       │         {                                                            │
│       │           bbox: { x, y, width, height },  // 정규화된 0-1 값       │
│       │           category: string,                                          │
│       │           confidence: number,  // 0-1                               │
│       │           center: { x, y }     // 핀 위치용                         │
│       │         }                                                            │
│       │                                                                      │
│       ▼                                                                      │
│  [4. POST-PROCESSING]                                                        │
│       │                                                                      │
│       ├─── Confidence Filtering                                             │
│       │    └─── threshold: 0.5 (< 50% 신뢰도는 제외)                       │
│       │                                                                      │
│       ├─── Non-Maximum Suppression (NMS)                                    │
│       │    └─── IoU threshold: 0.5 (겹치는 박스 제거)                      │
│       │                                                                      │
│       ├─── Item Cropping                                                    │
│       │    ├─── 각 detection bbox로 이미지 크롭                            │
│       │    ├─── padding: 10% (여백 추가)                                   │
│       │    └─── 저장: crops/{imageId}/{itemIndex}.jpg                      │
│       │                                                                      │
│       ▼                                                                      │
│  [5. DATABASE STORAGE]                                                       │
│       │                                                                      │
│       ├─── post_image 테이블                                                │
│       │    {                                                                 │
│       │      id, post_id, storage_path,                                     │
│       │      item_locations: JSON[]  // detection 결과                     │
│       │    }                                                                 │
│       │                                                                      │
│       └─── item 테이블 (각 detection당)                                     │
│            {                                                                 │
│              id, post_image_id, category,                                   │
│              center: { x, y }, bbox: { ... },                               │
│              cropped_image_url                                               │
│            }                                                                 │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 비전 API 상세

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         VISION API ARCHITECTURE                               │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Client Request                                                              │
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ POST /api/ai/detect                                                     ││
│  │                                                                          ││
│  │ Request Body:                                                            ││
│  │ {                                                                        ││
│  │   imageUrl: string,      // Supabase Storage URL                        ││
│  │   options?: {                                                            ││
│  │     minConfidence?: number,  // default: 0.5                            ││
│  │     maxItems?: number,       // default: 10                             ││
│  │     includeAccessories?: boolean  // default: true                      ││
│  │   }                                                                      ││
│  │ }                                                                        ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ API Route Handler                                                        ││
│  │ packages/web/app/api/ai/detect/route.ts                                 ││
│  │                                                                          ││
│  │ 1. Request validation (Zod schema)                                      ││
│  │ 2. Rate limiting check (10 req/min per user)                            ││
│  │ 3. Image fetch & preprocessing                                          ││
│  │ 4. Call Vision Service                                                  ││
│  │ 5. Post-process results                                                 ││
│  │ 6. Generate crop images                                                 ││
│  │ 7. Return response                                                      ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ Vision Service (External)                                                ││
│  │                                                                          ││
│  │ Option A: Self-hosted YOLO                                              ││
│  │ ├─── Docker container with FastAPI                                      ││
│  │ ├─── GPU acceleration (CUDA)                                            ││
│  │ └─── Endpoint: VISION_API_URL env var                                   ││
│  │                                                                          ││
│  │ Option B: Cloud Vision API (Google/AWS)                                 ││
│  │ ├─── Fashion-specific model                                             ││
│  │ └─── Pay-per-request pricing                                            ││
│  │                                                                          ││
│  │ Option C: Hybrid                                                        ││
│  │ ├─── Self-hosted for batch processing                                   ││
│  │ └─── Cloud API for real-time user uploads                               ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│       │                                                                      │
│       ▼                                                                      │
│  Response:                                                                   │
│  {                                                                           │
│    success: true,                                                            │
│    items: [                                                                  │
│      {                                                                       │
│        id: "uuid",                                                           │
│        category: "top",                                                      │
│        confidence: 0.93,                                                     │
│        bbox: { x: 0.15, y: 0.20, width: 0.40, height: 0.50 },              │
│        center: { x: 0.35, y: 0.45 },                                        │
│        croppedImageUrl: "https://storage.../crops/abc123/0.jpg"            │
│      },                                                                      │
│      ...                                                                     │
│    ],                                                                        │
│    processingTime: 1234  // ms                                              │
│  }                                                                           │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

### C-01 이미지 업로드 - 컴포넌트 매핑

#### 업로드 UI 구조

```
┌────────────────────────────────────────────────────────────────────────────┐
│ IMAGE UPLOAD COMPONENT STRUCTURE                                            │
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ CreateUploadPage.tsx (app/create/upload/page.tsx)                      │ │
│ │                                                                        │ │
│ │ ┌────────────────────────────────────────────────────────────────────┐│ │
│ │ │ CreateFlowHeader.tsx                                               ││ │
│ │ │ ┌─────────────────────────────────────────────────────────────┐   ││ │
│ │ │ │ Create New Post                              [Cancel]       │   ││ │
│ │ │ └─────────────────────────────────────────────────────────────┘   ││ │
│ │ │                                                                    ││ │
│ │ │ ┌─────────────────────────────────────────────────────────────┐   ││ │
│ │ │ │ Step Indicator: [1. Upload] - 2. Detect - 3. Tag - 4. Link │   ││ │
│ │ │ └─────────────────────────────────────────────────────────────┘   ││ │
│ │ └────────────────────────────────────────────────────────────────────┘│ │
│ │                                                                        │ │
│ │ ┌────────────────────────────────────────────────────────────────────┐│ │
│ │ │ DropZone.tsx                                                       ││ │
│ │ │                                                                    ││ │
│ │ │ ┌────────────────────────────────────────────────────────────────┐││ │
│ │ │ │                                                                │││ │
│ │ │ │              📷 Drag & drop images here                       │││ │
│ │ │ │                                                                │││ │
│ │ │ │              or click to select files                         │││ │
│ │ │ │                                                                │││ │
│ │ │ │              ─────────────────────────                        │││ │
│ │ │ │                                                                │││ │
│ │ │ │              Supports: JPG, PNG, WebP                         │││ │
│ │ │ │              Max: 10MB per image                              │││ │
│ │ │ │                                                                │││ │
│ │ │ └────────────────────────────────────────────────────────────────┘││ │
│ │ │                                                                    ││ │
│ │ │ Events:                                                            ││ │
│ │ │ ├─── onDragEnter → setIsDragging(true), border highlight         ││ │
│ │ │ ├─── onDragLeave → setIsDragging(false)                          ││ │
│ │ │ ├─── onDrop → handleFiles(e.dataTransfer.files)                  ││ │
│ │ │ └─── onClick → inputRef.current.click()                          ││ │
│ │ │                                                                    ││ │
│ │ │ Hidden input:                                                      ││ │
│ │ │ <input type="file" accept="image/*" multiple ref={inputRef} />   ││ │
│ │ └────────────────────────────────────────────────────────────────────┘│ │
│ │                                                                        │ │
│ │ ┌────────────────────────────────────────────────────────────────────┐│ │
│ │ │ ImagePreviewGrid.tsx                                               ││ │
│ │ │                                                                    ││ │
│ │ │ Selected Images (2/5):                                            ││ │
│ │ │ ┌─────────┐ ┌─────────┐ ┌─────────┐                              ││ │
│ │ │ │ImagePre-│ │ImagePre-│ │ AddMore │                              ││ │
│ │ │ │view.tsx │ │view.tsx │ │ Button  │                              ││ │
│ │ │ │         │ │         │ │         │                              ││ │
│ │ │ │ [img 1] │ │ [img 2] │ │   [+]   │                              ││ │
│ │ │ │   [✕]   │ │   [✕]   │ │   add   │                              ││ │
│ │ │ │uploading│ │uploaded │ │         │                              ││ │
│ │ │ │ ████░░  │ │  ✓      │ │         │                              ││ │
│ │ │ └─────────┘ └─────────┘ └─────────┘                              ││ │
│ │ │                                                                    ││ │
│ │ │ 상태:                                                             ││ │
│ │ │ images: UploadedImage[] (createStore)                            ││ │
│ │ └────────────────────────────────────────────────────────────────────┘│ │
│ │                                                                        │ │
│ │ ┌────────────────────────────────────────────────────────────────────┐│ │
│ │ │ [Next: Detect Items →]                                            ││ │
│ │ │                                                                    ││ │
│ │ │ disabled={!hasUploadedImages || isUploading}                      ││ │
│ │ │ onClick → router.push('/create/detect')                          ││ │
│ │ └────────────────────────────────────────────────────────────────────┘│ │
│ │                                                                        │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│ 파일 위치:                                                                 │
│ packages/web/app/create/upload/page.tsx                                   │
│ packages/web/lib/components/create/                                       │
│ ├── DropZone.tsx                                                          │
│ ├── ImagePreviewGrid.tsx                                                  │
│ ├── ImagePreview.tsx                                                      │
│ └── CreateFlowHeader.tsx                                                  │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

#### 이미지 업로드 이벤트 흐름

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    IMAGE UPLOAD EVENT FLOW                                │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [사용자 액션: 파일 선택/드롭]                                           │
│       │                                                                  │
│       ▼                                                                  │
│  DropZone.tsx: handleFiles(fileList)                                     │
│       │                                                                  │
│       ├─── 파일 개수 검증 ────────────────────────────────────────┐      │
│       │    현재 + 새로운 파일 <= 5개                              │      │
│       │         │                                                 │      │
│       │    초과 시 → Toast: "Maximum 5 images allowed"            │      │
│       │                                                           │      │
│       ▼                                                           │      │
│  각 파일에 대해 순차 처리:                                        │      │
│       │                                                           │      │
│  for (const file of files) {                                      │      │
│       │                                                           │      │
│       ├─── [1. 클라이언트 검증] ──────────────────────────────────┤      │
│       │         │                                                 │      │
│       │         ├─── 타입 검증                                    │      │
│       │         │    file.type in ['image/jpeg', 'image/png',    │      │
│       │         │                  'image/webp']                  │      │
│       │         │                                                 │      │
│       │         ├─── 크기 검증                                    │      │
│       │         │    file.size <= 10 * 1024 * 1024 (10MB)        │      │
│       │         │                                                 │      │
│       │         └─── 실패 시 → Toast with error                   │      │
│       │                                                           │      │
│       ├─── [2. 프리뷰 생성] ──────────────────────────────────────┤      │
│       │         │                                                 │      │
│       │         ├─── URL.createObjectURL(file)                   │      │
│       │         │                                                 │      │
│       │         └─── createStore.addImage({                      │      │
│       │                id: uuid(),                                │      │
│       │                file,                                      │      │
│       │                previewUrl,                                │      │
│       │                status: 'pending'                          │      │
│       │              })                                           │      │
│       │                                                           │      │
│       ├─── [3. 이미지 압축] ──────────────────────────────────────┤      │
│       │         │                                                 │      │
│       │         ├─── browser-image-compression 라이브러리         │      │
│       │         │    options: {                                   │      │
│       │         │      maxSizeMB: 2,                             │      │
│       │         │      maxWidthOrHeight: 1920,                   │      │
│       │         │      useWebWorker: true                        │      │
│       │         │    }                                           │      │
│       │         │                                                 │      │
│       │         └─── createStore.updateImage(id, {               │      │
│       │                status: 'uploading',                       │      │
│       │                progress: 0                                │      │
│       │              })                                           │      │
│       │                                                           │      │
│       ├─── [4. Supabase 업로드] ──────────────────────────────────┤      │
│       │         │                                                 │      │
│       │         ├─── path = `uploads/${userId}/${timestamp}_${name}`     │
│       │         │                                                 │      │
│       │         ├─── supabase.storage                            │      │
│       │         │      .from('user-uploads')                     │      │
│       │         │      .upload(path, compressedFile, {           │      │
│       │         │        cacheControl: '3600',                   │      │
│       │         │        upsert: false,                          │      │
│       │         │        onUploadProgress: (progress) => {       │      │
│       │         │          createStore.updateImage(id, {         │      │
│       │         │            progress: progress.percent           │      │
│       │         │          })                                     │      │
│       │         │        }                                        │      │
│       │         │      })                                         │      │
│       │         │                                                 │      │
│       │         └─── 성공 시 → createStore.updateImage(id, {     │      │
│       │                         status: 'uploaded',               │      │
│       │                         uploadedUrl: publicUrl            │      │
│       │                       })                                  │      │
│       │                                                           │      │
│       └─── [5. 에러 처리] ────────────────────────────────────────┤      │
│                 │                                                 │      │
│                 └─── 실패 시 → createStore.updateImage(id, {     │      │
│                                 status: 'error',                  │      │
│                                 error: message                    │      │
│                               })                                  │      │
│  }                                                                │      │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

### C-02 AI Detection - 컴포넌트 매핑

#### Detection UI 구조

```
┌────────────────────────────────────────────────────────────────────────────┐
│ AI DETECTION COMPONENT STRUCTURE                                            │
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ CreateDetectPage.tsx (app/create/detect/page.tsx)                      │ │
│ │                                                                        │ │
│ │ ┌────────────────────────────────────────────────────────────────────┐│ │
│ │ │ CreateFlowHeader.tsx                                               ││ │
│ │ │ Step Indicator: 1. Upload - [2. Detect] - 3. Tag - 4. Link        ││ │
│ │ └────────────────────────────────────────────────────────────────────┘│ │
│ │                                                                        │ │
│ │ ┌────────────────────────────────────────────────────────────────────┐│ │
│ │ │ DetectionCanvas.tsx                                                ││ │
│ │ │                                                                    ││ │
│ │ │ ┌────────────────────────────────────────────────────────────────┐││ │
│ │ │ │ Canvas Container (position: relative)                          │││ │
│ │ │ │                                                                │││ │
│ │ │ │  ┌────────────────────────────────────────────────────────┐   │││ │
│ │ │ │  │ <Image />  (업로드된 이미지)                           │   │││ │
│ │ │ │  │                                                        │   │││ │
│ │ │ │  │     ┌─ ─ ─ ─ ─ ─ ─ ┐  BoundingBox.tsx #1              │   │││ │
│ │ │ │  │     │              │  category: "top"                  │   │││ │
│ │ │ │  │     │   Item 1     │  confidence: 93%                  │   │││ │
│ │ │ │  │     │   93%        │  draggable, resizable            │   │││ │
│ │ │ │  │     └─ ─ ─ ─ ─ ─ ─ ┘                                  │   │││ │
│ │ │ │  │                                                        │   │││ │
│ │ │ │  │          ┌─ ─ ─ ─ ─ ─ ┐  BoundingBox.tsx #2           │   │││ │
│ │ │ │  │          │            │  category: "bag"               │   │││ │
│ │ │ │  │          │  Item 2    │  confidence: 87%               │   │││ │
│ │ │ │  │          │  87%       │                                │   │││ │
│ │ │ │  │          └─ ─ ─ ─ ─ ─ ┘                                │   │││ │
│ │ │ │  │                                                        │   │││ │
│ │ │ │  └────────────────────────────────────────────────────────┘   │││ │
│ │ │ │                                                                │││ │
│ │ │ │  Tools:                                                        │││ │
│ │ │ │  [Select] [Draw New Box] [Zoom In] [Zoom Out]                 │││ │
│ │ │ │                                                                │││ │
│ │ │ └────────────────────────────────────────────────────────────────┘││ │
│ │ │                                                                    ││ │
│ │ │ 모드:                                                             ││ │
│ │ │ - select: 박스 선택/이동/리사이즈                                ││ │
│ │ │ - draw: 새 박스 그리기                                           ││ │
│ │ └────────────────────────────────────────────────────────────────────┘│ │
│ │                                                                        │ │
│ │ ┌────────────────────────────────────────────────────────────────────┐│ │
│ │ │ DetectedItemList.tsx                                               ││ │
│ │ │                                                                    ││ │
│ │ │ Found 2 items:                                                    ││ │
│ │ │                                                                    ││ │
│ │ │ ┌────────────────────────────────────────────────────────────────┐││ │
│ │ │ │ DetectedItemCard.tsx #1                                        │││ │
│ │ │ │                                                                │││ │
│ │ │ │ ┌────┐  Item 1                                          [✕]  │││ │
│ │ │ │ │crop│  Category: [Top ▼]  (드롭다운으로 변경 가능)          │││ │
│ │ │ │ └────┘  Confidence: 93%                                      │││ │
│ │ │ │                                                                │││ │
│ │ │ │         [Edit Box]  [Remove]                                  │││ │
│ │ │ │                                                                │││ │
│ │ │ │ onClick → setSelectedBoxId(item.id)                          │││ │
│ │ │ └────────────────────────────────────────────────────────────────┘││ │
│ │ │                                                                    ││ │
│ │ │ ┌────────────────────────────────────────────────────────────────┐││ │
│ │ │ │ DetectedItemCard.tsx #2                                        │││ │
│ │ │ │ ...                                                            │││ │
│ │ │ └────────────────────────────────────────────────────────────────┘││ │
│ │ │                                                                    ││ │
│ │ │ [+ Add Item Manually]                                             ││ │
│ │ └────────────────────────────────────────────────────────────────────┘│ │
│ │                                                                        │ │
│ │ ┌────────────────────────────────────────────────────────────────────┐│ │
│ │ │ [← Back]                           [Next: Add Details →]          ││ │
│ │ └────────────────────────────────────────────────────────────────────┘│ │
│ │                                                                        │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│ 파일 위치:                                                                 │
│ packages/web/app/create/detect/page.tsx                                   │
│ packages/web/lib/components/create/                                       │
│ ├── DetectionCanvas.tsx                                                   │
│ ├── BoundingBox.tsx                                                       │
│ ├── DetectedItemList.tsx                                                  │
│ └── DetectedItemCard.tsx                                                  │
│                                                                            │
│ 훅:                                                                        │
│ packages/web/lib/hooks/useAIDetection.ts                                  │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

#### AI Detection 이벤트 흐름

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    AI DETECTION EVENT FLOW                                │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [페이지 마운트]                                                         │
│       │                                                                  │
│       ▼                                                                  │
│  CreateDetectPage.tsx                                                    │
│       │                                                                  │
│       ├─── createStore.images 로드                                      │
│       │                                                                  │
│       ├─── 각 이미지에 대해 detection 실행 ─────────────────────────┐    │
│       │         │                                                   │    │
│       │         ▼                                                   │    │
│       │    useAIDetection(imageUrl)                                 │    │
│       │         │                                                   │    │
│       │         ├─── 상태: 'loading'                                │    │
│       │         │    UI: "Analyzing image..." + Spinner             │    │
│       │         │                                                   │    │
│       │         ├─── POST /api/ai/detect                           │    │
│       │         │    body: { imageUrl }                             │    │
│       │         │                                                   │    │
│       │         │         │                                         │    │
│       │         │    ┌────┴────┐                                    │    │
│       │         │    ▼         ▼                                    │    │
│       │         │ Success   Error                                   │    │
│       │         │    │         │                                    │    │
│       │         │    │         └─── 상태: 'error'                   │    │
│       │         │    │              UI: "Detection failed"          │    │
│       │         │    │              [Retry] 버튼                     │    │
│       │         │    │                                              │    │
│       │         │    └─── 상태: 'success'                           │    │
│       │         │         detections = response.items               │    │
│       │         │         createStore.setDetections(detections)     │    │
│       │         │                                                   │    │
│       ▼         │                                                   │    │
│  [Detection 결과 표시]                                               │    │
│       │                                                              │    │
│       ├─── items.length === 0?                                      │    │
│       │         │                                                   │    │
│       │    YES  ▼                                                   │    │
│       │    "No items detected"                                      │    │
│       │    [Draw manually] 버튼                                     │    │
│       │                                                              │    │
│       │    NO   ▼                                                   │    │
│       │    DetectionCanvas에 BoundingBox 렌더링                     │    │
│       │    DetectedItemList에 카드 렌더링                           │    │
│       │                                                              │    │
│       ▼                                                              │    │
│  [사용자 수정]                                                       │    │
│       │                                                              │    │
│       ├─── BoundingBox 드래그                                       │    │
│       │    onDrag → createStore.updateDetection(id, { bbox })      │    │
│       │                                                              │    │
│       ├─── BoundingBox 리사이즈                                     │    │
│       │    onResize → createStore.updateDetection(id, { bbox })    │    │
│       │                                                              │    │
│       ├─── Category 변경                                            │    │
│       │    onCategoryChange → createStore.updateDetection(id,      │    │
│       │                       { category })                         │    │
│       │                                                              │    │
│       ├─── 항목 삭제                                                │    │
│       │    onRemove → createStore.removeDetection(id)              │    │
│       │                                                              │    │
│       └─── 수동 추가                                                │    │
│            onAddManual → setMode('draw')                            │    │
│            사용자가 캔버스에 박스 그리기                             │    │
│            onDrawComplete → createStore.addDetection({              │    │
│              bbox, category: 'unknown', isManual: true              │    │
│            })                                                        │    │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

### C-04 스팟 등록 - 컴포넌트 매핑

#### URL 파싱 이벤트 흐름

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    URL SCRAPING EVENT FLOW                                │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [사용자 액션: URL 붙여넣기]                                             │
│       │                                                                  │
│       ▼                                                                  │
│  UrlInput.tsx: onPaste/onChange                                          │
│       │                                                                  │
│       ├─── URL 형식 검증 (regex) ────────────────────────────────────┐   │
│       │         │                                                    │   │
│       │    유효하지 않음 → 에러 표시: "Invalid URL"                   │   │
│       │                                                              │   │
│       │    유효함 ▼                                                  │   │
│       │    useScrapeUrl().scrape(url)                                │   │
│       │         │                                                    │   │
│       │         ▼                                                    │   │
│       │    상태: 'loading'                                           │   │
│       │    UI: [████████░░░░░░░] Fetching product info...           │   │
│       │         │                                                    │   │
│       │         ▼                                                    │   │
│       │    POST /api/scrape                                          │   │
│       │    body: { url }                                             │   │
│       │         │                                                    │   │
│       │    ┌────┴────────────────────────────────────────┐           │   │
│       │    ▼                                              ▼           │   │
│       │  Server-side Scraping                         Timeout        │   │
│       │    │                                              │           │   │
│       │    ├─── 지원 사이트 확인                         │           │   │
│       │    │    scraperConfigs[domain]                   │           │   │
│       │    │                                              │           │   │
│       │    ├─── Puppeteer/Playwright 실행                │           │   │
│       │    │    (필요시 JavaScript 렌더링)               │           │   │
│       │    │                                              │           │   │
│       │    ├─── HTML 파싱                                │           │   │
│       │    │    Cheerio로 상품 정보 추출                 │           │   │
│       │    │                                              │           │   │
│       │    ├─── 정규화                                   │           │   │
│       │    │    {                                         │           │   │
│       │    │      productName: string,                   │           │   │
│       │    │      brand: string,                         │           │   │
│       │    │      price: number,                         │           │   │
│       │    │      currency: string,                      │           │   │
│       │    │      imageUrl: string                       │           │   │
│       │    │    }                                         │           │   │
│       │    │                                              │           │   │
│       │    │         │                                    │           │   │
│       │    │    ┌────┴────┐                              │           │   │
│       │    │    ▼         ▼                              ▼           │   │
│       │  Success    Partial     Failed / Unsupported / Timeout      │   │
│       │    │         │              │                                │   │
│       │    │         │              └─── 상태: 'error'               │   │
│       │    │         │                   UI: "Could not fetch"       │   │
│       │    │         │                   [Enter manually] 버튼        │   │
│       │    │         │                                               │   │
│       │    │         └─── 상태: 'partial'                            │   │
│       │    │              UI: ParsedProductCard (일부 필드 비어있음) │   │
│       │    │              필드별 [Edit] 버튼                         │   │
│       │    │                                                         │   │
│       │    └─── 상태: 'success'                                      │   │
│       │         UI: ParsedProductCard (모든 정보 표시)               │   │
│       │         createStore.setItemProduct(detectionId, {            │   │
│       │           type: 'original', data: parsedData                 │   │
│       │         })                                                   │   │
│       │                                                              │   │
│       ▼                                                              │   │
│  [수동 입력 fallback]                                                │   │
│       │                                                              │   │
│       └─── ManualProductForm.tsx                                    │   │
│            ├─── Brand input (autocomplete)                          │   │
│            ├─── Product name input                                  │   │
│            ├─── Price input (currency selector)                     │   │
│            ├─── Image URL input (or upload)                         │   │
│            └─── [Save] → createStore.setItemProduct(...)            │   │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

### createStore (생성 플로우 상태)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ CREATE FLOW STATE STORE                                                    │
│                                                                            │
│ packages/web/lib/stores/createStore.ts                                    │
│                                                                            │
│ interface CreateState {                                                    │
│   // Current step                                                          │
│   step: 'upload' | 'detect' | 'tag' | 'spot' | 'review';                  │
│                                                                            │
│   // Step 1: Upload                                                        │
│   images: UploadedImage[];                                                │
│   addImage: (image: UploadedImage) => void;                               │
│   updateImage: (id: string, updates: Partial<UploadedImage>) => void;    │
│   removeImage: (id: string) => void;                                      │
│                                                                            │
│   // Step 2: Detect                                                        │
│   detections: DetectionResult[];                                          │
│   setDetections: (detections: DetectionResult[]) => void;                 │
│   updateDetection: (id: string, updates: Partial<DetectionResult>) => void;│
│   removeDetection: (id: string) => void;                                  │
│   addDetection: (detection: DetectionResult) => void;                     │
│                                                                            │
│   // Step 3: Tag                                                           │
│   tags: {                                                                  │
│     mediaId: string | null;                                               │
│     castIds: string[];                                                     │
│     contextType: ContextType | null;                                      │
│   };                                                                       │
│   setMedia: (mediaId: string | null) => void;                             │
│   toggleCast: (castId: string) => void;                                   │
│   setContext: (contextType: ContextType | null) => void;                  │
│                                                                            │
│   // Step 4: Spot                                                          │
│   items: Map<string, ItemDraft>;  // detectionId → ItemDraft              │
│   setItemProduct: (                                                        │
│     detectionId: string,                                                   │
│     type: 'original' | 'vibe',                                            │
│     data: ProductData                                                      │
│   ) => void;                                                               │
│   removeItemProduct: (detectionId: string, type: string) => void;         │
│                                                                            │
│   // Navigation                                                            │
│   goToStep: (step: CreateState['step']) => void;                          │
│   canProceed: () => boolean;  // 현재 step 완료 여부                      │
│                                                                            │
│   // Reset                                                                 │
│   reset: () => void;                                                       │
│ }                                                                          │
│                                                                            │
│ Step 진행 조건:                                                            │
│ ├─── upload → detect: images.length > 0 && 모든 이미지 uploaded           │
│ ├─── detect → tag: detections.length > 0                                  │
│ ├─── tag → spot: tags.mediaId !== null                                    │
│ └─── spot → review: 최소 1개 item에 original 설정                         │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 에지 케이스 및 에러 처리

### C-01 이미지 업로드

| 상황 | 처리 방법 | 구현 위치 |
|------|----------|----------|
| 파일 5개 초과 | Toast 알림 + 추가 파일 무시 | DropZone.tsx |
| 잘못된 파일 형식 | Toast 에러 + 파일 거부 | useImageUpload.ts |
| 파일 크기 초과 (>10MB) | Toast 에러 + 파일 거부 | useImageUpload.ts |
| 업로드 네트워크 오류 | 재시도 버튼 + 에러 상태 표시 | ImagePreview.tsx |
| 압축 실패 | 원본 파일로 업로드 시도 | imageCompression.ts |

### C-02 AI Detection

| 상황 | 처리 방법 | 구현 위치 |
|------|----------|----------|
| Detection API 타임아웃 | 재시도 버튼 + 수동 입력 옵션 | useAIDetection.ts |
| 아이템 0개 감지 | "No items found" + 수동 추가 안내 | CreateDetectPage.tsx |
| 낮은 신뢰도 (<50%) | 결과에서 제외 (필터링) | /api/ai/detect |
| 박스 겹침 | NMS로 중복 제거 | /api/ai/detect |
| 이미지 로드 실패 | placeholder + 에러 메시지 | DetectionCanvas.tsx |

### C-03 메타데이터 태깅

| 상황 | 처리 방법 | 구현 위치 |
|------|----------|----------|
| 미디어 검색 결과 없음 | "Request new tag" 옵션 표시 | MediaSelector.tsx |
| 필수 필드 미선택 | Next 버튼 비활성화 + 안내 | CreateTagPage.tsx |
| 네트워크 오류 | 검색 결과 캐시 사용 + 재시도 | useTagSearch.ts |

### C-04 스팟 등록

| 상황 | 처리 방법 | 구현 위치 |
|------|----------|----------|
| 미지원 사이트 | 수동 입력 폼 표시 | useScrapeUrl.ts |
| 스크래핑 실패 | 수동 입력 폼 표시 | SpotRegistration.tsx |
| 가격 파싱 실패 | 가격 필드만 수동 입력 요청 | ParsedProductCard.tsx |
| 이미지 URL 만료 | 이미지 다운로드 후 재업로드 | /api/scrape |

---

## 구현 상태 체크리스트

### C-01 이미지 업로드
- [ ] DropZone 컴포넌트
- [ ] 파일 검증 (타입, 크기)
- [ ] 이미지 압축
- [ ] Supabase Storage 업로드
- [ ] 업로드 진행률 표시
- [ ] 프리뷰 그리드
- [ ] 다중 이미지 지원

### C-02 AI 객체 인식
- [x] Backend detection pipeline
- [ ] Detection Canvas UI
- [ ] BoundingBox 컴포넌트
- [ ] 박스 드래그/리사이즈
- [ ] 수동 박스 그리기
- [ ] 카테고리 변경 UI
- [ ] Crop 이미지 생성

### C-03 메타데이터 태깅
- [ ] MediaSelector 컴포넌트
- [ ] CastSelector 컴포넌트
- [ ] ContextSelector 컴포넌트
- [ ] 태그 검색 API
- [ ] 태그 요청 모달

### C-04 스팟 등록
- [ ] UrlInput 컴포넌트
- [ ] Scraper API 엔드포인트
- [ ] ParsedProductCard 컴포넌트
- [ ] ManualProductForm 컴포넌트
- [ ] Vibe 추가 기능
- [ ] 지원 사이트 목록
