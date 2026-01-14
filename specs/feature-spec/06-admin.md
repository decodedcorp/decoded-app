# 관리자 패널

> 기능: A-01 ~ A-03
> 상태: 0% 구현됨
> 의존성: U-01 (관리자 역할 인증)

---

## 개요

관리자 패널은 콘텐츠 모더레이션, 태그 관리, 비즈니스 분석 도구를 제공합니다. 관리자 권한이 있는 사용자만 접근할 수 있는 별도의 인터페이스입니다.

### 관련 화면
- `/admin` - 관리자 대시보드
- `/admin/tags` - 태그/키워드 관리
- `/admin/content` - 콘텐츠 모더레이션
- `/admin/payouts` - 지급 관리
- `/admin/analytics` - 분석 대시보드

### 현재 구현 상태
- 없음 - 관리자 패널 미구축

---

## 기능 목록

### A-01 태그/키워드 관리

- **설명**: Media, Cast, Context 태그 관리를 위한 CMS
- **우선순위**: P1
- **상태**: 미시작
- **의존성**: 데이터베이스 계층 구조 (S-04)

#### 수락 기준
- [ ] 필터링 및 검색이 가능한 모든 태그 목록
- [ ] 새 Media 추가 (그룹, 프로그램, 드라마)
- [ ] 새 Cast 멤버 추가
- [ ] Cast를 Media에 연결
- [ ] 기존 태그 편집
- [ ] 소프트 삭제 (아카이브) 태그
- [ ] 사용자 제출 태그 요청 검토
- [ ] 태그 요청 승인/거부
- [ ] 대량 작업 (병합, 상위 변경)
- [ ] 가져오기/내보내기 기능

#### UI/UX 요구사항

**태그 관리 대시보드**:
```
┌─────────────────────────────────────────────────────────────────┐
│  태그 관리                                        [+ 새로 추가]  │
│                                                                  │
│  [Media] [Cast] [대기 중인 요청 (5)]                            │
├─────────────────────────────────────────────────────────────────┤
│  🔍 태그 검색...                        유형: [전체 ▼]          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🎵 BLACKPINK                                             │   │
│  │    카테고리: K-POP • 유형: 그룹                          │   │
│  │    출연진: 지수, 제니, 로제, 리사                        │   │
│  │    게시물: 1,234 • 아이템: 3,456                        │   │
│  │    [편집] [게시물 보기] [아카이브]                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🎬 오징어 게임                                           │   │
│  │    카테고리: K-Drama • 유형: 드라마                      │   │
│  │    출연진: 이정재, 정호연, +12명                        │   │
│  │    게시물: 567 • 아이템: 1,890                          │   │
│  │    [편집] [게시물 보기] [아카이브]                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  [1] [2] [3] ... [15]                    289개 중 1-20 표시     │
└─────────────────────────────────────────────────────────────────┘
```

**Media 추가/편집 폼**:
```
┌─────────────────────────────────────────────────────────────────┐
│  새 Media 추가                                            [✕]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  이름 (영어) *                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ BLACKPINK                                                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  이름 (한국어) *                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 블랙핑크                                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  카테고리 *                                                     │
│  [K-POP ▼]                                                     │
│                                                                  │
│  유형 *                                                         │
│  [그룹 ▼]  (그룹 / 프로그램 / 드라마 / 영화 / 예능)            │
│                                                                  │
│  이미지                                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ [이미지 업로드]                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  메타데이터 (JSON)                                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ {                                                        │   │
│  │   "agency": "YG Entertainment",                         │   │
│  │   "debut": "2016-08-08"                                 │   │
│  │ }                                                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│                              [취소] [Media 저장]               │
└─────────────────────────────────────────────────────────────────┘
```

