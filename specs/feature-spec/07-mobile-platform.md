# Mobile Platform (Cross-Platform)

> Features: M-01 ~ M-06
> Status: 30% implemented (Foundation complete)
> Dependencies: Shared code layer, Supabase

---

## Overview

크로스플랫폼 모바일 앱 개발을 위한 하이브리드 모노레포 아키텍처. 웹(Next.js)과 모바일(Expo)이 공유 코드 레이어를 통해 비즈니스 로직을 재사용합니다.

### Architecture Decision

| 옵션 | SSR 지원 | App Store | 네이티브 성능 | 선택 이유 |
|------|----------|-----------|---------------|-----------|
| Capacitor | ❌ | ✅ | WebView 한계 | - |
| Tauri | ❌ | ✅ | 우수 (Rust) | 모바일 초기 단계 |
| **Expo** | ❌ | ✅ | **네이티브 UI** | **선택** |
| PWA | ✅ | ❌ | 중간 | App Store 불가 |

**Expo 선택 이유**:
1. 진정한 네이티브 성능 (이미지 갤러리 스크롤 최적화)
2. 풍부한 네이티브 기능 SDK (푸시 알림, 카메라)
3. App Store 심사 안전성 (순수 WebView 앱 거절 위험 회피)
4. React Native 생태계 활용

---

## Project Structure

```
decoded-monorepo/
├── packages/
│   ├── shared/                    # 공유 코드
│   │   ├── supabase/
│   │   │   ├── client.ts          # 추상화된 Supabase 클라이언트
│   │   │   ├── types.ts           # DB 타입 정의
│   │   │   └── queries/           # 쿼리 함수들
│   │   ├── hooks/
│   │   │   ├── useImages.ts       # React Query 훅
│   │   │   └── useDebounce.ts
│   │   ├── stores/
│   │   │   ├── filterStore.ts     # Zustand 스토어
│   │   │   └── searchStore.ts
│   │   └── index.ts               # 메인 export
│   │
│   ├── web/                       # Next.js 웹 앱
│   │   ├── app/                   # App Router (SSR 유지)
│   │   ├── lib/
│   │   │   ├── components/        # 웹 전용 컴포넌트
│   │   │   └── supabase/
│   │   │       └── init.ts        # 웹용 초기화
│   │   └── next.config.js
│   │
│   └── mobile/                    # Expo 네이티브 앱
│       ├── app/                   # Expo Router
│       │   ├── (tabs)/            # 탭 내비게이션
│       │   └── images/[id].tsx    # 상세 화면
│       ├── components/            # RN 컴포넌트
│       └── providers/             # Provider 설정
│
├── package.json                   # Yarn workspaces
└── yarn.lock
```

---

## Features

### M-01 Shared Code Layer

- **Description**: 웹/모바일 공유 코드 패키지 (@decoded/shared)
- **Priority**: P0 (Foundation)
- **Status**: ✅ Implemented

#### Implementation Details

**Supabase Client Abstraction**:
```typescript
// packages/shared/supabase/client.ts
let supabaseClient: SupabaseClient<Database> | null = null;

export function initSupabase(url: string, anonKey: string) {
  if (!supabaseClient) {
    supabaseClient = createClient<Database>(url, anonKey);
  }
  return supabaseClient;
}

export function getSupabaseClient(): SupabaseClient<Database> {
  if (!supabaseClient) {
    throw new Error("Supabase not initialized");
  }
  return supabaseClient;
}
```

**Shared Exports**:
```typescript
// packages/shared/index.ts
export { initSupabase, getSupabaseClient } from "./supabase/client";
export { useInfiniteFilteredImages, useImageById } from "./hooks/useImages";
export { useFilterStore } from "./stores/filterStore";
export { useSearchStore } from "./stores/searchStore";
```

#### Files Created
- `packages/shared/package.json`
- `packages/shared/supabase/client.ts`
- `packages/shared/supabase/queries/images.ts`
- `packages/shared/hooks/useImages.ts`
- `packages/shared/stores/filterStore.ts`
- `packages/shared/index.ts`

---

### M-02 Expo Project Setup

- **Description**: Expo SDK 54 기반 모바일 앱 초기 설정
- **Priority**: P0 (Foundation)
- **Status**: ✅ Implemented

#### Technical Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Expo SDK | 54.0.31 |
| Routing | Expo Router | 6.0.21 |
| UI | React Native | 0.81.5 |
| Animation | Reanimated | 4.1.1 |
| State (Server) | React Query | 5.90.11 |
| State (Client) | Zustand | 4.5.7 |
| API | Supabase JS | 2.86.0 |

#### Configuration

**app.json**:
```json
{
  "expo": {
    "name": "Decoded",
    "slug": "decoded-app",
    "scheme": "decoded",
    "ios": {
      "bundleIdentifier": "com.decoded.app"
    },
    "android": {
      "package": "com.decoded.app"
    },
    "plugins": ["expo-router"]
  }
}
```

