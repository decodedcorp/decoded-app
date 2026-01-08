# Admin Panel

> Features: A-01 ~ A-03
> Status: 0% implemented
> Dependencies: U-01 (Authentication with admin role)

---

## Overview

The Admin Panel provides tools for content moderation, tag management, and business analytics. It's a separate interface accessible only to users with admin privileges.

### Related Screens
- `/admin` - Admin dashboard
- `/admin/tags` - Tag/keyword management
- `/admin/content` - Content moderation
- `/admin/payouts` - Payout management
- `/admin/analytics` - Analytics dashboard

### Current Implementation
- None - Admin panel not yet built

---

## Features

### A-01 Tag/Keyword Management

- **Description**: CMS for managing Media, Cast, and Context tags
- **Priority**: P1
- **Status**: Not Started
- **Dependencies**: Database hierarchical structure (S-04)

#### Acceptance Criteria
- [ ] List all tags with filtering and search
- [ ] Add new Media (group, show, drama)
- [ ] Add new Cast member
- [ ] Link Cast to Media
- [ ] Edit existing tags
- [ ] Soft delete (archive) tags
- [ ] Review user-submitted tag requests
- [ ] Approve/reject tag requests
- [ ] Bulk operations (merge, reparent)
- [ ] Import/export functionality

#### UI/UX Requirements

**Tag Management Dashboard**:
```
┌─────────────────────────────────────────────────────────────────┐
│  Tag Management                                  [+ Add New]    │
│                                                                  │
│  [Media] [Cast] [Pending Requests (5)]                         │
├─────────────────────────────────────────────────────────────────┤
│  🔍 Search tags...                    Type: [All ▼]            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🎵 BLACKPINK                                             │   │
│  │    Category: K-POP • Type: Group                         │   │
│  │    Cast: Jisoo, Jennie, Rosé, Lisa                      │   │
│  │    Posts: 1,234 • Items: 3,456                          │   │
│  │    [Edit] [View Posts] [Archive]                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🎬 Squid Game                                            │   │
│  │    Category: K-Drama • Type: Drama                       │   │
│  │    Cast: Lee Jung-jae, Jung Ho-yeon, +12 more           │   │
│  │    Posts: 567 • Items: 1,890                            │   │
│  │    [Edit] [View Posts] [Archive]                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  [1] [2] [3] ... [15]                    Showing 1-20 of 289   │
└─────────────────────────────────────────────────────────────────┘
```

**Add/Edit Media Form**:
```
┌─────────────────────────────────────────────────────────────────┐
│  Add New Media                                          [✕]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Name (English) *                                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ BLACKPINK                                                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Name (Korean) *                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 블랙핑크                                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Category *                                                     │
│  [K-POP ▼]                                                     │
│                                                                  │
│  Type *                                                         │
│  [Group ▼]  (Group / Show / Drama / Movie / Variety)          │
│                                                                  │
│  Image                                                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ [Upload Image]                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Metadata (JSON)                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ {                                                        │   │
│  │   "agency": "YG Entertainment",                         │   │
│  │   "debut": "2016-08-08"                                 │   │
│  │ }                                                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│                              [Cancel] [Save Media]              │
└─────────────────────────────────────────────────────────────────┘
```

**Tag Request Review**:
```
┌─────────────────────────────────────────────────────────────────┐
│  Pending Tag Requests                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Request #127                           Jan 8, 2026      │   │
│  │                                                          │   │
│  │ Type: Cast                                               │   │
│  │ Name: Kim Chaewon                                        │   │
│  │ Korean: 김채원                                           │   │
│  │ Related Media: LE SSERAFIM                              │   │
│  │                                                          │   │
│  │ Submitted by: user@example.com                          │   │
│  │ Reason: "New member added to group"                     │   │
│  │                                                          │   │
│  │ [✓ Approve] [✗ Reject] [Edit & Approve]                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### Data Requirements
- Tag request table for pending submissions
- Audit log for tag changes
- Admin user permissions

#### API Endpoints
```
GET /api/admin/tags?type=media&page=1&search=
POST /api/admin/tags/media
PUT /api/admin/tags/media/:id
DELETE /api/admin/tags/media/:id