**태그 요청 검토**:
```
┌─────────────────────────────────────────────────────────────────┐
│  대기 중인 태그 요청                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 요청 #127                           2026년 1월 8일       │   │
│  │                                                          │   │
│  │ 유형: Cast                                               │   │
│  │ 이름: Kim Chaewon                                        │   │
│  │ 한국어: 김채원                                           │   │
│  │ 관련 Media: 르세라핌                                     │   │
│  │                                                          │   │
│  │ 제출자: user@example.com                                │   │
│  │ 사유: "그룹에 새 멤버 추가됨"                           │   │
│  │                                                          │   │
│  │ [✓ 승인] [✗ 거부] [수정 후 승인]                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### 데이터 요구사항
- 대기 중인 제출을 위한 태그 요청 테이블
- 태그 변경에 대한 감사 로그
- 관리자 사용자 권한

#### API 엔드포인트
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

#### 생성/수정할 파일
- `app/admin/layout.tsx` - 관리자 레이아웃
- `app/admin/tags/page.tsx`
- `lib/components/admin/TagTable.tsx`
- `lib/components/admin/TagForm.tsx`
- `lib/components/admin/TagRequestList.tsx`

---

### A-02 콘텐츠/지급 관리

- **설명**: 사용자 제출 콘텐츠 검토 및 모더레이션; 지급 처리
- **우선순위**: P1
- **상태**: 미시작
- **의존성**: A-01, S-06 (리워드 배치)

#### 수락 기준

**콘텐츠 모더레이션**:
- [ ] 상태 필터가 있는 모든 게시물 목록
- [ ] 모든 아이템이 포함된 게시물 상세 보기
- [ ] 게시물 승인/거부
- [ ] 부적절한 콘텐츠 플래그
- [ ] 게시물 메타데이터 편집
- [ ] 게시물에서 특정 아이템 제거
- [ ] 사용자 차단/정지

**지급 관리**:
- [ ] 대기 중인 출금 요청 목록
- [ ] 사용자 수익 내역 보기
- [ ] 출금 승인/거부
- [ ] 지급 완료로 표시
- [ ] 지급 보고서 생성
- [ ] 분쟁 처리

#### UI/UX 요구사항

**콘텐츠 모더레이션 큐**:
```
┌─────────────────────────────────────────────────────────────────┐
│  콘텐츠 모더레이션                                               │
│                                                                  │
│  [대기 중 (23)] [게시됨] [거부됨] [플래그됨]                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ [이미지]  게시물 #4521               1월 8일 오후 2:34   │   │
│  │           작성자: user123                                │   │
│  │           태그: BLACKPINK > 제니 > 공항                 │   │
│  │           아이템: 3                                      │   │
│  │                                                          │   │
│  │ [상세 보기] [✓ 승인] [✗ 거부] [🚩 플래그]             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ [이미지]  게시물 #4520               1월 8일 오후 2:12   │   │
│  │           작성자: fashionista                            │   │
│  │           태그: IVE > 원영 > 무대                        │   │
│  │           아이템: 5                                      │   │
│  │                                                          │   │
│  │ [상세 보기] [✓ 승인] [✗ 거부] [🚩 플래그]             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**지급 관리**:
```
┌─────────────────────────────────────────────────────────────────┐
│  지급 관리                                                       │
│                                                                  │
│  [대기 중 (8)] [처리 중] [완료됨] [거부됨]                      │
│                                                                  │
│  요약:                                                           │
│  대기 중 총액: ₩1,234,500                                       │
│  이번 달 지급: ₩5,678,000                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 요청 #891                           2026년 1월 7일       │   │
│  │ 사용자: top_contributor                                  │   │
│  │ 금액: ₩150,000                                          │   │
│  │ 방법: 은행 이체 (신한 xxx-xxx-123456)                   │   │
│  │                                                          │   │
│  │ 사용자 통계:                                            │   │
│  │ • 총 수익: ₩450,000                                     │   │
│  │ • 이전 지급: 2회 (모두 성공)                            │   │
│  │ • 계정 나이: 8개월                                      │   │
│  │                                                          │   │
│  │ [내역 보기] [✓ 승인] [✗ 거부]                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  대량 작업: [ ] 전체 선택  [선택 항목 처리]                     │
└─────────────────────────────────────────────────────────────────┘
```

