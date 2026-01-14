# Creation & AI

> Features: C-01 ~ C-04
> Status: 10% implemented
> Dependencies: Vision API, Scraper infrastructure

---

## Overview

Creation features allow users to contribute content to the platform. AI features assist in automatically detecting items and extracting metadata, reducing manual effort and improving accuracy.

### Related Screens
- `/create` - Post creation flow
- `/create/upload` - Image upload step
- `/create/detect` - AI detection step
- `/create/tag` - Metadata tagging step
- `/create/spot` - Spot registration

### Current Implementation
- `app/lab/fashion-scan/` - Experimental AI visualization
- Backend pipeline exists for item detection
- No user-facing upload flow

---

## Features

### C-01 Image Upload

- **Description**: Allow users to upload images from mobile or web
- **Priority**: P0
- **Status**: Not Started
- **Dependencies**: U-01 (Authentication), Supabase Storage

#### Acceptance Criteria
- [ ] User can select image from device gallery
- [ ] User can drag-and-drop image on web
- [ ] User can paste image from clipboard (web)
- [ ] Multiple image upload supported (up to 5)
- [ ] Image preview before submission
- [ ] Progress indicator during upload
- [ ] Image validation (size, format, dimensions)
- [ ] Automatic image compression if needed
- [ ] Cancel upload in progress
- [ ] Error handling with retry option

#### UI/UX Requirements

**Upload Screen (Step 1)**:
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

**Mobile Upload**:
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

#### Data Requirements
- Supabase Storage bucket for uploads
- Image table entry for each upload
- Temporary upload directory for processing

#### Implementation Notes
```typescript
// lib/hooks/useImageUpload.ts
interface UploadProgress {
  status: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
  progress: number; // 0-100
  error?: string;
}

async function uploadImage(file: File): Promise<UploadResult> {
  // Validate
  if (file.size > 10 * 1024 * 1024) throw new Error('File too large');
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Invalid file type');
  }

  // Compress if needed
  const processedFile = await compressImage(file);

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(`${userId}/${Date.now()}-${file.name}`, processedFile);

  return { url: data.path, id: generateImageId() };
}
```

#### Files to Create/Modify
- `app/create/page.tsx` - Creation flow entry
- `app/create/upload/page.tsx` - Upload step
- `lib/components/create/ImageUploader.tsx`
- `lib/components/create/ImagePreviewGrid.tsx`
- `lib/components/create/DropZone.tsx`
- `lib/hooks/useImageUpload.ts`
- `lib/utils/imageCompression.ts`

---

### C-02 AI Object Recognition

- **Description**: Automatically detect and crop fashion items in uploaded images
- **Priority**: P0
- **Status**: Partial (backend exists, no UI)
- **Dependencies**: C-01, Vision API Module (S-01)

#### Acceptance Criteria
- [ ] Uploaded image sent to detection API
- [ ] Loading state shows "Analyzing image..."
- [ ] Detected items displayed with bounding boxes
- [ ] User can adjust bounding boxes manually
- [ ] User can remove false detections
- [ ] User can add missed items manually
- [ ] Cropped images generated for each item
- [ ] Category auto-suggested for each item
- [ ] Confidence score displayed
- [ ] Handles images with no detectable items

#### UI/UX Requirements

**Detection Screen (Step 2)**:
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

**Manual Box Drawing**:
```
Click and drag to draw bounding box:
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

#### Data Requirements
- Vision API endpoint
- Detection result schema
- Cropped image storage

#### API Endpoints
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

#### Implementation Notes
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

  // ... render bounding boxes with drag handles
}
```

#### Files to Create/Modify
- `app/create/detect/page.tsx` - Detection step
- `lib/components/create/DetectionOverlay.tsx`
- `lib/components/create/BoundingBox.tsx`
- `lib/components/create/DetectedItemList.tsx`
- `lib/hooks/useAIDetection.ts`
- `app/api/ai/detect/route.ts`

---

### C-03 Metadata Tagging

- **Description**: User selects Media, Cast, and Context tags for the post
- **Priority**: P0
- **Status**: Not Started
- **Dependencies**: C-01, D-02 (Hierarchical Filter), Database structure

#### Acceptance Criteria
- [ ] Step to select Media (required)
- [ ] Step to select Cast members (optional, multi-select)
- [ ] Step to select Context (optional)
- [ ] Autocomplete search for Media/Cast
- [ ] Can request new tag if not found
- [ ] Clear indication of required vs optional
- [ ] Summary of selected tags before submission
- [ ] Tags persist if user goes back to edit

#### UI/UX Requirements

**Tagging Screen (Step 3)**:
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

**Request New Tag Modal**:
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

#### Data Requirements
- Media search API
- Cast search API (filterable by media)
- Tag request table for admin review

#### API Endpoints
```
GET /api/tags/media/search?q=black
GET /api/tags/cast/search?q=jisoo&mediaId=xxx
POST /api/tags/request
  body: { type: 'media' | 'cast', name: string, nameKo: string, ... }
```

#### Files to Create/Modify
- `app/create/tag/page.tsx` - Tagging step
- `lib/components/create/MediaSelector.tsx`
- `lib/components/create/CastSelector.tsx`
- `lib/components/create/ContextSelector.tsx`
- `lib/components/create/TagRequestModal.tsx`
- `lib/hooks/useTagSearch.ts`