**Environment Variables** (`.env`):
```bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

#### Files Created
- `packages/mobile/package.json`
- `packages/mobile/app.json`
- `packages/mobile/app/_layout.tsx`
- `packages/mobile/providers/SupabaseProvider.tsx`
- `packages/mobile/providers/QueryProvider.tsx`

---

### M-03 Home Screen (Image Grid)

- **Description**: FlatList 기반 이미지 그리드 (무한 스크롤)
- **Priority**: P0
- **Status**: ✅ Implemented

#### Acceptance Criteria
- [x] 2열 그리드 레이아웃
- [x] 무한 스크롤 (onEndReached)
- [x] 로딩/빈 상태 UI
- [x] 이미지 탭 시 상세 페이지 이동
- [ ] 필터 탭 UI
- [ ] 검색 기능

#### Implementation

```typescript
// packages/mobile/app/(tabs)/index.tsx
export default function HomeScreen() {
  const { activeFilter } = useFilterStore();
  const { data, fetchNextPage, hasNextPage } = useInfiniteFilteredImages({
    limit: 40,
    filter: activeFilter,
    deduplicateByImageId: true,
  });

  const items = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <FlatList
      data={items}
      numColumns={2}
      renderItem={({ item }) => (
        <Link href={`/images/${item.id}`} asChild>
          <Pressable>
            <Image source={{ uri: item.image_url }} />
          </Pressable>
        </Link>
      )}
      onEndReached={() => hasNextPage && fetchNextPage()}
      onEndReachedThreshold={0.5}
    />
  );
}
```

---

### M-04 Image Detail Screen

- **Description**: 이미지 상세 정보 및 아이템 목록
- **Priority**: P0
- **Status**: ✅ Implemented (Basic)

#### Acceptance Criteria
- [x] 이미지 히어로 섹션
- [x] 계정 정보 표시
- [x] 아이템 목록 (브랜드, 제품명, 가격)
- [ ] 핀 인터랙션
- [ ] 구매 링크 연동
- [ ] 공유 기능

#### Implementation

```typescript
// packages/mobile/app/images/[id].tsx
export default function ImageDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: image } = useImageById(id ?? "");

  return (
    <ScrollView>
      <Image source={{ uri: image.image_url }} />
      <Text>@{image.postImages?.[0]?.post?.account}</Text>
      {image.items.map((item) => (
        <View key={item.id}>
          <Text>{item.product_name}</Text>
          <Text>{item.brand}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
```

---

### M-05 Push Notifications

- **Description**: 푸시 알림 등록 및 수신
- **Priority**: P1
- **Status**: 🚧 Pending (Package not installed)

#### Acceptance Criteria
- [ ] 권한 요청 UI
- [ ] Expo Push Token 등록
- [ ] 알림 수신 핸들러
- [ ] 알림 탭 시 딥링크 처리

#### Technical Specification

**Dependencies** (추가 예정):
```json
{
  "expo-notifications": "~0.29.x",
  "expo-device": "~7.0.x"
}
```

**Implementation** (예정):
```typescript
// packages/mobile/utils/notifications.ts
export async function registerPushToken(): Promise<string | null> {
  if (!Device.isDevice) return null;

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") return null;

  const token = await Notifications.getExpoPushTokenAsync();
  return token.data;
}
```

#### Files to Create
- `packages/mobile/utils/notifications.ts`
- Server-side: `app/api/push/register/route.ts`

---

### M-06 Camera/Gallery Integration

- **Description**: 이미지 촬영 및 갤러리 선택
- **Priority**: P1
- **Status**: 🚧 Pending (Package not installed)

#### Acceptance Criteria
- [ ] 갤러리에서 이미지 선택
- [ ] 카메라로 사진 촬영
- [ ] 이미지 크롭/편집
- [ ] 업로드 전 미리보기

#### Technical Specification

**Dependencies** (추가 예정):
```json
{
  "expo-image-picker": "~16.0.x"
}
```

**Implementation** (예정):
```typescript
// packages/mobile/utils/imagePicker.ts
export async function pickImage(): Promise<PickedImage | null> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.8,
  });

  if (result.canceled) return null;
  return result.assets[0];
}
```

#### Files to Create
- `packages/mobile/utils/imagePicker.ts`
- `packages/mobile/components/ImageUploader.tsx`

---

## Development Commands

```bash
# 루트에서 웹 개발 서버
yarn dev

# 모바일 개발 서버
cd packages/mobile
npx expo start

# iOS 시뮬레이터
npx expo start --ios

# Android 에뮬레이터
npx expo start --android

# 웹 빌드 확인
yarn build

# EAS 빌드 (프로덕션)
cd packages/mobile
eas build --platform ios
eas build --platform android
```

---

## Migration Notes

### Web App Compatibility

기존 웹 앱의 import 경로는 re-export를 통해 하위 호환성을 유지합니다:

```typescript
// packages/web/lib/hooks/useImages.ts
export {
  useInfiniteFilteredImages,
  useImageById,
} from "@decoded/shared";
```

### SSR vs CSR

| 플랫폼 | 렌더링 | 초기 데이터 |
|--------|--------|-------------|
| Web | SSR + Hydration | `initialImages` prop |
| Mobile | CSR Only | React Query fetching |

웹은 SSR을 유지하고, 모바일은 React Query의 클라이언트 사이드 페칭을 사용합니다.

---

## Roadmap

### Phase 1: Foundation ✅
- [x] 모노레포 설정 (Yarn workspaces)
- [x] 공유 코드 분리 (@decoded/shared)
- [x] Expo 프로젝트 초기화
- [x] 홈 화면 (이미지 그리드)
- [x] 상세 화면 (기본)

### Phase 2: Core Features
- [ ] 필터/검색 UI
- [ ] 핀 인터랙션
- [ ] 구매 링크 연동

### Phase 3: Native Features
- [ ] 푸시 알림 (expo-notifications)
- [ ] 카메라/갤러리 (expo-image-picker)
- [ ] 오프라인 지원 (AsyncStorage + RQ persist)

### Phase 4: Production
- [ ] EAS Build 설정
- [ ] App Store / Play Store 제출
- [ ] 성능 최적화 (FlatList, Image caching)

---

## Related Documentation

- [Expo Router Docs](https://docs.expo.dev/router/)
- [React Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://zustand.docs.pmnd.rs/)
- Plan file: `/Users/kiyeol/.claude/plans/mellow-coalescing-eclipse.md`