GET /api/admin/tags/requests
POST /api/admin/tags/requests/:id/approve
POST /api/admin/tags/requests/:id/reject

POST /api/admin/tags/bulk
  body: { action: 'merge' | 'archive', ids: string[] }
```

#### Files to Create/Modify
- `app/admin/layout.tsx` - Admin layout
- `app/admin/tags/page.tsx`
- `lib/components/admin/TagTable.tsx`
- `lib/components/admin/TagForm.tsx`
- `lib/components/admin/TagRequestList.tsx`

---

### A-02 Content/Payout Management

- **Description**: Review and moderate user-submitted content; process payouts
- **Priority**: P1
- **Status**: Not Started
- **Dependencies**: A-01, S-06 (Reward Batch)

#### Acceptance Criteria

**Content Moderation**:
- [ ] List all posts with status filter
- [ ] View post details with all items
- [ ] Approve/reject posts
- [ ] Flag inappropriate content
- [ ] Edit post metadata
- [ ] Remove specific items from post
- [ ] Ban/suspend users

**Payout Management**:
- [ ] List pending withdrawal requests
- [ ] View user earnings history
- [ ] Approve/reject withdrawals
- [ ] Mark as paid
- [ ] Generate payout reports
- [ ] Handle disputes

#### UI/UX Requirements

**Content Moderation Queue**:
```
┌─────────────────────────────────────────────────────────────────┐
│  Content Moderation                                             │
│                                                                  │
│  [Pending (23)] [Published] [Rejected] [Flagged]               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ [Image]  Post #4521                    Jan 8, 2:34 PM   │   │
│  │          By: user123                                     │   │
│  │          Tags: BLACKPINK > Jennie > Airport             │   │
│  │          Items: 3                                        │   │
│  │                                                          │   │
│  │ [View Details] [✓ Approve] [✗ Reject] [🚩 Flag]        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ [Image]  Post #4520                    Jan 8, 2:12 PM   │   │
│  │          By: fashionista                                 │   │
│  │          Tags: IVE > Wonyoung > Stage                   │   │
│  │          Items: 5                                        │   │
│  │                                                          │   │
│  │ [View Details] [✓ Approve] [✗ Reject] [🚩 Flag]        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Payout Management**:
```
┌─────────────────────────────────────────────────────────────────┐
│  Payout Management                                              │
│                                                                  │
│  [Pending (8)] [Processing] [Completed] [Rejected]             │
│                                                                  │
│  Summary:                                                        │
│  Total Pending: ₩1,234,500                                      │
│  This Month Paid: ₩5,678,000                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Request #891                           Jan 7, 2026      │   │
│  │ User: top_contributor                                    │   │
│  │ Amount: ₩150,000                                        │   │
│  │ Method: Bank Transfer (신한 xxx-xxx-123456)             │   │
│  │                                                          │   │
│  │ User Stats:                                              │   │
│  │ • Total Earnings: ₩450,000                              │   │
│  │ • Previous Payouts: 2 (all successful)                  │   │
│  │ • Account Age: 8 months                                 │   │
│  │                                                          │   │
│  │ [View History] [✓ Approve] [✗ Reject]                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Bulk Actions: [ ] Select All  [Process Selected]              │
└─────────────────────────────────────────────────────────────────┘
```

#### Data Requirements
- Post status field (pending, published, rejected, flagged)
- Moderation audit log
- Withdrawal request table
- Payout history

#### API Endpoints
```
# Content
GET /api/admin/posts?status=pending&page=1
GET /api/admin/posts/:id
PUT /api/admin/posts/:id/status
  body: { status: 'published' | 'rejected', reason?: string }
POST /api/admin/posts/:id/flag
POST /api/admin/users/:id/ban

# Payouts
GET /api/admin/withdrawals?status=pending
GET /api/admin/withdrawals/:id
PUT /api/admin/withdrawals/:id/approve
PUT /api/admin/withdrawals/:id/reject
PUT /api/admin/withdrawals/:id/complete
GET /api/admin/payouts/report?month=2026-01
```

