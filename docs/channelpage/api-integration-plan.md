# 채널 기능 API 통합 계획

## 📋 개요

현재 채널 페이지에서 하드코딩된 데이터들을 실제 API 데이터로 교체하는 계획입니다.

## 🔍 현재 하드코딩된 데이터 분석

### 1. 메인 채널 목록 (MasonryGrid)

- **위치**: `src/domains/channels/utils/masonryUtils.ts`
- **데이터**: 36개의 Mock 채널 아이템
- **API**: `ChannelsService.listChannelsChannelsGet()`
- **우선순위**: 🔴 **최우선**

### 2. 채널 모달 콘텐츠

- **위치**: `src/domains/channels/components/modal/channel/ChannelModalContent.tsx`
- **데이터**: 25개의 Mock 콘텐츠 아이템
- **API**: `ContentsService.listContentsContentsGet()`
- **우선순위**: 🟡 **높음**

### 3. 채널 모달 기여자

- **위치**: `src/domains/channels/components/modal/channel/ChannelModalContributors.tsx`
- **데이터**: 8명의 Mock 기여자
- **API**: `UsersService.listUsersUsersGet()` 또는 채널별 기여자 API
- **우선순위**: 🟡 **높음**

### 4. 채널 모달 관련 채널

- **위치**: `src/domains/channels/components/modal/channel/ChannelModalRelated.tsx`
- **데이터**: 6개의 Mock 관련 채널
- **API**: `ChannelsService.listChannelsChannelsGet()` (카테고리별)
- **우선순위**: 🟢 **중간**

### 5. 사이드바 필터 데이터

- **위치**: `src/domains/channels/components/sidebar/ChannelSidebar.tsx`
- **데이터**: DATA_TYPES, CATEGORIES 하드코딩
- **API**: 시스템 설정 API 또는 정적 데이터
- **우선순위**: 🟢 **중간**

### 6. 히어로 섹션 데이터

- **위치**: `src/domains/channels/components/hero/heroData.ts`
- **데이터**: 25명의 Mock 아티스트 데이터
- **API**: 추천 채널 API 또는 인기 채널 API
- **우선순위**: 🟢 **중간**

## 📊 API 타입 분석 및 매핑

### 1. 채널 관련 타입

#### API 타입 (generated)

```typescript
// ChannelResponse
{
  id: string;
  name: string;
  description?: string | null;
  owner_id: string;
  thumbnail_url?: string | null;
  subscriber_count?: number;
  content_count?: number;
  created_at?: string;
  updated_at?: string | null;
  is_subscribed?: boolean;
}

// ChannelListResponse
{
  channels: Array<ChannelResponse>;
  total_count?: number;
  has_more?: boolean;
}
```

#### 현재 사용 타입 (MasonryItem)

```typescript
{
  title: string;
  imageUrl?: string;
  category: string;
  editors: Array<{ name: string; avatarUrl: string }>;
  date: string;
  isNew: boolean;
  isHot: boolean;
}
```

#### 타입 매핑 전략

```typescript
// ChannelResponse → MasonryItem 변환 함수
const mapChannelToMasonryItem = (channel: ChannelResponse): MasonryItem => ({
  title: channel.name,
  imageUrl: channel.thumbnail_url || undefined,
  category: 'default', // API에서 카테고리 정보가 없음 - 추가 필요
  editors: [], // API에서 기여자 정보가 없음 - 별도 API 필요
  date: channel.created_at || new Date().toISOString(),
  isNew: false, // 로직 필요
  isHot: false, // 로직 필요
});
```

### 2. 콘텐츠 관련 타입

#### API 타입

```typescript
// ContentListResponse
{
  contents: Array<Record<string, any>>; // 타입이 너무 일반적
  next_id?: string | null;
  total_count?: number | null;
}

// 개별 콘텐츠 타입들
- ImageContentResponse
- LinkContentResponse
- VideoContentResponse
```

#### 개선 필요사항

- `ContentListResponse.contents`가 `Record<string, any>`로 되어 있어 타입 안전성 부족
- 콘텐츠 타입별 구분 로직 필요

### 3. 사용자 관련 타입

#### API 타입

```typescript
// UserListResponse
{
  id: string;
  email?: string | null;
  role: UserRole;
  is_banned?: boolean;
  registration_date: string;
  last_login?: string | null;
  total_content?: number;
  total_reports_received?: number;
}

// UserRole
enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}
```

#### 현재 사용 타입

```typescript
// Editor
{
  name: string;
  avatarUrl?: string;
}
```

#### 타입 매핑 전략

