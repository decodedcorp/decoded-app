# User System

> Features: U-01 ~ U-05
> Status: 0% implemented
> Dependencies: Supabase Auth

---

## Overview

The User System handles authentication, profiles, and user-related features. It enables personalized experiences, contribution tracking, and the gamification/reward system.

### Related Screens
- `/login` - Login page
- `/profile` - User profile dashboard
- `/profile/settings` - Settings page
- `/profile/activity` - Activity history
- `/profile/earnings` - Earnings dashboard

### Dependencies
- Supabase Auth (already configured)
- `@supabase/auth-helpers-nextjs` (installed)

---

## Features

### U-01 Social Login

- **Description**: Allow users to sign in using Kakao, Google, or Apple accounts
- **Priority**: P0
- **Status**: Not Started
- **Dependencies**: None

#### Acceptance Criteria
- [ ] User can click "Login with Kakao" and complete OAuth flow
- [ ] User can click "Login with Google" and complete OAuth flow
- [ ] User can click "Login with Apple" and complete OAuth flow
- [ ] New users are automatically registered on first login
- [ ] Returning users are recognized and signed in
- [ ] User session persists across page refreshes
- [ ] User can log out from any page

#### UI/UX Requirements
- **Login Page Layout**:
  ```
  ┌─────────────────────────────┐
  │        [Logo]               │
  │                             │
  │   Welcome to Decoded        │
  │                             │
  │  ┌─────────────────────┐   │
  │  │ 🟡 Login with Kakao │   │
  │  └─────────────────────┘   │
  │  ┌─────────────────────┐   │
  │  │ 🔵 Login with Google│   │
  │  └─────────────────────┘   │
  │  ┌─────────────────────┐   │
  │  │ ⚫ Login with Apple │   │
  │  └─────────────────────┘   │
  │                             │
  │   By continuing, you agree  │
  │   to our Terms & Privacy    │
  └─────────────────────────────┘
  ```