#### Files to Create/Modify
- `app/admin/content/page.tsx`
- `app/admin/payouts/page.tsx`
- `lib/components/admin/PostModerationCard.tsx`
- `lib/components/admin/WithdrawalRequestCard.tsx`
- `lib/components/admin/PayoutReport.tsx`

---

### A-03 Analytics Dashboard

- **Description**: Monitor key metrics and KPIs
- **Priority**: P1
- **Status**: Not Started
- **Dependencies**: All tracking systems

#### Acceptance Criteria
- [ ] Real-time visitor count
- [ ] Daily/weekly/monthly active users
- [ ] Post creation metrics
- [ ] Click-through rates
- [ ] Conversion rates
- [ ] Revenue metrics
- [ ] Top contributors
- [ ] Popular content
- [ ] Engagement trends
- [ ] Export reports

#### UI/UX Requirements

**Analytics Dashboard**:
```
┌─────────────────────────────────────────────────────────────────┐
│  Analytics Dashboard                    [Jan 1 - Jan 8, 2026 ▼]│
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Key Metrics                                                     │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │ 12,345  │ │  1,234  │ │  5.2%   │ │ ₩1.2M  │              │
│  │  DAU    │ │  Posts  │ │  CTR    │ │Revenue │              │
│  │ +12%    │ │ +8%     │ │ +0.3%   │ │ +15%   │              │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘              │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  User Activity Trend                                     │   │
│  │  ▁▂▃▄▅▆▇█▇▆▅▄▃▂▁                                       │   │
│  │  Jan 1  Jan 2  Jan 3  Jan 4  Jan 5  Jan 6  Jan 7  Jan 8│   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌────────────────────────┐ ┌────────────────────────────┐    │
│  │ Top Content (Week)     │ │ Top Contributors           │    │
│  │                        │ │                            │    │
│  │ 1. BLACKPINK Airport  │ │ 1. user123 (127 posts)    │    │
│  │    1,234 views         │ │ 2. fashionista (89 posts)│    │
│  │ 2. IVE Music Bank     │ │ 3. kpop_fan (76 posts)   │    │
│  │    987 views           │ │                            │    │
│  │ 3. NewJeans Photoshoot│ │                            │    │
│  │    876 views           │ │                            │    │
│  └────────────────────────┘ └────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Revenue Breakdown                                        │   │
│  │                                                          │   │
│  │ By Source:              By Category:                    │   │
│  │ ████████ Musinsa 45%    ████████ K-POP 62%             │   │
│  │ ██████ Farfetch 28%     ████ K-Drama 23%               │   │
│  │ ████ 29CM 18%           ██ Other 15%                    │   │
│  │ ██ Other 9%                                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  [Export PDF] [Export CSV]                                      │
└─────────────────────────────────────────────────────────────────┘
```

#### Data Requirements
- Aggregated metrics tables (materialized views)
- Time-series data storage
- Real-time event streaming (optional)

#### Metrics to Track

**User Metrics**:
- Daily/Weekly/Monthly Active Users (DAU/WAU/MAU)
- New user signups
- User retention (D1, D7, D30)
- Session duration
- Bounce rate

**Content Metrics**:
- Posts created (per day/week)
- Posts per user
- Items identified
- Average items per post
- Content moderation rate

**Engagement Metrics**:
- Page views
- Detail view opens
- Comments per post
- Votes per item
- Favorites added

**Business Metrics**:
- Click-through rate (CTR)
- Conversion rate
- Revenue per user
- Average order value
- Commission earned

#### API Endpoints
```
GET /api/admin/analytics/overview?period=7d
GET /api/admin/analytics/users?period=30d
GET /api/admin/analytics/content?period=30d
GET /api/admin/analytics/revenue?period=30d
GET /api/admin/analytics/top-content?period=7d&limit=10
GET /api/admin/analytics/top-contributors?period=7d&limit=10
GET /api/admin/analytics/export?type=pdf&period=30d
```

#### Implementation Notes

