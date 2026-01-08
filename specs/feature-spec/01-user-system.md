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
