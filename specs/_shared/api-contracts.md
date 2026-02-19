# API Contracts

> User-facing API endpoints under `/api/v1/` (excluding `/api/v1/admin/`).
> All routes are Next.js proxy handlers that forward requests to the backend via `API_BASE_URL`.
> Client functions live in `packages/web/lib/api/`.

**Auth mechanism:** Supabase JWT. Pass `Authorization: Bearer {token}` header.
Token retrieved via `getAuthToken()` from `packages/web/lib/api/client.ts`.

---

## Endpoint Index

| Method | Path | Auth | Handler File |
|--------|------|------|-------------|
| GET | /api/v1/posts | Public | `app/api/v1/posts/route.ts` |
| POST | /api/v1/posts | Required | `app/api/v1/posts/route.ts` |
| PATCH | /api/v1/posts/[postId] | Required | `app/api/v1/posts/[postId]/route.ts` |
| DELETE | /api/v1/posts/[postId] | Required | `app/api/v1/posts/[postId]/route.ts` |
| GET | /api/v1/posts/[postId]/spots | Public | `app/api/v1/posts/[postId]/spots/route.ts` |
| POST | /api/v1/posts/[postId]/spots | Required | `app/api/v1/posts/[postId]/spots/route.ts` |
| POST | /api/v1/posts/with-solution | Required | `app/api/v1/posts/with-solution/route.ts` |
| POST | /api/v1/posts/extract-metadata | Public | `app/api/v1/posts/extract-metadata/route.ts` |
| POST | /api/v1/posts/analyze | Public | `app/api/v1/posts/analyze/route.ts` |
| POST | /api/v1/posts/upload | Required | `app/api/v1/posts/upload/route.ts` |
| PATCH | /api/v1/solutions/[solutionId] | Required | `app/api/v1/solutions/[solutionId]/route.ts` |
| DELETE | /api/v1/solutions/[solutionId] | Required | `app/api/v1/solutions/[solutionId]/route.ts` |
| POST | /api/v1/solutions/convert-affiliate | Required | `app/api/v1/solutions/convert-affiliate/route.ts` |
| POST | /api/v1/solutions/extract-metadata | Required | `app/api/v1/solutions/extract-metadata/route.ts` |
| PATCH | /api/v1/spots/[spotId] | Required | `app/api/v1/spots/[spotId]/route.ts` |
| DELETE | /api/v1/spots/[spotId] | Required | `app/api/v1/spots/[spotId]/route.ts` |
| GET | /api/v1/spots/[spotId]/solutions | Public | `app/api/v1/spots/[spotId]/solutions/route.ts` |
| POST | /api/v1/spots/[spotId]/solutions | Required | `app/api/v1/spots/[spotId]/solutions/route.ts` |
| GET | /api/v1/users/me | Required | `app/api/v1/users/me/route.ts` |
| PATCH | /api/v1/users/me | Required | `app/api/v1/users/me/route.ts` |
| GET | /api/v1/users/me/stats | Required | `app/api/v1/users/me/stats/route.ts` |
| GET | /api/v1/users/me/activities | Required | `app/api/v1/users/me/activities/route.ts` |
| GET | /api/v1/users/[userId] | Public | `app/api/v1/users/[userId]/route.ts` |
| GET | /api/v1/categories | Public | `app/api/v1/categories/route.ts` |

> **debug-env route:** `GET /api/v1/debug-env` exists and returns `NODE_ENV`, `NEXT_PUBLIC_DEBUG`, and Supabase URL presence. Not env-guarded — available in all environments. Not documented as a user-facing API.

---

## Posts

### GET /api/v1/posts

**Client:** `fetchPosts(params?)` in `packages/web/lib/api/posts.ts`
(Server variant: `fetchPostsServer(params?)` — uses Next.js `next: { revalidate: 60 }`)
**Handler:** `packages/web/app/api/v1/posts/route.ts`
**Auth:** Public