---

### C-04 Spot Registration (URL Parsing)

- **Description**: User enters shopping URL and system extracts product info
- **Priority**: P0
- **Status**: Not Started
- **Dependencies**: C-02, S-02 (Scraper Engine)

#### Acceptance Criteria
- [ ] User can paste shopping URL for each detected item
- [ ] System scrapes: product name, brand, price, image
- [ ] Preview of scraped data before confirmation
- [ ] Manual override for any field
- [ ] Support for major Korean/international shopping sites
- [ ] Fallback to manual entry if scraping fails
- [ ] Multiple URLs per item (original + vibe alternatives)
- [ ] Affiliate link handling

#### UI/UX Requirements

**Spot Registration (Step 4)**:
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

**URL Parsing Flow**:
```
User pastes URL
    ↓
[Loading: Fetching product info...]
    ↓
Success → Show parsed data, user confirms
    ↓
Failure → Show manual entry form
```

#### Data Requirements
- Scraper API endpoint
- Supported site configurations
- Product metadata schema

#### API Endpoints
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

#### Supported Sites (Initial)
- Korean: Musinsa, 29CM, W Concept, SSF Shop
- International: Farfetch, SSENSE, Net-a-Porter
- General: Amazon, Coupang

#### Implementation Notes
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

#### Files to Create/Modify
- `app/create/spot/page.tsx` - Spot registration step
- `lib/components/create/SpotRegistration.tsx`
- `lib/components/create/UrlInput.tsx`
- `lib/components/create/ParsedProductCard.tsx`
- `lib/components/create/ManualProductForm.tsx`
- `lib/hooks/useScrapeUrl.ts`
- `app/api/scrape/route.ts`

---

## Data Models

See [data-models.md](./data-models.md) for full type definitions.

### Key Types for Creation & AI

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

## Creation Flow State Machine

```
START
  ↓
[Upload Images] → images selected
  ↓
[AI Detection] → items detected, can edit
  ↓
[Metadata Tagging] → tags selected
  ↓
[Spot Registration] → product URLs added
  ↓
[Review & Publish] → confirm all data
  ↓
PUBLISHED
```

---

## Migration Path

### Phase 1: Basic Upload
1. Set up Supabase Storage
2. Build upload UI
3. Image validation and compression

### Phase 2: AI Detection
1. Connect to Vision API
2. Build detection overlay UI
3. Manual editing tools

### Phase 3: Tagging
1. Build tag selector components
2. Tag search APIs
3. Tag request flow

### Phase 4: Spot Registration
1. Scraper integration
2. URL parsing UI
3. Manual fallback form

---

## Security Considerations

- File type validation (magic bytes, not just extension)
- Image size limits enforced server-side
- Rate limiting on upload endpoints
- Scraper should not follow arbitrary redirects
- User-uploaded content moderation queue

---

## Component Mapping (상세 구현 참조)

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

### C-01 Image Upload - 컴포넌트 매핑

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

### C-04 Spot Registration - 컴포넌트 매핑

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

### createStore (Creation Flow State)

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

### C-01 Image Upload

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

### C-03 Metadata Tagging

| 상황 | 처리 방법 | 구현 위치 |
|------|----------|----------|
| 미디어 검색 결과 없음 | "Request new tag" 옵션 표시 | MediaSelector.tsx |
| 필수 필드 미선택 | Next 버튼 비활성화 + 안내 | CreateTagPage.tsx |
| 네트워크 오류 | 검색 결과 캐시 사용 + 재시도 | useTagSearch.ts |

### C-04 Spot Registration

| 상황 | 처리 방법 | 구현 위치 |
|------|----------|----------|
| 미지원 사이트 | 수동 입력 폼 표시 | useScrapeUrl.ts |
| 스크래핑 실패 | 수동 입력 폼 표시 | SpotRegistration.tsx |
| 가격 파싱 실패 | 가격 필드만 수동 입력 요청 | ParsedProductCard.tsx |
| 이미지 URL 만료 | 이미지 다운로드 후 재업로드 | /api/scrape |

---

## 구현 상태 체크리스트

### C-01 Image Upload
- [ ] DropZone 컴포넌트
- [ ] 파일 검증 (타입, 크기)
- [ ] 이미지 압축
- [ ] Supabase Storage 업로드
- [ ] 업로드 진행률 표시
- [ ] 프리뷰 그리드
- [ ] 다중 이미지 지원

### C-02 AI Object Recognition
- [x] Backend detection pipeline
- [ ] Detection Canvas UI
- [ ] BoundingBox 컴포넌트
- [ ] 박스 드래그/리사이즈
- [ ] 수동 박스 그리기
- [ ] 카테고리 변경 UI
- [ ] Crop 이미지 생성

### C-03 Metadata Tagging
- [ ] MediaSelector 컴포넌트
- [ ] CastSelector 컴포넌트
- [ ] ContextSelector 컴포넌트
- [ ] 태그 검색 API
- [ ] 태그 요청 모달

### C-04 Spot Registration
- [ ] UrlInput 컴포넌트
- [ ] Scraper API 엔드포인트
- [ ] ParsedProductCard 컴포넌트
- [ ] ManualProductForm 컴포넌트
- [ ] Vibe 추가 기능
- [ ] 지원 사이트 목록
