# API Services Documentation

## Service Structure

API 서비스는 다음과 같이 구성되어 있습니다:

### 1. Core

- `apiClient`: Axios 인스턴스
- `buildQueryString`: 쿼리 문자열 빌더
- `errorHandler`: 에러 처리 핸들러

### 2. Requests

- `auth`: 인증 관련 API
- `images`: 이미지 관련 API
- `items`: 아이템 관련 API
- `users`: 유저 관련 API

### 3. Types

- `models`: API 응답 모델
- `services`: API 서비스 인터페이스

## API Services

### 1. Images Service

```typescript
// @/lib/api/requests/images.ts
imagesService = {
  getImageDetail: (imageId: string) => Promise<ImageDoc>,
  getImages: (options?: { limit?: number; next_id?: string }) =>
    Promise<ImageDoc[]>,
  getRandomResources: (options: { type: 'image' | 'item'; limit?: number }) =>
    Promise<RandomResourcesResponse>,
  uploadImage: (data: ImageBase_Input) => Promise<void>,
  getFeaturedImages: () => Promise<ImageData[]>,
  getTrendingImages: () => Promise<TrendingImage[]>,
};
```

### 2. Items Service

```typescript
// @/lib/api/requests/items.ts
itemsService = {
  getItemDetail: (itemId: string) => Promise<ItemDoc>,
  getItems: (options?: { limit?: number; next_id?: string }) =>
    Promise<ItemDoc[]>,
  searchItems: (
    query: string,
    options?: { limit?: number; next_id?: string }
  ) => Promise<ItemDoc[]>,
  getRelatedItems: (itemId: string, limit?: number) => Promise<ItemDoc[]>,
};
```

### 3. Users Service

```typescript
// @/lib/api/requests/users.ts
usersService = {
  getUserProfile: (userId: string) => Promise<UserDoc>,
  getUserActivity: (
    userId: string,
    options?: { limit?: number; next_id?: string }
  ) => Promise<GetDocumentResponse>,
  getNotifications: (
    userId: string,
    options?: { skip?: number; limit?: number; unread_only?: boolean }
  ) => Promise<NotificationDoc[]>,
  markNotificationAsRead: (userId: string, notificationId: string) =>
    Promise<void>,
};
```

### 4. Request Service

```typescript
// @/lib/api/requests/request.ts
requestService = {
  createImageRequest: (userId: string, data: RequestImage) => Promise<void>,
  addImageRequest: (
    userId: string,
    imageId: string,
    requestData: RequestImage
  ) => Promise<void>,
  getImageRequests: (userId: string) => Promise<RequestImage[]>,
  getPendingRequests: (userId: string, options?: { next_id?: string }) =>
    Promise<RequestImage[]>,
};
```
