# Codebase Concerns
**Analysis Date:** 2026-01-23

## Executive Summary
The codebase is well-structured with clear separation of concerns, but several technical debt items and fragile patterns exist that should be addressed for production stability. Primary concerns involve error handling gaps, client/server boundary confusion, resource cleanup issues, and external API dependency risks.

---

## Tech Debt

### 1. Error Handling Asymmetry in API Routes
**Issue:** API proxy routes (`/app/api/v1/**`) silently catch errors and return generic error messages without error context propagation.

**Files:**
- `packages/web/app/api/v1/posts/upload/route.ts` (lines 50-55)
- `packages/web/app/api/v1/posts/analyze/route.ts` (lines 41-47)
- `packages/web/app/api/v1/posts/route.ts` (lines 48-53, 100-105)

**Impact:**
- Client-side error handling receives only `"Failed to upload image"` or `"Failed to create post"` without context
- Backend error details (validation failures, rate limits, auth errors) are lost
- Difficult debugging for API integration issues

**Fix approach:**
- Parse backend error responses and extract meaningful error messages
- Preserve HTTP status codes and error structures from backend
- Create standardized error response envelope with details

### 2. Graceful Degradation Vs Proper Error Handling
**Issue:** `fetchPostsServer()` in `packages/web/lib/api/posts.ts` (lines 216-227) returns empty response on error instead of propagating failures.

**Impact:**
- Server components silently fail to load content
- No visibility into data loading failures
- Poor user experience (blank content appears to be "no data")

**Fix approach:**
- Distinguish between "no data" and "fetch failure"
- Use fallback UI to indicate load failure
- Implement retry mechanisms with exponential backoff

### 3. Supabase Storage URL Parsing Is Fragile
**Issue:** `deleteFromSupabaseStorage()` in `packages/web/lib/supabase/storage.ts` (lines 52-60) uses string splitting to extract file path from URL.

**Problem:**
```typescript
const urlParts = url.split(`${BUCKET_NAME}/`);
if (urlParts.length < 2) {
  console.warn("Invalid storage URL format:", url);
  return;  // Silent failure
}
```

**Impact:**
- If URL format changes, deletion silently fails
- Orphaned files accumulate in storage (costs increase)
- No error thrown, so calling code doesn't know about failure

**Fix approach:**
- Use URL parsing API instead of string splitting
- Store file paths alongside URLs in database
- Implement file cleanup audit logs

---

## Security Considerations

### 1. Authentication Token Exposure in Browser Client
**Issue:** `packages/web/lib/api/posts.ts` calls `getAuthToken()` to retrieve JWT from Supabase session every request (line 62).

**Risk:**
- Multiple token retrievals increase XSS attack surface
- Token stored in browser memory/session storage
- No token refresh strategy documented

**Mitigation:**
- Consider token caching with expiration
- Use httpOnly cookies if possible
- Document token refresh behavior

### 2. Unauthenticated AI Analysis Endpoint
**Issue:** `POST /api/v1/posts/analyze` doesn't require authentication (file `packages/web/app/api/v1/posts/analyze/route.ts`).

**Risk:**
- Potential for abuse/DoS via unlimited analysis requests
- Backend API costs not controlled
- No rate limiting visible in Next.js routes

**Mitigation:**
- Implement rate limiting middleware
- Add backend rate limits
- Consider auth requirement for production

### 3. Missing Environment Variable Validation
**Issue:** Environment variable availability checked at initialization time (`packages/web/lib/supabase/init.ts`) but no runtime validation for API_BASE_URL in route handlers.

**Impact:**
- Routes fail with vague 500 errors if API_BASE_URL is missing
- Difficult to debug in production

**Fix approach:**
- Create centralized env validation utility
- Fail fast with clear error messages at startup

### 4. No CORS Headers Configured
**Issue:** API proxy routes don't set explicit CORS headers; relying on Next.js defaults.

**Impact:**
- Unclear CORS behavior if frontend and backend are on different origins
- Potential credential handling issues

---

## Performance Bottlenecks

### 1. Image Compression Progress Simulation
**Issue:** `useImageUpload.ts` (lines 71-82) simulates progress with hardcoded timeouts:
```typescript
onProgress?.(10);  // Line 72
// ... do actual work
onProgress?.(70);  // Line 82
```