| Query Param | Type | Required | Description |
|-------------|------|----------|-------------|
| artist_name | string | no | Filter by artist name |
| group_name | string | no | Filter by group name |
| context | string | no | Filter by context (airport, stage, drama, variety, daily, photoshoot, event, other) |
| category | string | no | Filter by category code |
| user_id | string | no | Filter by user ID |
| sort | "recent" \| "popular" \| "trending" | no | Sort order |
| page | number | no | Page number (1-indexed) |
| per_page | number | no | Items per page |

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "user": { "id": "uuid", "username": "string", "avatar_url": "string|null", "rank": "string|null" },
      "image_url": "string",
      "media_source": { "type": "string", "title": "string", "platform": "string?", "year": "number?" },
      "artist_name": "string|null",
      "group_name": "string|null",
      "context": "string|null",
      "spot_count": 3,
      "view_count": 100,
      "comment_count": 5,
      "created_at": "2026-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 20,
    "total_items": 591,
    "total_pages": 30
  }
}
```

---

### POST /api/v1/posts

**Client:** `createPostWithFile(request)` in `packages/web/lib/api/posts.ts`
**Handler:** `packages/web/app/api/v1/posts/route.ts`
**Auth:** Required
**Content-Type:** `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| image | File | yes | Post image file |
| data | JSON string | yes | Post metadata (see below) |

**data field shape:**
```json
{
  "image_url": "",
  "spots": [
    { "position_left": "45.5%", "position_top": "30.2%", "category_id": "uuid" }
  ],
  "media_source": { "type": "drama", "title": "string" },
  "artist_name": "string?",
  "group_name": "string?",
  "context": "string?",
  "description": "string?"
}
```

**Response 200:**
```json
{ "id": "uuid", "slug": "string?" }
```

**Response 401:** `{ "message": "Authentication required" }`

---

### PATCH /api/v1/posts/[postId]

**Client:** `updatePost(postId, data)` in `packages/web/lib/api/posts.ts`
**Handler:** `packages/web/app/api/v1/posts/[postId]/route.ts`
**Auth:** Required
**Content-Type:** `application/json`

| Path Param | Type | Description |
|------------|------|-------------|
| postId | string (UUID) | Post to update |

**Request body:**
```json
{
  "artist_name": "string?",
  "group_name": "string?",
  "context": "airport|stage|drama|variety|daily|photoshoot|event|other?",
  "media_source": { "type": "string", "title": "string", "platform": "string?", "year": "number?" }
}
```

**Response 200:** Updated `Post` object (same shape as GET /api/v1/posts item).

---

### DELETE /api/v1/posts/[postId]

**Client:** `deletePost(postId)` in `packages/web/lib/api/posts.ts`
**Handler:** `packages/web/app/api/v1/posts/[postId]/route.ts`
**Auth:** Required

| Path Param | Type | Description |
|------------|------|-------------|
| postId | string (UUID) | Post to delete |

**Response 204:** No content.

---

### GET /api/v1/posts/[postId]/spots

**Client:** `fetchSpots(postId)` in `packages/web/lib/api/spots.ts`
**Handler:** `packages/web/app/api/v1/posts/[postId]/spots/route.ts`
**Auth:** Public

