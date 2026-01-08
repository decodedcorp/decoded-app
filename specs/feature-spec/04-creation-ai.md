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