**Materialized Views for Metrics**:
```sql
-- Daily metrics snapshot
CREATE MATERIALIZED VIEW daily_metrics AS
SELECT
  DATE(created_at) as date,
  COUNT(DISTINCT user_id) as dau,
  COUNT(DISTINCT CASE WHEN type = 'post' THEN id END) as posts,
  COUNT(DISTINCT CASE WHEN type = 'click' THEN id END) as clicks,
  SUM(CASE WHEN type = 'conversion' THEN amount END) as revenue
FROM events
GROUP BY DATE(created_at);

-- Refresh daily
SELECT cron.schedule('refresh-daily-metrics', '0 1 * * *', $$
  REFRESH MATERIALIZED VIEW daily_metrics;
$$);
```

**Chart Library**:
```typescript
// Using Recharts or Chart.js
import { LineChart, Line, BarChart, Bar, PieChart, Pie } from 'recharts';

function UserActivityChart({ data }) {
  return (
    <LineChart data={data}>
      <Line dataKey="dau" stroke="#8884d8" />
      <Line dataKey="newUsers" stroke="#82ca9d" />
    </LineChart>
  );
}
```

#### Files to Create/Modify
- `app/admin/page.tsx` - Dashboard home
- `app/admin/analytics/page.tsx` - Detailed analytics
- `lib/components/admin/MetricCard.tsx`
- `lib/components/admin/ActivityChart.tsx`
- `lib/components/admin/RevenueChart.tsx`
- `lib/components/admin/TopContentList.tsx`
- `lib/components/admin/TopContributorsList.tsx`
- `lib/hooks/useAdminAnalytics.ts`

---

## Admin Authentication

### Role-based Access Control

```typescript
// lib/auth/roles.ts
type AdminRole = 'super_admin' | 'content_moderator' | 'payout_manager' | 'viewer';

const rolePermissions: Record<AdminRole, string[]> = {
  super_admin: ['*'],
  content_moderator: ['tags.view', 'tags.edit', 'content.view', 'content.moderate'],
  payout_manager: ['payouts.view', 'payouts.approve', 'analytics.view'],
  viewer: ['*.view'],
};

// Middleware
export function requireAdmin(permission: string) {
  return async (req: Request) => {
    const user = await getUser(req);
    if (!user?.adminRole) {
      throw new UnauthorizedError('Admin access required');
    }
    if (!hasPermission(user.adminRole, permission)) {
      throw new ForbiddenError('Insufficient permissions');
    }
  };
}
```

### Admin Layout

```typescript
// app/admin/layout.tsx
export default function AdminLayout({ children }) {
  return (
    <AdminAuthProvider>
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1">
          <AdminHeader />
          {children}
        </main>
      </div>
    </AdminAuthProvider>
  );
}
```

---

## Data Models

See [data-models.md](./data-models.md) for full type definitions.

### Key Types for Admin

```typescript
interface AdminUser {
  id: string;
  userId: string;
  role: AdminRole;
  permissions: string[];
  createdAt: Date;
}

interface TagRequest {
  id: string;
  type: 'media' | 'cast';
  name: string;
  nameKo: string;
  relatedMediaId?: string;
  requestedBy: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: Date;
  createdAt: Date;
}

interface ModerationAction {
  id: string;
  targetType: 'post' | 'comment' | 'user';
  targetId: string;
  action: 'approve' | 'reject' | 'flag' | 'ban';
  reason?: string;
  adminId: string;
  createdAt: Date;
}

interface PayoutAction {
  id: string;
  withdrawalId: string;
  action: 'approve' | 'reject' | 'complete';
  adminId: string;
  note?: string;
  createdAt: Date;
}
```

---

## Migration Path

### Phase 1: Basic Admin Setup
1. Create admin role system
2. Build admin layout and navigation
3. Implement authentication middleware

### Phase 2: Tag Management
1. Build tag CRUD interfaces
2. Implement tag request review
3. Add bulk operations

### Phase 3: Content Moderation
1. Build post moderation queue
2. Implement approve/reject flow
3. Add user management

### Phase 4: Payouts & Analytics
1. Build payout management interface
2. Create analytics dashboard
3. Add export functionality

---

## Security Considerations

- Admin panel on separate subdomain (admin.decoded.app)
- Additional 2FA required for admin access
- All admin actions logged with full audit trail
- IP allowlisting for admin access (optional)
- Rate limiting on admin APIs
- Session timeout after inactivity