| Path Param | Type | Description |
|------------|------|-------------|
| postId | string (UUID) | Parent post |

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "post_id": "uuid",
      "position_left": "45.5%",
      "position_top": "30.2%",
      "category_id": "uuid",
      "category": { "id": "uuid", "code": "wearables", "name": { "ko": "...", "en": "..." }, "color_hex": "#FF5733" },
      "solution_count": 3,
      "created_at": "2026-01-01T00:00:00Z"
    }
  ]
}
```

---

### POST /api/v1/posts/[postId]/spots

**Client:** `createSpot(postId, data)` in `packages/web/lib/api/spots.ts`
**Handler:** `packages/web/app/api/v1/posts/[postId]/spots/route.ts`
**Auth:** Required
**Content-Type:** `application/json`

| Path Param | Type | Description |
|------------|------|-------------|
| postId | string (UUID) | Parent post |

**Request body:**
```json
{
  "position_left": "45.5%",
  "position_top": "30.2%",
  "category_id": "uuid"
}
```

**Response 200/201:** Created `Spot` object.

---

### POST /api/v1/posts/with-solution

**Client:** `createPostWithSolution(request)` in `packages/web/lib/api/posts.ts`
**Handler:** `packages/web/app/api/v1/posts/with-solution/route.ts`
**Auth:** Required
**Content-Type:** `application/json`
**Note:** For users who already know the product (submits spot + solution together).

**Request body:**
```json
{
  "image_url": "https://...",
  "media_source": { "type": "drama", "title": "string" },
  "spots": [
    {
      "position_left": "45.5%",
      "position_top": "30.2%",
      "category_id": "uuid",
      "solution": {
        "title": "Product Name",
        "original_url": "https://shop.example.com/product",
        "thumbnail_url": "https://...",
        "price_amount": 129000,
        "price_currency": "KRW",
        "description": "string?"
      }
    }
  ],
  "artist_name": "string?",
  "group_name": "string?",
  "context": "string?",
  "description": "string?",
  "media_metadata": [{ "key": "platform", "value": "Netflix" }]
}
```

**Response 200:** `{ "id": "uuid", "slug": "string?" }`

---

### POST /api/v1/posts/extract-metadata

**Client:** `extractPostMetadata(description)` in `packages/web/lib/api/posts.ts`
**Handler:** `packages/web/app/api/v1/posts/extract-metadata/route.ts`
**Auth:** Public (no auth header required)
**Content-Type:** `application/json`

**Request body:**
```json
{ "description": "string — free-text description for AI to parse" }
```

**Validation:** `description` is required and must be a string (400 if missing).

**Response 200:**
```json
{
  "title": "string?",
  "media_metadata": [
    { "key": "platform", "value": "Netflix" },
    { "key": "season", "value": "2" }
  ]
}
```

---

### POST /api/v1/posts/analyze

**Client:** `analyzeImage(imageUrl)` in `packages/web/lib/api/posts.ts`
**Handler:** `packages/web/app/api/v1/posts/analyze/route.ts`
**Auth:** Public (no auth header required)
**Content-Type:** `application/json`

**Request body:**
```json
{ "image_url": "https://..." }
```

**Response 200:**
```json
{
  "detected_items": [
    {
      "left": 45.5,
      "top": 30.2,
      "category": "fashion",
      "label": "jacket",
      "confidence": 0.92
    }
  ],
  "metadata": {
    "artist_name": "string?",
    "context": "string?"
  }
}
```

---

### POST /api/v1/posts/upload

**Client:** `uploadImage({ file, onProgress?, maxRetries? })` in `packages/web/lib/api/posts.ts`
**Handler:** `packages/web/app/api/v1/posts/upload/route.ts`
**Auth:** Required
**Content-Type:** `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| file | File | yes | Image file to upload |

**Response 200:**
```json
{ "image_url": "https://storage.example.com/uploads/image.jpg" }
```

**Error responses:**
- `401`: Authentication required
- `502–504` (retryable): `{ "message": "...", "code": "GATEWAY_ERROR", "retryable": true }`
- `500`: `{ "message": "...", "code": "UPLOAD_ERROR", "retryable": true }`

**Client behavior:** Auto-retries on 502/503/504 and network errors. Max 2 retries with exponential backoff (1s base delay). Fires `onProgress` callbacks at 5–10% (start) and 70% (response received) and 100% (done).

---

## Solutions

### PATCH /api/v1/solutions/[solutionId]

**Client:** `updateSolution(solutionId, data)` in `packages/web/lib/api/solutions.ts`
**Handler:** `packages/web/app/api/v1/solutions/[solutionId]/route.ts`
**Auth:** Required
**Content-Type:** `application/json`

| Path Param | Type | Description |
|------------|------|-------------|
| solutionId | string (UUID) | Solution to update |

**Request body:**
```json
{
  "product_url": "string?",
  "product_name": "string?",
  "brand": "string?",
  "price": "number?",
  "currency": "string?",
  "image_url": "string?"
}
```

**Response 200:** Updated `Solution` object.

---