```typescript
// UserListResponse → Editor 변환 함수
const mapUserToEditor = (user: UserListResponse): Editor => ({
  name: user.email?.split('@')[0] || user.id, // 임시 이름 생성
  avatarUrl: undefined, // API에서 아바타 정보가 없음
});
```

## 🎯 API 통합 우선순위

### Phase 1: 핵심 기능 (최우선)

1. **채널 목록 API 통합**

   - MasonryGrid에서 실제 채널 데이터 사용
   - 페이지네이션 구현
   - 검색 기능 구현

2. **채널 상세 정보 API 통합**
   - 채널 모달에서 실제 채널 정보 표시
   - 구독자 수, 콘텐츠 수 등 실시간 데이터

### Phase 2: 콘텐츠 기능 (높음)

3. **채널 콘텐츠 API 통합**

   - 채널별 콘텐츠 목록 표시
   - 콘텐츠 타입별 필터링
   - 콘텐츠 상세 정보 표시

4. **기여자 정보 API 통합**
   - 채널별 기여자 목록
   - 기여자 역할 및 프로필 정보

### Phase 3: 부가 기능 (중간)

5. **관련 채널 API 통합**

   - 유사한 채널 추천
   - 카테고리별 관련 채널

6. **필터 데이터 API 통합**
   - 카테고리 목록
   - 데이터 타입 목록
   - 태그 시스템

## 📊 API 엔드포인트 매핑

### 현재 사용 가능한 API들

#### ChannelsService

- ✅ `listChannelsChannelsGet()` - 채널 목록
- ✅ `getChannelChannelsChannelIdGet()` - 채널 상세
- ✅ `createChannelChannelsPost()` - 채널 생성
- ✅ `updateChannelChannelsChannelIdPut()` - 채널 수정
- ✅ `deleteChannelChannelsChannelIdDelete()` - 채널 삭제
- ✅ `updateThumbnailChannelsChannelIdThumbnailPatch()` - 썸네일 업데이트
- ✅ `addManagersChannelsChannelIdManagersPost()` - 매니저 추가
- ✅ `removeManagersChannelsChannelIdManagersDelete()` - 매니저 제거

#### ContentsService

- ✅ `listContentsContentsGet()` - 콘텐츠 목록
- ✅ `getContentContentsContentIdGet()` - 콘텐츠 상세
- ✅ `createContentContentsPost()` - 콘텐츠 생성
- ✅ `updateContentContentsContentIdPut()` - 콘텐츠 수정
- ✅ `deleteContentContentsContentIdDelete()` - 콘텐츠 삭제

#### UsersService

- ✅ `listUsersUsersGet()` - 사용자 목록
- ✅ `getUserUsersUserIdGet()` - 사용자 상세
- ✅ `updateUserUsersUserIdPut()` - 사용자 정보 수정

#### InteractionsService

- ✅ `listLikesLikesGet()` - 좋아요 목록
- ✅ `createLikeLikesPost()` - 좋아요 생성
- ✅ `deleteLikeLikesLikeIdDelete()` - 좋아요 삭제

## 🛠️ 구현 계획

### Step 1: 채널 목록 API 통합 ✅ **완료**

**파일**: `src/domains/channels/components/category-grid/MasonryGrid.tsx`

```typescript
// 현재
const items = MOCK_ITEMS;

// 변경 후
const {
  data: channelsData,
  isLoading,
  error,
} = useChannels({
  page: 1,
  limit: 50,
  sortBy: 'created_at',
  sortOrder: 'desc',
});

// API 데이터와 기존 레이아웃 요소들을 조합
const items = useMemo(() => {
  if (isLoading || error || !channelsData?.channels) {
    return insertEmptyItems(insertSpecialCards(distributeNoImageCards(getMockItems()), 8), 6);
  }
  const apiItems = mapChannelsToMasonryItems(channelsData.channels);
  const itemsWithSpecialCards = insertSpecialCards(distributeNoImageCards(apiItems), 8);
  return insertEmptyItems(itemsWithSpecialCards, 6);
}, [channelsData, isLoading, error]);
```

**주요 변경사항**:

- ✅ API 데이터를 MasonryItem으로 변환
- ✅ 기존 레이아웃 (특수 카드, 빈 아이템) 유지
- ✅ 로딩 상태 및 에러 처리
- ✅ 채널 ID를 통한 상세 조회 연결

### Step 2: 채널 상세 정보 API 통합 ✅ **완료**

**파일**: `src/domains/channels/components/modal/channel/ChannelModal.tsx`