#### 데이터 요구사항
- 게시물 상태 필드 (pending, published, rejected, flagged)
- 모더레이션 감사 로그
- 출금 요청 테이블
- 지급 내역

#### API 엔드포인트
```
# 콘텐츠
GET /api/admin/posts?status=pending&page=1
GET /api/admin/posts/:id
PUT /api/admin/posts/:id/status
  body: { status: 'published' | 'rejected', reason?: string }
POST /api/admin/posts/:id/flag
POST /api/admin/users/:id/ban

# 지급
GET /api/admin/withdrawals?status=pending
GET /api/admin/withdrawals/:id
PUT /api/admin/withdrawals/:id/approve
PUT /api/admin/withdrawals/:id/reject
PUT /api/admin/withdrawals/:id/complete
GET /api/admin/payouts/report?month=2026-01
```

#### 생성/수정할 파일
- `app/admin/content/page.tsx`
- `app/admin/payouts/page.tsx`
- `lib/components/admin/PostModerationCard.tsx`
- `lib/components/admin/WithdrawalRequestCard.tsx`
- `lib/components/admin/PayoutReport.tsx`

---

### A-03 분석 대시보드

- **설명**: 주요 지표 및 KPI 모니터링
- **우선순위**: P1
- **상태**: 미시작
- **의존성**: 모든 추적 시스템

#### 수락 기준
- [ ] 실시간 방문자 수
- [ ] 일간/주간/월간 활성 사용자
- [ ] 게시물 생성 지표
- [ ] 클릭률
- [ ] 전환율
- [ ] 수익 지표
- [ ] 상위 기여자
- [ ] 인기 콘텐츠
- [ ] 참여 추세
- [ ] 보고서 내보내기

#### UI/UX 요구사항

**분석 대시보드**:
```
┌─────────────────────────────────────────────────────────────────┐
│  분석 대시보드                      [2026년 1월 1일 - 1월 8일 ▼]│
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  주요 지표                                                       │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │ 12,345  │ │  1,234  │ │  5.2%   │ │ ₩1.2M  │              │
│  │  DAU    │ │ 게시물  │ │  CTR    │ │  수익  │              │
│  │ +12%    │ │ +8%     │ │ +0.3%   │ │ +15%   │              │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘              │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  사용자 활동 추세                                        │   │
│  │  ▁▂▃▄▅▆▇█▇▆▅▄▃▂▁                                       │   │
│  │  1/1    1/2    1/3    1/4    1/5    1/6    1/7    1/8   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌────────────────────────┐ ┌────────────────────────────┐    │
│  │ 인기 콘텐츠 (주간)      │ │ 상위 기여자               │    │
│  │                        │ │                            │    │
│  │ 1. BLACKPINK 공항     │ │ 1. user123 (127 게시물)   │    │
│  │    1,234 조회          │ │ 2. fashionista (89 게시물)│    │
│  │ 2. IVE 뮤직뱅크       │ │ 3. kpop_fan (76 게시물)  │    │
│  │    987 조회            │ │                            │    │
│  │ 3. NewJeans 화보      │ │                            │    │
│  │    876 조회            │ │                            │    │
│  └────────────────────────┘ └────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 수익 분석                                                │   │
│  │                                                          │   │
│  │ 출처별:                  카테고리별:                     │   │
│  │ ████████ 무신사 45%     ████████ K-POP 62%             │   │
│  │ ██████ Farfetch 28%     ████ K-Drama 23%               │   │
│  │ ████ 29CM 18%           ██ 기타 15%                     │   │
│  │ ██ 기타 9%                                               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  [PDF 내보내기] [CSV 내보내기]                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 데이터 요구사항
- 집계된 지표 테이블 (materialized views)
- 시계열 데이터 저장소
- 실시간 이벤트 스트리밍 (선택)

#### 추적할 지표

**사용자 지표**:
- 일간/주간/월간 활성 사용자 (DAU/WAU/MAU)
- 신규 사용자 가입
- 사용자 리텐션 (D1, D7, D30)
- 세션 지속 시간
- 이탈률

**콘텐츠 지표**:
- 생성된 게시물 (일별/주별)
- 사용자별 게시물
- 식별된 아이템
- 게시물당 평균 아이템
- 콘텐츠 모더레이션 비율

**참여 지표**:
- 페이지 조회수
- 상세 뷰 오픈
- 게시물당 댓글
- 아이템당 투표
- 즐겨찾기 추가

**비즈니스 지표**:
- 클릭률 (CTR)
- 전환율
- 사용자당 수익
- 평균 주문 금액
- 획득 커미션

#### API 엔드포인트
```
GET /api/admin/analytics/overview?period=7d
GET /api/admin/analytics/users?period=30d
GET /api/admin/analytics/content?period=30d
GET /api/admin/analytics/revenue?period=30d
GET /api/admin/analytics/top-content?period=7d&limit=10
GET /api/admin/analytics/top-contributors?period=7d&limit=10
GET /api/admin/analytics/export?type=pdf&period=30d
```

#### 구현 노트

**지표용 Materialized Views**:
```sql
-- 일일 지표 스냅샷
CREATE MATERIALIZED VIEW daily_metrics AS
SELECT
  DATE(created_at) as date,
  COUNT(DISTINCT user_id) as dau,
  COUNT(DISTINCT CASE WHEN type = 'post' THEN id END) as posts,
  COUNT(DISTINCT CASE WHEN type = 'click' THEN id END) as clicks,
  SUM(CASE WHEN type = 'conversion' THEN amount END) as revenue