### DELETE /api/v1/solutions/[solutionId]

**Client:** `deleteSolution(solutionId)` in `packages/web/lib/api/solutions.ts`
**Handler:** `packages/web/app/api/v1/solutions/[solutionId]/route.ts`
**Auth:** Required

**Response 204:** No content.

---

### POST /api/v1/solutions/convert-affiliate

**Client:** `convertAffiliate(url)` in `packages/web/lib/api/solutions.ts`
**Handler:** `packages/web/app/api/v1/solutions/convert-affiliate/route.ts`
**Auth:** Required
**Content-Type:** `application/json`

**Request body:**
```json
{ "url": "https://product.example.com/item/123" }
```

**Response 200:**
```json
{
  "affiliate_url": "https://affiliate.example.com/item/123?ref=decoded",
  "original_url": "https://product.example.com/item/123"
}
```

---

### POST /api/v1/solutions/extract-metadata

**Client:** `extractSolutionMetadata(url)` in `packages/web/lib/api/solutions.ts`
**Handler:** `packages/web/app/api/v1/solutions/extract-metadata/route.ts`
**Auth:** Required
**Content-Type:** `application/json`

**Request body:**
```json
{ "url": "https://shop.example.com/product/123" }
```

**Response 200:**
```json
{
  "product_name": "string|null",
  "brand": "string|null",
  "price": "number|null",
  "currency": "string|null",
  "image_url": "string|null",
  "description": "string|null"
}
```

---

## Spots

### PATCH /api/v1/spots/[spotId]

**Client:** `updateSpot(spotId, data)` in `packages/web/lib/api/spots.ts`
**Handler:** `packages/web/app/api/v1/spots/[spotId]/route.ts`
**Auth:** Required
**Content-Type:** `application/json`

| Path Param | Type | Description |
|------------|------|-------------|
| spotId | string (UUID) | Spot to update |

**Request body:**
```json
{
  "position_left": "string?",
  "position_top": "string?",
  "category_id": "string?"
}
```

**Response 200:** Updated `Spot` object.

---

### DELETE /api/v1/spots/[spotId]

**Client:** `deleteSpot(spotId)` in `packages/web/lib/api/spots.ts`
**Handler:** `packages/web/app/api/v1/spots/[spotId]/route.ts`
**Auth:** Required

**Response 204:** No content.

---

### GET /api/v1/spots/[spotId]/solutions

**Client:** `fetchSolutions(spotId)` in `packages/web/lib/api/solutions.ts`
**Handler:** `packages/web/app/api/v1/spots/[spotId]/solutions/route.ts`
**Auth:** Public

| Path Param | Type | Description |
|------------|------|-------------|
| spotId | string (UUID) | Parent spot |

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "spot_id": "uuid",
      "user_id": "uuid",
      "user": { "id": "uuid", "username": "string", "avatar_url": "string|null", "rank": "string|null" },
      "product_url": "https://...",
      "affiliate_url": "string|null",
      "product_name": "string|null",
      "brand": "string|null",
      "price": 129000,
      "currency": "KRW",
      "image_url": "string|null",
      "vote_count": 5,
      "is_adopted": false,
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z"
    }
  ]
}
```

**Client note:** `fetchSolutions()` unwraps `.data` and returns `Solution[]` directly.

---

### POST /api/v1/spots/[spotId]/solutions

**Client:** `createSolution(spotId, data)` in `packages/web/lib/api/solutions.ts`
**Handler:** `packages/web/app/api/v1/spots/[spotId]/solutions/route.ts`
**Auth:** Required
**Content-Type:** `application/json`

| Path Param | Type | Description |
|------------|------|-------------|
| spotId | string (UUID) | Parent spot |

**Request body:**
```json
{
  "product_url": "https://...",
  "product_name": "string?",
  "brand": "string?",
  "price": "number?",
  "currency": "string?",
  "image_url": "string?"
}
```

**Response 200/201:** Created `Solution` object.

---

## Users

### GET /api/v1/users/me

**Client:** `fetchMe()` in `packages/web/lib/api/users.ts`
**Handler:** `packages/web/app/api/v1/users/me/route.ts`
**Auth:** Required

**Response 200:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "string",
  "rank": "string|null",
  "total_points": 100,
  "is_admin": false,
  "avatar_url": "string|null",
  "bio": "string|null",
  "display_name": "string|null"
}
```