**Impact:**
- Progress bar doesn't reflect actual upload speed
- Poor UX for slow networks (appears done quickly then hangs)
- User might retry thinking upload failed

**Fix approach:**
- Use XMLHttpRequest or fetch with streaming to get real upload progress
- Implement actual compression progress tracking

### 2. Sequential Image Upload in Loop
**Issue:** `useImageUpload.ts` (lines 139-144) uploads images sequentially in a loop.

**Impact:**
- Single large image upload blocks others
- Slower throughput (especially with latency)
- Suboptimal resource utilization

**Fix approach:**
- Implement parallel uploads with configurable concurrency limit
- Add Promise.allSettled() for batch handling

### 3. Missing Cache Control Headers
**Issue:** `fetchPostsServer()` uses `{ revalidate: 60 }` but returns empty array on failure - no way to distinguish cached misses from errors.

**Impact:**
- Stale cache entries served indefinitely on persistent failures
- Memory waste from failed requests

---

## Fragile Areas

### 1. Image File Handling - Memory Leaks
**Issue:** `createPreviewUrl()` and `revokePreviewUrl()` in `packages/web/lib/utils/imageCompression.ts` use `URL.createObjectURL()`.

**Fragile Scenarios:**
- User navigates away before `removeImage()` is called
- Component unmounts without cleanup
- Multiple uploads aborted - revoke calls may not execute

**Fix approach:**
- Wrap in try-finally to guarantee revoke
- Use cleanup ref in React components
- Add warning logs for orphaned URLs

### 2. Zustand Store Missing Validation
**Issue:** `requestStore.ts` initializes DetectedSpot array and coordinates without type safety on updates.

**Fragile Scenarios:**
- `setDetectedSpots()` (line 312) accepts any array without validation
- `selectSpot()` (line 316) doesn't verify spotId exists
- No schema validation on state updates

**Fix approach:**
- Add zod/yup schema validation on store updates
- Implement selector guards

### 3. Missing Race Condition Handling
**Issue:** In `useImageUpload.ts`, simultaneous uploads of same file ID could cause state conflicts.

**Scenario:**
```
User clicks upload → uploadToStorage(id, file) starts
  ↓
User clicks upload same file again → uploadToStorage(id, file) starts again
  ↓
Both update same image ID concurrently → state race condition
```

**Fix approach:**
- Use AbortController to cancel pending uploads
- Lock per-image during upload

### 4. AI Analysis Timing Assumptions
**Issue:** `requestStore.ts` (lines 79-82) assumes `uploadToStorage()` completes before `startDetection()` is called via setTimeout.

**Fragile Scenarios:**
```typescript
setTimeout(() => {
  startDetection();
}, 100);  // Magic number - not guaranteed to be enough
```

**Impact:**
- Analysis might run on non-uploaded images
- Race condition with server-side storage

**Fix approach:**
- Use Promise-based flow instead of setTimeout
- Verify image uploaded before analysis

---

## Test Coverage Gaps

### Critical Areas Without Tests
1. **API proxy error handling** - No tests for backend error propagation
2. **Image upload retry logic** - `retryUpload()` in `useImageUpload.ts` untested
3. **Coordinate conversion** - `apiToStoreCoord()` and `storeToApiCoord()` in `packages/web/lib/api/types.ts` untested
4. **Supabase storage deletion** - `deleteFromSupabaseStorage()` untested; silent failures not caught
5. **Auth state transitions** - OAuth redirect flow in `authStore.ts` untested
6. **Zustand store validation** - No tests for invalid state transitions
7. **File format validation** - Edge cases in `validateImageFile()` untested

### Recommended Test Additions
- Unit tests for all validation functions
- Integration tests for API proxy routes with mocked backends
- E2E tests for upload flow (happy path + error scenarios)
- Mock tests for Supabase client interactions

---

## Environmental Concerns

### Missing `.env.local.example` Values
**File:** `.env.local.example` (modified in current branch)

**Check:** Verify all required env vars are documented:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `API_BASE_URL` (backend URL)
- `NEXT_PUBLIC_API_BASE_URL` (browser-side override)