- Kakao button: Yellow (#FEE500) background
- Google button: White background with Google colors
- Apple button: Black background

#### Data Requirements
- Supabase Auth configuration for each provider
- OAuth redirect URLs configured
- User profile auto-creation trigger

#### Implementation Notes
```typescript
// lib/supabase/auth.ts
export async function signInWithKakao() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
  return { data, error };
}

// app/auth/callback/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  // Exchange code for session
}
```

#### Files to Create/Modify
- `app/login/page.tsx` - Login page
- `app/auth/callback/route.ts` - OAuth callback handler
- `lib/supabase/auth.ts` - Auth helper functions
- `lib/components/auth/LoginButton.tsx` - Social login buttons

---

### U-02 Multi-language Settings

- **Description**: Support Korean and English UI throughout the app
- **Priority**: P1
- **Status**: Not Started
- **Dependencies**: U-01 (for preference persistence)

#### Acceptance Criteria
- [ ] User can switch between Korean and English
- [ ] Language preference persists across sessions
- [ ] All UI text respects language setting
- [ ] Date/number formats adapt to locale
- [ ] Guest users can change language (stored in localStorage)
- [ ] Logged-in users have preference saved to profile

#### UI/UX Requirements
- Language toggle in header (simple dropdown or icon toggle)
- Settings page has explicit language selection
- Language codes: `ko` (Korean), `en` (English)

#### Data Requirements
- Translation files for all UI strings
- User preference field: `preferred_language`

#### Implementation Notes
```typescript
// lib/i18n/index.ts
export const translations = {
  ko: {
    'nav.home': '홈',
    'nav.search': '검색',
    'detail.buy': '구매하기',
    // ...
  },
  en: {
    'nav.home': 'Home',
    'nav.search': 'Search',
    'detail.buy': 'Buy Now',
    // ...
  }
};

// lib/hooks/useTranslation.ts
export function useTranslation() {
  const locale = useLocale();
  return (key: string) => translations[locale][key] || key;
}
```

#### Files to Create/Modify
- `lib/i18n/translations/ko.json`
- `lib/i18n/translations/en.json`
- `lib/i18n/index.ts`
- `lib/hooks/useTranslation.ts`
- `lib/components/LanguageToggle.tsx`

---

### U-03 Profile Dashboard

- **Description**: Display user's ranking, earnings, and fandom badges
- **Priority**: P0
- **Status**: Not Started
- **Dependencies**: U-01, S-07 (Badge System), S-08 (Ranking)

#### Acceptance Criteria
- [ ] Display user avatar and display name
- [ ] Show total contributions count
- [ ] Show acceptance rate
- [ ] Display earned badges with visual icons
- [ ] Show current ranking (global and per-fandom)
- [ ] Display earnings summary
- [ ] Link to detailed activity history
- [ ] Link to settings page

#### UI/UX Requirements
- **Profile Page Layout**:
  ```
  ┌─────────────────────────────────────────┐
  │  [Avatar]  Display Name                 │
  │            @username                    │
  │            "Bio text here..."           │
  │                                         │
  │  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
  │  │   127   │ │  89%    │ │ ₩45,000 │   │
  │  │ Posts   │ │Accepted │ │Earnings │   │
  │  └─────────┘ └─────────┘ └─────────┘   │
  │                                         │
  │  🏆 Badges                              │
  │  ┌─────┐ ┌─────┐ ┌─────┐              │
  │  │ IVE │ │BTS  │ │+3   │              │
  │  │Expert│ │Fan  │ │more │              │
  │  └─────┘ └─────┘ └─────┘              │
  │                                         │
  │  📊 Rankings                            │
  │  • Global: #42                          │
  │  • IVE: #3 this week                   │
  │  • BLACKPINK: #12 this month           │
  │                                         │
  │  [View All Activity] [Settings]         │
  └─────────────────────────────────────────┘
  ```

#### Data Requirements
- User profile data
- Badge assignments
- Ranking data (current period)
- Earnings summary

#### API Endpoints
```
GET /api/profile
GET /api/profile/badges
GET /api/profile/rankings
GET /api/profile/earnings/summary
```

#### Files to Create/Modify
- `app/profile/page.tsx`
- `lib/components/profile/ProfileHeader.tsx`
- `lib/components/profile/StatsCards.tsx`
- `lib/components/profile/BadgeGrid.tsx`
- `lib/components/profile/RankingList.tsx`
- `lib/hooks/useProfile.ts`

---

### U-04 Activity History

- **Description**: View user's posts, answers, and favorited items
- **Priority**: P1
- **Status**: Not Started
- **Dependencies**: U-01, U-03

#### Acceptance Criteria
- [ ] Tab view: "My Posts" | "My Answers" | "Favorites"
- [ ] Each tab shows paginated list
- [ ] Posts show thumbnail, title, date, status
- [ ] Answers show related post, vote count
- [ ] Favorites show item/post with quick actions
- [ ] Can remove items from favorites
- [ ] Can delete own posts (with confirmation)

#### UI/UX Requirements
- **Activity Page Layout**:
  ```
  ┌─────────────────────────────────────────┐
  │  [My Posts] [My Answers] [Favorites]    │
  ├─────────────────────────────────────────┤
  │  ┌─────────────────────────────────┐   │
  │  │ [Thumb] Post Title              │   │
  │  │         Jan 5, 2026 • Published │   │
  │  │         15 views • 3 comments   │   │
  │  └─────────────────────────────────┘   │
  │  ┌─────────────────────────────────┐   │
  │  │ [Thumb] Post Title              │   │
  │  │         Jan 3, 2026 • Draft     │   │
  │  │         [Edit] [Delete]         │   │
  │  └─────────────────────────────────┘   │
  │                                         │
  │  [Load More]                           │
  └─────────────────────────────────────────┘
  ```

#### Data Requirements
- User's posts with status
- User's item identifications (answers)
- User's favorites (polymorphic)

#### API Endpoints
```
GET /api/profile/posts?page=1&limit=20
GET /api/profile/answers?page=1&limit=20
GET /api/profile/favorites?page=1&limit=20
DELETE /api/profile/posts/:id
DELETE /api/profile/favorites/:id
```

#### Files to Create/Modify
- `app/profile/activity/page.tsx`
- `lib/components/profile/ActivityTabs.tsx`
- `lib/components/profile/PostList.tsx`
- `lib/components/profile/AnswerList.tsx`
- `lib/components/profile/FavoriteList.tsx`

---

### U-05 Withdrawal Request

- **Description**: Request payout of accumulated earnings
- **Priority**: P2
- **Status**: Not Started
- **Dependencies**: U-01, S-05 (Click Tracker), S-06 (Reward Batch)

#### Acceptance Criteria
- [ ] Display available balance
- [ ] Show pending/processing amounts separately
- [ ] Minimum withdrawal amount enforced (e.g., ₩10,000)
- [ ] Bank account or PayPal input
- [ ] Confirmation step before submission
- [ ] View withdrawal history
- [ ] Status tracking (pending → processing → completed)

#### UI/UX Requirements
- **Earnings Page Layout**:
  ```
  ┌─────────────────────────────────────────┐
  │  💰 My Earnings                         │
  │                                         │
  │  Available Balance                      │
  │  ₩ 45,320                              │
  │                                         │
  │  Pending: ₩12,000 (Jan clicks)         │
  │  Processing: ₩0                         │
  │                                         │
  │  [Request Withdrawal]                   │
  │                                         │
  │  ─────────────────────────────────────  │
  │  📋 Withdrawal History                  │
  │                                         │
  │  ₩30,000 • Completed • Dec 15, 2025    │
  │  ₩25,000 • Completed • Nov 15, 2025    │
  └─────────────────────────────────────────┘
  ```

#### Data Requirements
- Current balance calculation
- Pending rewards (not yet confirmed)
- Withdrawal request history
- Payment method storage

#### API Endpoints
```
GET /api/profile/earnings
GET /api/profile/earnings/history
POST /api/profile/earnings/withdraw
GET /api/profile/withdrawals
```

#### Business Rules
- Minimum withdrawal: ₩10,000
- Processing time: 5-7 business days
- Payment methods: Korean bank transfer, PayPal
- Tax withholding may apply (display notice)

#### Files to Create/Modify
- `app/profile/earnings/page.tsx`
- `lib/components/profile/EarningsCard.tsx`
- `lib/components/profile/WithdrawalForm.tsx`
- `lib/components/profile/WithdrawalHistory.tsx`

---

## Data Models

See [data-models.md](./data-models.md) for full type definitions.

### Key Types for User System

```typescript
interface User {
  id: string;
  email?: string;
  authProvider: 'kakao' | 'google' | 'apple';
  displayName: string;
  avatarUrl?: string;
  preferredLanguage: 'ko' | 'en';
  totalContributions: number;
  totalAccepted: number;
  totalEarnings: number;
}

interface UserBadge {
  userId: string;
  badgeId: string;
  earnedAt: Date;
}

interface WithdrawalRequest {
  userId: string;
  amount: number;
  paymentMethod: 'bank_transfer' | 'paypal';
  status: 'pending' | 'processing' | 'completed' | 'rejected';
}
```

---

## Migration Path

### Phase 1: Basic Auth
1. Configure Supabase OAuth providers
2. Create login page with social buttons
3. Implement callback handler
4. Add auth context provider

### Phase 2: Profile
1. Create user profile table trigger
2. Build profile dashboard UI
3. Add settings page

### Phase 3: Activity & Earnings
1. Implement activity tracking
2. Build earnings dashboard
3. Add withdrawal flow

---

## Security Considerations

- OAuth tokens must not be exposed to client
- Sensitive user data encrypted at rest
- Rate limiting on auth endpoints
- CSRF protection on forms
- Withdrawal requires email verification

---

## Component Mapping (상세 구현 참조)

> 이 섹션은 인증 플로우와 각 UI 요소가 실제 코드에서 어떻게 구현되는지 매핑합니다.

### OAuth 인증 플로우 상세

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         OAUTH AUTHENTICATION FLOW                            │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  [1. 로그인 시작]                                                            │
│       │                                                                      │
│       ▼                                                                      │
│  사용자가 /login 페이지 방문                                                 │
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ LoginPage.tsx (app/login/page.tsx)                                      ││
│  │                                                                          ││
│  │  ┌────────────────────────────────────────────────────────────────────┐ ││
│  │  │       [DECODED Logo]                                               │ ││
│  │  │                                                                     │ ││
│  │  │       Welcome to Decoded                                           │ ││
│  │  │       Discover what they're wearing                                │ ││
│  │  │                                                                     │ ││
│  │  │  ┌────────────────────────────────────────────────────────────┐   │ ││
│  │  │  │ LoginButton.tsx (provider="kakao")                         │   │ ││
│  │  │  │                                                             │   │ ││
│  │  │  │ 🟡  카카오로 로그인                                         │   │ ││
│  │  │  │                                                             │   │ ││
│  │  │  │ onClick → signInWithKakao()                                │   │ ││
│  │  │  └────────────────────────────────────────────────────────────┘   │ ││
│  │  │                                                                     │ ││
│  │  │  ┌────────────────────────────────────────────────────────────┐   │ ││
│  │  │  │ LoginButton.tsx (provider="google")                        │   │ ││
│  │  │  │                                                             │   │ ││
│  │  │  │ 🔵  Continue with Google                                   │   │ ││
│  │  │  │                                                             │   │ ││
│  │  │  │ onClick → signInWithGoogle()                               │   │ ││
│  │  │  └────────────────────────────────────────────────────────────┘   │ ││
│  │  │                                                                     │ ││
│  │  │  ┌────────────────────────────────────────────────────────────┐   │ ││
│  │  │  │ LoginButton.tsx (provider="apple")                         │   │ ││
│  │  │  │                                                             │   │ ││
│  │  │  │ ⚫  Sign in with Apple                                     │   │ ││
│  │  │  │                                                             │   │ ││
│  │  │  │ onClick → signInWithApple()                                │   │ ││
│  │  │  └────────────────────────────────────────────────────────────┘   │ ││
│  │  │                                                                     │ ││
│  │  │       By continuing, you agree to our                              │ ││
│  │  │       Terms of Service and Privacy Policy                          │ ││
│  │  │                                                                     │ ││
│  │  └────────────────────────────────────────────────────────────────────┘ ││
│  │                                                                          ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│       │                                                                      │
│       │ 사용자가 LoginButton 클릭                                            │
│       │                                                                      │
│       ▼                                                                      │
│  [2. OAuth 리다이렉트]                                                       │
│       │                                                                      │
│       ├─── supabase.auth.signInWithOAuth({                                  │
│       │      provider: 'kakao' | 'google' | 'apple',                        │
│       │      options: {                                                      │
│       │        redirectTo: `${origin}/auth/callback`,                       │
│       │        scopes: 'profile email'  // provider별 상이                  │
│       │      }                                                               │
│       │    })                                                                │
│       │         │                                                            │
│       │         ▼                                                            │
│       │    Supabase가 OAuth Provider URL 생성                               │
│       │         │                                                            │
│       │         ▼                                                            │
│       │    브라우저가 Provider 로그인 페이지로 리다이렉트                    │
│       │    (카카오/구글/애플 로그인 UI)                                      │
│       │                                                                      │
│       ▼                                                                      │
│  [3. Provider 인증]                                                          │
│       │                                                                      │
│       ├─── 사용자가 Provider에서 로그인/인증 승인                           │
│       │         │                                                            │
│       │         ▼                                                            │
│       │    Provider가 authorization code와 함께                             │
│       │    /auth/callback으로 리다이렉트                                    │
│       │                                                                      │
│       ▼                                                                      │
│  [4. Callback 처리]                                                          │
│       │                                                                      │
│       ├─── app/auth/callback/route.ts                                       │
│       │         │                                                            │
│       │         ▼                                                            │
│       │    const { searchParams } = new URL(request.url)                    │
│       │    const code = searchParams.get('code')                            │
│       │         │                                                            │
│       │         ▼                                                            │
│       │    supabase.auth.exchangeCodeForSession(code)                       │
│       │         │                                                            │
│       │    ┌────┴────────────────────────────────────────┐                  │
│       │    ▼                                              ▼                  │
│       │  Success                                       Error                 │
│       │    │                                              │                  │
│       │    │                                              └─── redirect to  │
│       │    │                                                   /login?error │
│       │    ▼                                                                │
│       │  세션 쿠키 설정                                                     │
│       │    │                                                                │
│       │    ├─── 신규 사용자?                                                │
│       │    │         │                                                      │
│       │    │    YES  ▼                                                      │
│       │    │    DB Trigger: handle_new_user()                               │
│       │    │    → user_profile 테이블에 레코드 생성                         │
│       │    │    → 기본값: display_name = email.split('@')[0]               │
│       │    │              avatar_url = provider avatar                      │
│       │    │              preferred_language = 'ko'                         │
│       │    │                                                                │
│       │    ▼                                                                │
│       │  redirect to /                                                      │
│       │  (또는 redirect_after 파라미터가 있으면 해당 URL)                   │
│       │                                                                      │
│       ▼                                                                      │
│  [5. 세션 유지]                                                              │
│       │                                                                      │
│       ├─── AuthProvider.tsx (전역 컨텍스트)                                 │
│       │         │                                                            │
│       │         ├─── useEffect: supabase.auth.onAuthStateChange()          │
│       │         │    세션 변경 감지                                          │
│       │         │                                                            │
│       │         ├─── user 상태 관리                                         │
│       │         │    { user: User | null, isLoading: boolean }              │
│       │         │                                                            │
│       │         └─── 세션 자동 갱신 (refresh token)                         │
│       │                                                                      │
│       ▼                                                                      │
│  [6. 로그아웃]                                                               │
│       │                                                                      │
│       ├─── 사용자가 로그아웃 버튼 클릭                                      │
│       │         │                                                            │
│       │         ▼                                                            │
│       │    supabase.auth.signOut()                                          │
│       │         │                                                            │
│       │         ▼                                                            │
│       │    세션 쿠키 삭제                                                    │
│       │         │                                                            │
│       │         ▼                                                            │
│       │    onAuthStateChange 콜백에서 user = null                           │
│       │         │                                                            │
│       │         ▼                                                            │
│       │    redirect to /                                                    │
│       │                                                                      │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Supabase Auth 설정 상세

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         SUPABASE AUTH CONFIGURATION                          │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Dashboard: Authentication > Providers                                       │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ KAKAO                                                          [✓ ON]   ││
│  │                                                                          ││
│  │ Client ID:     [Kakao REST API Key]                                     ││
│  │ Client Secret: [Kakao REST API Secret]                                  ││
│  │ Redirect URL:  https://[project].supabase.co/auth/v1/callback           ││
│  │                                                                          ││
│  │ Kakao Developers Console 설정:                                          ││
│  │ ├─── 내 애플리케이션 > 카카오 로그인 > 활성화                           ││
│  │ ├─── Redirect URI 등록 (위 URL)                                         ││
│  │ └─── 동의항목: 닉네임, 프로필 사진, 이메일 (선택)                       ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ GOOGLE                                                         [✓ ON]   ││
│  │                                                                          ││
│  │ Client ID:     [Google OAuth 2.0 Client ID]                             ││
│  │ Client Secret: [Google OAuth 2.0 Client Secret]                         ││
│  │ Redirect URL:  https://[project].supabase.co/auth/v1/callback           ││
│  │                                                                          ││
│  │ Google Cloud Console 설정:                                              ││
│  │ ├─── APIs & Services > Credentials > OAuth 2.0 Client IDs              ││
│  │ ├─── Authorized redirect URIs 등록 (위 URL)                             ││
│  │ └─── OAuth consent screen 설정                                          ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ APPLE                                                          [✓ ON]   ││
│  │                                                                          ││
│  │ Client ID:     [Apple Services ID]                                      ││
│  │ Secret Key:    [Apple Private Key (p8 file content)]                   ││
│  │ Key ID:        [Apple Key ID]                                           ││
│  │ Team ID:       [Apple Team ID]                                          ││
│  │ Redirect URL:  https://[project].supabase.co/auth/v1/callback           ││
│  │                                                                          ││
│  │ Apple Developer Console 설정:                                           ││
│  │ ├─── Identifiers > Services IDs 생성                                   ││
│  │ ├─── Sign In with Apple 활성화                                          ││
│  │ └─── Return URLs 등록 (위 URL)                                          ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

### U-01 Social Login - 컴포넌트 매핑

#### 로그인 UI 구조

```
┌────────────────────────────────────────────────────────────────────────────┐
│ LOGIN PAGE COMPONENT STRUCTURE                                              │
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ LoginPage.tsx (app/login/page.tsx)                                     │ │
│ │                                                                        │ │
│ │ ┌────────────────────────────────────────────────────────────────────┐│ │
│ │ │ 레이아웃: 중앙 정렬, max-width: 400px                              ││ │
│ │ │ 배경: 그라데이션 또는 패턴                                        ││ │
│ │ │                                                                    ││ │
│ │ │ ┌────────────────────────────────────────────────────────────────┐││ │
│ │ │ │ LoginCard.tsx                                                  │││ │
│ │ │ │                                                                │││ │
│ │ │ │ [Logo]                                                         │││ │
│ │ │ │                                                                │││ │
│ │ │ │ <h1>Welcome to Decoded</h1>                                   │││ │
│ │ │ │ <p>Discover what they're wearing</p>                          │││ │
│ │ │ │                                                                │││ │
│ │ │ │ ┌──────────────────────────────────────────────────────────┐ │││ │
│ │ │ │ │ SocialLoginButtons.tsx                                   │ │││ │
│ │ │ │ │                                                          │ │││ │
│ │ │ │ │ ┌──────────────────────────────────────────────────────┐│ │││ │
│ │ │ │ │ │ LoginButton.tsx                                      ││ │││ │
│ │ │ │ │ │ provider="kakao"                                     ││ │││ │
│ │ │ │ │ │                                                      ││ │││ │
│ │ │ │ │ │ backgroundColor: #FEE500                             ││ │││ │
│ │ │ │ │ │ color: #000000                                       ││ │││ │
│ │ │ │ │ │ icon: <KakaoIcon />                                  ││ │││ │
│ │ │ │ │ │ text: "카카오로 로그인"                              ││ │││ │
│ │ │ │ │ │                                                      ││ │││ │
│ │ │ │ │ │ states:                                              ││ │││ │
│ │ │ │ │ │ - default: 노란 배경                                 ││ │││ │
│ │ │ │ │ │ - hover: 살짝 어둡게                                 ││ │││ │
│ │ │ │ │ │ - loading: 스피너 + 텍스트 변경                      ││ │││ │
│ │ │ │ │ │ - disabled: 회색 처리                                ││ │││ │
│ │ │ │ │ └──────────────────────────────────────────────────────┘│ │││ │
│ │ │ │ │                                                          │ │││ │
│ │ │ │ │ ┌──────────────────────────────────────────────────────┐│ │││ │
│ │ │ │ │ │ LoginButton.tsx                                      ││ │││ │
│ │ │ │ │ │ provider="google"                                    ││ │││ │
│ │ │ │ │ │                                                      ││ │││ │
│ │ │ │ │ │ backgroundColor: #FFFFFF                             ││ │││ │
│ │ │ │ │ │ border: 1px solid #DADCE0                           ││ │││ │
│ │ │ │ │ │ color: #3C4043                                       ││ │││ │
│ │ │ │ │ │ icon: <GoogleIcon />                                 ││ │││ │
│ │ │ │ │ │ text: "Continue with Google"                         ││ │││ │
│ │ │ │ │ └──────────────────────────────────────────────────────┘│ │││ │
│ │ │ │ │                                                          │ │││ │
│ │ │ │ │ ┌──────────────────────────────────────────────────────┐│ │││ │
│ │ │ │ │ │ LoginButton.tsx                                      ││ │││ │
│ │ │ │ │ │ provider="apple"                                     ││ │││ │
│ │ │ │ │ │                                                      ││ │││ │
│ │ │ │ │ │ backgroundColor: #000000                             ││ │││ │
│ │ │ │ │ │ color: #FFFFFF                                       ││ │││ │
│ │ │ │ │ │ icon: <AppleIcon />                                  ││ │││ │
│ │ │ │ │ │ text: "Sign in with Apple"                           ││ │││ │
│ │ │ │ │ └──────────────────────────────────────────────────────┘│ │││ │
│ │ │ │ │                                                          │ │││ │
│ │ │ │ └──────────────────────────────────────────────────────────┘ │││ │
│ │ │ │                                                                │││ │
│ │ │ │ <p className="text-sm text-gray-500">                         │││ │
│ │ │ │   By continuing, you agree to our                             │││ │
│ │ │ │   <Link href="/terms">Terms of Service</Link> and             │││ │
│ │ │ │   <Link href="/privacy">Privacy Policy</Link>                 │││ │
│ │ │ │ </p>                                                          │││ │
│ │ │ │                                                                │││ │
│ │ │ └────────────────────────────────────────────────────────────────┘││ │
│ │ └────────────────────────────────────────────────────────────────────┘│ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│ 파일 위치:                                                                 │
│ packages/web/app/login/page.tsx                                           │
│ packages/web/lib/components/auth/                                         │
│ ├── LoginCard.tsx                                                         │
│ ├── SocialLoginButtons.tsx                                                │
│ ├── LoginButton.tsx                                                       │
│ └── icons/                                                                │
│     ├── KakaoIcon.tsx                                                     │
│     ├── GoogleIcon.tsx                                                    │
│     └── AppleIcon.tsx                                                     │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

#### 인증 관련 코드 구조

```
┌────────────────────────────────────────────────────────────────────────────┐
│ AUTHENTICATION CODE STRUCTURE                                               │
│                                                                            │
│ packages/shared/supabase/                                                  │
│ ├── auth.ts                # Auth 유틸리티 함수                           │
│ │   ├── signInWithKakao()                                                 │
│ │   ├── signInWithGoogle()                                                │
│ │   ├── signInWithApple()                                                 │
│ │   ├── signOut()                                                         │
│ │   └── getSession()                                                      │
│ │                                                                          │
│ └── middleware.ts          # 인증 미들웨어                                │
│                                                                            │
│ packages/web/                                                              │
│ ├── app/                                                                  │
│ │   ├── login/page.tsx                                                    │
│ │   └── auth/                                                             │
│ │       └── callback/route.ts   # OAuth 콜백 핸들러                       │
│ │                                                                          │
│ ├── lib/                                                                  │
│ │   ├── providers/                                                        │
│ │   │   └── AuthProvider.tsx    # 전역 인증 컨텍스트                     │
│ │   │                                                                      │
│ │   ├── hooks/                                                            │
│ │   │   ├── useAuth.ts          # 인증 상태 훅                           │
│ │   │   └── useUser.ts          # 사용자 정보 훅                         │
│ │   │                                                                      │
│ │   └── components/auth/                                                  │
│ │       ├── AuthGuard.tsx       # 인증 필요 페이지 가드                  │
│ │       ├── LoginButton.tsx                                               │
│ │       └── UserMenu.tsx        # 헤더의 사용자 메뉴                     │
│ │                                                                          │
│ └── middleware.ts               # Next.js 미들웨어                        │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

#### AuthProvider 상태 관리

```
┌────────────────────────────────────────────────────────────────────────────┐
│ AUTH PROVIDER STATE                                                         │
│                                                                            │
│ packages/web/lib/providers/AuthProvider.tsx                                │
│                                                                            │
│ interface AuthContextType {                                                │
│   user: User | null;                                                       │
│   session: Session | null;                                                 │
│   isLoading: boolean;                                                      │
│   isAuthenticated: boolean;                                                │
│   signIn: (provider: OAuthProvider) => Promise<void>;                     │
│   signOut: () => Promise<void>;                                            │
│   refreshSession: () => Promise<void>;                                     │
│ }                                                                          │
│                                                                            │
│ 상태 전이:                                                                 │
│                                                                            │
│ [INITIAL]                                                                  │
│ { user: null, session: null, isLoading: true, isAuthenticated: false }    │
│       │                                                                    │
│       │ useEffect → supabase.auth.getSession()                            │
│       │                                                                    │
│       ├───────────────────────┬─────────────────────────┐                  │
│       ▼                       ▼                         ▼                  │
│ [NO SESSION]          [HAS SESSION]            [ERROR]                     │
│ {                     {                        {                           │
│   user: null,           user: User,              user: null,              │
│   session: null,        session: Session,        session: null,           │
│   isLoading: false,     isLoading: false,        isLoading: false,        │
│   isAuthenticated:      isAuthenticated:         isAuthenticated:         │
│     false                 true                     false                   │
│ }                     }                        }                           │
│       │                       │                                            │
│       │ signIn()              │ signOut()                                  │
│       │                       │                                            │
│       ▼                       ▼                                            │
│ [REDIRECTING]         [NO SESSION]                                         │
│ OAuth Provider →                                                           │
│ callback →                                                                 │
│ [HAS SESSION]                                                              │
│                                                                            │
│ onAuthStateChange 이벤트:                                                  │
│ ├─── SIGNED_IN → user, session 업데이트                                   │
│ ├─── SIGNED_OUT → user = null, session = null                             │
│ ├─── TOKEN_REFRESHED → session 업데이트                                   │
│ └─── USER_UPDATED → user 업데이트                                         │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

### U-03 Profile Dashboard - 컴포넌트 매핑

#### 프로필 페이지 구조

```
┌────────────────────────────────────────────────────────────────────────────┐
│ PROFILE PAGE COMPONENT STRUCTURE                                            │
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ ProfilePage.tsx (app/profile/page.tsx)                                 │ │
│ │                                                                        │ │
│ │ ┌────────────────────────────────────────────────────────────────────┐│ │
│ │ │ ProfileHeader.tsx                                                  ││ │
│ │ │                                                                    ││ │
│ │ │ ┌──────────┐                                                      ││ │
│ │ │ │          │  Display Name                                        ││ │
│ │ │ │ [Avatar] │  @username                                           ││ │
│ │ │ │          │  "Bio text here..."                                  ││ │
│ │ │ └──────────┘                                                      ││ │
│ │ │               [Edit Profile]                                      ││ │
│ │ │                                                                    ││ │
│ │ │ 컴포넌트:                                                         ││ │
│ │ │ ├─── Avatar.tsx (이미지 또는 이니셜)                              ││ │
│ │ │ └─── EditProfileButton.tsx                                        ││ │
│ │ └────────────────────────────────────────────────────────────────────┘│ │
│ │                                                                        │ │
│ │ ┌────────────────────────────────────────────────────────────────────┐│ │
│ │ │ StatsCards.tsx                                                     ││ │
│ │ │                                                                    ││ │
│ │ │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐               ││ │
│ │ │ │ StatCard.tsx │ │ StatCard.tsx │ │ StatCard.tsx │               ││ │
│ │ │ │              │ │              │ │              │               ││ │
│ │ │ │     127      │ │     89%      │ │   ₩45,000    │               ││ │
│ │ │ │    Posts     │ │   Accepted   │ │   Earnings   │               ││ │
│ │ │ │              │ │              │ │              │               ││ │
│ │ │ │ onClick →    │ │              │ │ onClick →    │               ││ │
│ │ │ │ /activity    │ │              │ │ /earnings    │               ││ │
│ │ │ └──────────────┘ └──────────────┘ └──────────────┘               ││ │
│ │ │                                                                    ││ │
│ │ │ 데이터: useProfileStats() 훅                                      ││ │
│ │ └────────────────────────────────────────────────────────────────────┘│ │
│ │                                                                        │ │
│ │ ┌────────────────────────────────────────────────────────────────────┐│ │
│ │ │ BadgeGrid.tsx                                                      ││ │
│ │ │                                                                    ││ │
│ │ │ 🏆 My Badges                                       [View All →]   ││ │
│ │ │                                                                    ││ │
│ │ │ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                      ││ │
│ │ │ │Badge   │ │Badge   │ │Badge   │ │  +3    │                      ││ │
│ │ │ │Card.tsx│ │Card.tsx│ │Card.tsx│ │  more  │                      ││ │
│ │ │ │        │ │        │ │        │ │        │                      ││ │
│ │ │ │ [IVE]  │ │ [BTS]  │ │[Early] │ │        │                      ││ │
│ │ │ │Expert  │ │ Fan    │ │Adopter │ │        │                      ││ │
│ │ │ └────────┘ └────────┘ └────────┘ └────────┘                      ││ │
│ │ │                                                                    ││ │
│ │ │ 데이터: useUserBadges() 훅                                        ││ │
│ │ └────────────────────────────────────────────────────────────────────┘│ │
│ │                                                                        │ │
│ │ ┌────────────────────────────────────────────────────────────────────┐│ │
│ │ │ RankingList.tsx                                                    ││ │
│ │ │                                                                    ││ │
│ │ │ 📊 My Rankings                                                    ││ │
│ │ │                                                                    ││ │
│ │ │ ┌────────────────────────────────────────────────────────────────┐││ │
│ │ │ │ RankingItem.tsx                                                │││ │
│ │ │ │ • Global: #42 overall                                          │││ │
│ │ │ └────────────────────────────────────────────────────────────────┘││ │
│ │ │ ┌────────────────────────────────────────────────────────────────┐││ │
│ │ │ │ RankingItem.tsx                                                │││ │
│ │ │ │ • IVE: #3 this week  (↑2)                                     │││ │
│ │ │ └────────────────────────────────────────────────────────────────┘││ │
│ │ │ ┌────────────────────────────────────────────────────────────────┐││ │
│ │ │ │ RankingItem.tsx                                                │││ │
│ │ │ │ • BLACKPINK: #12 this month  (↓3)                             │││ │
│ │ │ └────────────────────────────────────────────────────────────────┘││ │
│ │ │                                                                    ││ │
│ │ │ 데이터: useUserRankings() 훅                                      ││ │
│ │ └────────────────────────────────────────────────────────────────────┘│ │
│ │                                                                        │ │
│ │ ┌────────────────────────────────────────────────────────────────────┐│ │
│ │ │ ProfileActions.tsx                                                 ││ │
│ │ │                                                                    ││ │
│ │ │ [View All Activity]              [Settings ⚙]                     ││ │
│ │ │                                                                    ││ │
│ │ │ onClick → /profile/activity      onClick → /profile/settings      ││ │
│ │ └────────────────────────────────────────────────────────────────────┘│ │
│ │                                                                        │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│ 파일 위치:                                                                 │
│ packages/web/app/profile/page.tsx                                         │
│ packages/web/lib/components/profile/                                      │
│ ├── ProfileHeader.tsx                                                     │
│ ├── StatsCards.tsx                                                        │
│ ├── StatCard.tsx                                                          │
│ ├── BadgeGrid.tsx                                                         │
│ ├── BadgeCard.tsx                                                         │
│ ├── RankingList.tsx                                                       │
│ ├── RankingItem.tsx                                                       │
│ └── ProfileActions.tsx                                                    │
│                                                                            │
│ 훅:                                                                        │
│ packages/web/lib/hooks/                                                   │
│ ├── useProfile.ts                                                         │
│ ├── useProfileStats.ts                                                    │
│ ├── useUserBadges.ts                                                      │
│ └── useUserRankings.ts                                                    │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

### 데이터베이스 트리거: 신규 사용자 처리

```sql
-- supabase/migrations/xxx_handle_new_user.sql

-- 신규 사용자 가입 시 자동으로 프로필 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profile (
    id,
    display_name,
    avatar_url,
    auth_provider,
    preferred_language,
    created_at
  ) VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'full_name',
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture'
    ),
    NEW.raw_app_meta_data->>'provider',
    'ko',
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- auth.users 테이블에 트리거 연결
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 에지 케이스 및 에러 처리

### U-01 Social Login

| 상황 | 처리 방법 | 구현 위치 |
|------|----------|----------|
| OAuth 취소 | 로그인 페이지로 리다이렉트 | callback/route.ts |
| Provider 오류 | 에러 메시지 표시 + 재시도 | LoginPage.tsx |
| 이메일 중복 | 기존 계정 연결 안내 | callback/route.ts |
| 세션 만료 | 자동 로그아웃 + 리다이렉트 | AuthProvider.tsx |
| 쿠키 차단 | 경고 메시지 표시 | LoginPage.tsx |

### U-02 Multi-language

| 상황 | 처리 방법 | 구현 위치 |
|------|----------|----------|
| 번역 누락 | 키값 그대로 표시 (fallback) | useTranslation.ts |
| 언어 변경 실패 | localStorage 사용 | LanguageToggle.tsx |
| 숫자/날짜 포맷 | Intl API 사용 | formatters.ts |

### U-03 Profile Dashboard

| 상황 | 처리 방법 | 구현 위치 |
|------|----------|----------|
| 프로필 로드 실패 | 스켈레톤 + 재시도 | ProfilePage.tsx |
| 뱃지 0개 | "No badges yet" 메시지 | BadgeGrid.tsx |
| 랭킹 데이터 없음 | "Start contributing" CTA | RankingList.tsx |

### U-05 Withdrawal

| 상황 | 처리 방법 | 구현 위치 |
|------|----------|----------|
| 최소 금액 미달 | 버튼 비활성화 + 안내 | WithdrawalForm.tsx |
| 잔액 부족 | 에러 메시지 | useWithdrawal.ts |
| 결제 정보 미입력 | 설정 페이지로 안내 | EarningsPage.tsx |
| 요청 실패 | 재시도 + 고객센터 안내 | WithdrawalForm.tsx |

---

## 구현 상태 체크리스트

### U-01 Social Login
- [ ] Supabase OAuth 설정 (Kakao, Google, Apple)
- [ ] 로그인 페이지 UI
- [ ] OAuth 콜백 핸들러
- [ ] AuthProvider 컨텍스트
- [ ] useAuth 훅
- [ ] 로그아웃 기능
- [ ] 세션 자동 갱신

### U-02 Multi-language
- [ ] 번역 파일 (ko.json, en.json)
- [ ] useTranslation 훅
- [ ] LanguageToggle 컴포넌트
- [ ] 언어 설정 저장 (localStorage/DB)
- [ ] 날짜/숫자 포매터

### U-03 Profile Dashboard
- [ ] ProfileHeader 컴포넌트
- [ ] StatsCards 컴포넌트
- [ ] BadgeGrid 컴포넌트
- [ ] RankingList 컴포넌트
- [ ] 프로필 데이터 훅

### U-04 Activity History
- [ ] ActivityTabs 컴포넌트
- [ ] PostList 컴포넌트
- [ ] AnswerList 컴포넌트
- [ ] FavoriteList 컴포넌트
- [ ] 활동 데이터 API

### U-05 Withdrawal
- [ ] EarningsCard 컴포넌트
- [ ] WithdrawalForm 컴포넌트
- [ ] WithdrawalHistory 컴포넌트
- [ ] 결제 정보 입력 UI
- [ ] 출금 요청 API