---

### PATCH /api/v1/users/me

**Client:** `updateMe(data)` in `packages/web/lib/api/users.ts`
**Handler:** `packages/web/app/api/v1/users/me/route.ts`
**Auth:** Required
**Content-Type:** `application/json`

**Request body:**
```json
{
  "avatar_url": "string?",
  "bio": "string?",
  "display_name": "string?"
}
```

**Response 200:** Updated `UserResponse` object.

---

### GET /api/v1/users/me/stats

**Client:** `fetchUserStats()` in `packages/web/lib/api/users.ts`
**Handler:** `packages/web/app/api/v1/users/me/stats/route.ts`
**Auth:** Required

**Response 200:**
```json
{
  "total_posts": 10,
  "total_comments": 5,
  "total_likes_received": 50,
  "total_points": 100,
  "rank": "string|null"
}
```

---

### GET /api/v1/users/me/activities

**Client:** `fetchUserActivities(params?)` in `packages/web/lib/api/users.ts`
**Handler:** `packages/web/app/api/v1/users/me/activities/route.ts`
**Auth:** Required

| Query Param | Type | Required | Description |
|-------------|------|----------|-------------|
| type | "post" \| "spot" \| "solution" | no | Activity type filter |
| page | number | no | Page number |
| per_page | number | no | Items per page |

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "type": "post",
      "title": "string",
      "created_at": "2026-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 20,
    "total_items": 50,
    "total_pages": 3
  }
}
```

---

### GET /api/v1/users/[userId]

**Client:** `fetchUserById(userId)` in `packages/web/lib/api/users.ts`
**Handler:** `packages/web/app/api/v1/users/[userId]/route.ts`
**Auth:** Public

| Path Param | Type | Description |
|------------|------|-------------|
| userId | string (UUID) | User to fetch |

**Validation:** Returns 400 if userId is empty.

**Response 200:** `UserResponse` object (same shape as GET /api/v1/users/me).

---

## Categories

### GET /api/v1/categories

**Client:** `getCategories()` in `packages/web/lib/api/categories.ts`
**Handler:** `packages/web/app/api/v1/categories/route.ts`
**Auth:** Public

**Response 200:**
```json
[
  {
    "id": "uuid",
    "code": "wearables",
    "name": { "ko": "패션 아이템", "en": "Wearables" },
    "color_hex": "#FF5733"
  },
  { "id": "uuid", "code": "accessories", "name": { "ko": "악세사리", "en": "Accessories" }, "color_hex": "#..." },
  { "id": "uuid", "code": "beauty", "name": { "ko": "뷰티", "en": "Beauty" }, "color_hex": "#..." },
  { "id": "uuid", "code": "lifestyle", "name": { "ko": "라이프스타일", "en": "Lifestyle" }, "color_hex": "#..." },
  { "id": "uuid", "code": "other", "name": { "ko": "기타", "en": "Other" }, "color_hex": "#..." }
]
```

**Note:** Returns a flat array (not paginated). 5 categories total. Client utility functions:
- `findCategoryIdByCode(categories, code)` → `string | undefined`
- `findCategoryById(categories, id)` → `Category | undefined`

---

## Common Error Responses

All endpoints may return these errors:

| Status | When | Shape |
|--------|------|-------|
| 400 | Bad request / validation failure | `{ "message": "string" }` |
| 401 | Missing or invalid auth token | `{ "message": "Authentication required" }` |
| 404 | Resource not found | `{ "message": "string" }` |
| 500 | Proxy or server error | `{ "message": "string" }` |
| 500 | Unconfigured env | `{ "message": "Server configuration error" }` |

**Note:** All user-facing route files proxy to `process.env.API_BASE_URL`. If the env var is missing, all routes return 500 with "Server configuration error".