**Risk:** Developers might miss environment setup, causing hard-to-debug failures.

---

## Dependency Risks

### 1. Browser Image Compression Library
**File:** `packages/web/lib/utils/imageCompression.ts`

**Issue:** External dependency `browser-image-compression` with fallback:
```typescript
catch {
  console.warn("이미지 압축 실패, 원본 파일 사용:", file.name);
  return { file, originalSize, compressedSize: originalSize, wasCompressed: false };
}
```

**Risk:**
- Compression failure doesn't throw error; silently uploads large files
- Could bypass intended file size limits

**Fix approach:**
- Make compression optional with explicit config
- Don't skip compression without explicit user confirmation

### 2. Supabase Client Version
**Files:** `packages/web/lib/supabase/init.ts`, `packages/web/lib/supabase/client.ts`

**Note:** Supabase client imported from `@decoded/shared` (monorepo).
- Ensure shared package keeps dependencies in sync
- Version mismatch could cause subtle auth bugs

---

## Configuration Issues

### 1. API Base URL Configuration
**Files:**
- `packages/web/lib/api/posts.ts` (line 20): `process.env.NEXT_PUBLIC_API_BASE_URL || ""`
- `packages/web/app/api/v1/posts/route.ts` (line 11): `process.env.API_BASE_URL`

**Issue:** Two different env var names used:
- Browser: `NEXT_PUBLIC_API_BASE_URL`
- Server: `API_BASE_URL`

**Risk:**
- Easy to misconfigure one
- Default empty string means silent failures instead of loud errors

**Fix approach:**
- Standardize env var names
- Throw if missing instead of defaulting to ""

### 2. Upload Config Constraints
**File:** `packages/web/lib/utils/validation.ts` (line 8)

```typescript
maxImages: 1,  // 단일 이미지만 허용 (AI 감지용)
```

**Concern:** Only 1 image allowed, but UI flow supports multi-image workflows. Verify this is intentional and not a configuration error.

---

## Data Consistency Risks

### 1. Coordinate System Mismatch
**Files:**
- `packages/web/lib/api/types.ts` (lines 182-191): Conversion functions
- `packages/web/lib/stores/requestStore.ts` (lines 127-140): DetectedSpot creation

**Risk:** If coordinate systems get out of sync between API and store:
```typescript
// API returns 0-100 percentages
// Store expects 0-1 normalized coords
// If conversion skipped, objects render at wrong positions
```

**Fix approach:**
- Add unit tests for coordinate conversion
- Create type-safe coordinate wrapper class

### 2. Image URL Mutation During Upload
**Issue:** `setImageUploadedUrl()` in `requestStore.ts` updates existing image object (lines 236-248).

**Risk:** If upload is retried, old URL might still be used in detections, pointing to stale Supabase storage.

---

## Monitoring Gaps

### 1. No Error Metrics Collection
- API errors logged to console only
- No error tracking (Sentry, etc.)
- No visibility into error rates in production

### 2. No Upload Instrumentation
- No tracking of upload success/failure rates
- No visibility into compression effectiveness
- No metrics on AI analysis latency

### 3. Silent Failures
- Storage deletion failures silently ignored
- Fetch failures return empty data instead of error
- Compression failures don't bubble up

---

## Recommendations Priority

### High Priority (Blocking Issues)
1. **Fix API error handling** - Return actual backend errors to client
2. **Add storage cleanup audit** - Prevent orphaned files
3. **Implement upload race condition protection** - Use AbortController
4. **Add env var validation** - Fail fast with clear errors

### Medium Priority (Technical Debt)
1. **Add test coverage** for critical paths (upload, auth, validation)
2. **Fix memory leaks** in preview URL management
3. **Implement real upload progress** tracking
4. **Standardize env var naming** across browser/server

### Low Priority (Nice to Have)
1. **Parallel upload optimization** - Batch multiple images
2. **Add error tracking** (Sentry integration)
3. **Implement rate limiting** on public endpoints
4. **Create shared error types** across API boundary

---

*Concerns audit: 2026-01-23*
*Analysis covered: 1926 TS/TSX files, 21 API/storage/hook files reviewed*