FROM events
GROUP BY DATE(created_at);

-- 매일 갱신
SELECT cron.schedule('refresh-daily-metrics', '0 1 * * *', $$
  REFRESH MATERIALIZED VIEW daily_metrics;
$$);
```

**차트 라이브러리**:
```typescript
// Recharts 또는 Chart.js 사용
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

#### 생성/수정할 파일
- `app/admin/page.tsx` - 대시보드 홈
- `app/admin/analytics/page.tsx` - 상세 분석
- `lib/components/admin/MetricCard.tsx`
- `lib/components/admin/ActivityChart.tsx`
- `lib/components/admin/RevenueChart.tsx`
- `lib/components/admin/TopContentList.tsx`
- `lib/components/admin/TopContributorsList.tsx`
- `lib/hooks/useAdminAnalytics.ts`

---

## 관리자 인증

### 역할 기반 접근 제어

```typescript
// lib/auth/roles.ts
type AdminRole = 'super_admin' | 'content_moderator' | 'payout_manager' | 'viewer';

const rolePermissions: Record<AdminRole, string[]> = {
  super_admin: ['*'],
  content_moderator: ['tags.view', 'tags.edit', 'content.view', 'content.moderate'],
  payout_manager: ['payouts.view', 'payouts.approve', 'analytics.view'],
  viewer: ['*.view'],
};

// 미들웨어
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

### 관리자 레이아웃

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

## 데이터 모델

전체 타입 정의는 [data-models.md](./data-models.md) 참조.

### 관리자용 주요 타입

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

## 마이그레이션 경로

### 1단계: 기본 관리자 설정
1. 관리자 역할 시스템 생성
2. 관리자 레이아웃 및 네비게이션 구축
3. 인증 미들웨어 구현

### 2단계: 태그 관리
1. 태그 CRUD 인터페이스 구축
2. 태그 요청 검토 구현
3. 대량 작업 추가

### 3단계: 콘텐츠 모더레이션
1. 게시물 모더레이션 큐 구축
2. 승인/거부 흐름 구현
3. 사용자 관리 추가

### 4단계: 지급 & 분석
1. 지급 관리 인터페이스 구축
2. 분석 대시보드 생성
3. 내보내기 기능 추가

---

## 보안 고려사항

- 관리자 패널은 별도 서브도메인에 배치 (admin.decoded.app)
- 관리자 접근에 추가 2FA 필요
- 모든 관리자 작업은 전체 감사 추적으로 로깅
- 관리자 접근을 위한 IP 화이트리스팅 (선택)
- 관리자 API에 Rate limiting
- 비활성 후 세션 타임아웃