```typescript
// 현재
const channel = useChannelModalStore(selectSelectedChannel);

// 변경 후
const { data: apiChannel, isLoading, error } = useChannel(channelId);
const finalChannel = useMemo(() => {
  if (apiChannel) {
    return {
      name: apiChannel.name,
      img: apiChannel.thumbnail_url,
      description: apiChannel.description || '채널 설명이 없습니다.',
      category: 'default',
      followers: apiChannel.subscriber_count?.toLocaleString() || '0',
    };
  }
  return channel;
}, [apiChannel, channel]);
```

**주요 변경사항**:

- ✅ 채널 ID로 API 데이터 조회 기능 추가
- ✅ 로딩 상태 및 에러 처리 구현
- ✅ API 데이터와 기존 데이터 fallback 로직
- ✅ 테스트용 컴포넌트 추가

### Step 3: 채널 콘텐츠 API 통합

**파일**: `src/domains/channels/components/modal/channel/ChannelModalContent.tsx`

```typescript
// 현재
const contentItems: ContentItem[] = [
  /* 하드코딩된 데이터 */
];

// 변경 후
const { data: contents, isLoading } = useContents({
  channelId: channelId,
  page: 1,
  limit: 25,
});
```

### Step 4: 기여자 정보 API 통합

**파일**: `src/domains/channels/components/modal/channel/ChannelModalContributors.tsx`

```typescript
// 현재
const contributors: Contributor[] = [
  /* 하드코딩된 데이터 */
];

// 변경 후
const { data: contributors, isLoading } = useChannelContributors(channelId);
```

## 🔧 필요한 새로운 Hook들

### 1. useChannelContributors

```typescript
export const useChannelContributors = (channelId: string) => {
  return useQuery({
    queryKey: queryKeys.channels.contributors(channelId),
    queryFn: () => ChannelsService.getChannelContributors(channelId),
    enabled: !!channelId,
  });
};
```

### 2. useChannelContents

```typescript
export const useChannelContents = (
  channelId: string,
  params?: {
    page?: number;
    limit?: number;
    contentType?: string;
  },
) => {
  return useQuery({
    queryKey: queryKeys.contents.channel(channelId, params),
    queryFn: () =>
      ContentsService.listContentsContentsGet(
        params?.page,
        params?.limit,
        undefined,
        channelId,
        params?.contentType,
      ),
    enabled: !!channelId,
  });
};
```

### 3. useRelatedChannels

```typescript
export const useRelatedChannels = (channelId: string, category?: string) => {
  return useQuery({
    queryKey: queryKeys.channels.related(channelId, category),
    queryFn: () =>
      ChannelsService.listChannelsChannelsGet(1, 6, undefined, undefined, 'created_at', 'desc'),
    enabled: !!channelId,
  });
};
```

## 📈 성능 최적화 고려사항

### 1. 캐싱 전략

- 채널 목록: 5분 stale time
- 채널 상세: 10분 stale time
- 콘텐츠 목록: 3분 stale time
- 기여자 정보: 15분 stale time

### 2. 페이지네이션

- 무한 스크롤 또는 "더 보기" 버튼
- 페이지당 20개 아이템
- 가상 스크롤링 고려

### 3. 로딩 상태

- 스켈레톤 UI 구현
- 로딩 스피너
- 에러 상태 처리

## 🧪 테스트 계획

### 1. 단위 테스트

- API Hook 테스트
- 컴포넌트 렌더링 테스트
- 에러 처리 테스트

### 2. 통합 테스트

- API 통합 테스트
- 사용자 플로우 테스트
- 성능 테스트

### 3. E2E 테스트

- 채널 목록 조회
- 채널 상세 보기
- 채널 생성 및 수정

## 📅 구현 일정

### Week 1: Phase 1

- 채널 목록 API 통합
- 채널 상세 정보 API 통합
- 기본 에러 처리 및 로딩 상태

### Week 2: Phase 2

- 채널 콘텐츠 API 통합
- 기여자 정보 API 통합
- 필터링 기능 구현

### Week 3: Phase 3

- 관련 채널 API 통합
- 필터 데이터 API 통합
- 성능 최적화

### Week 4: 테스트 및 정리

- 테스트 작성
- 버그 수정
- 문서 업데이트

## 🚀 다음 단계

1. **Phase 1부터 시작**: 채널 목록 API 통합
2. **점진적 구현**: 한 번에 모든 것을 바꾸지 말고 단계별로 진행
3. **테스트 우선**: 각 단계마다 충분한 테스트 진행
4. **사용자 피드백**: 실제 사용자에게 테스트하여 피드백 수집

이 계획을 따라가면 하드코딩된 데이터들을 체계적으로 실제 API 데이터로 교체할 수 있습니다.
