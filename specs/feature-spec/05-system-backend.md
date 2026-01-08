# System & Backend

> Features: S-01 ~ S-08
> Status: 20% implemented
> Dependencies: Infrastructure setup

---

## Overview

System features handle the backend infrastructure including AI processing, data scraping, link generation, rewards calculation, and gamification. These are primarily server-side components that power the user-facing features.

### Current Implementation
- Basic database schema exists
- Image processing pipeline (partial)
- No user/reward system yet

---

## Features

### S-01 Vision API Module

- **Description**: Image analysis and labeling service for item detection
- **Priority**: P0 (Internal)
- **Status**: Partial (backend pipeline exists)
- **Dependencies**: Cloud Vision API or custom model

#### Acceptance Criteria
- [ ] Accept image URL or base64 input
- [ ] Return detected objects with bounding boxes
- [ ] Return category classification for each object
- [ ] Return confidence scores
- [ ] Support batch processing
- [ ] Response time < 5 seconds
- [ ] Handle various image sizes and formats
- [ ] Error handling for unsupported images

#### Technical Specification

**API Contract**:
```typescript
// POST /api/ai/detect
interface DetectionRequest {
  imageUrl?: string;
  imageBase64?: string;
  options?: {
    minConfidence?: number;  // Default: 0.7
    maxDetections?: number;  // Default: 10
    categories?: ItemCategory[];  // Filter to specific categories
  };
}

interface DetectionResponse {
  success: boolean;
  detections: Array<{
    id: string;
    bbox: {
      x: number;      // 0-1 normalized
      y: number;      // 0-1 normalized
      width: number;  // 0-1 normalized
      height: number; // 0-1 normalized
    };
    category: ItemCategory;
    confidence: number;
    attributes?: {
      color?: string;
      pattern?: string;
      style?: string;
    };
  }>;
  processingTime: number;
  error?: string;
}
```

**Processing Pipeline**:
```
Image Input
    ↓
[Pre-processing]
- Resize if too large (max 2048px)
- Normalize format (JPEG)
- Generate thumbnail
    ↓
[Object Detection]
- Fashion item detection model
- Bounding box extraction
    ↓
[Classification]
- Category classification
- Attribute extraction (color, pattern)
    ↓
[Post-processing]
- Non-max suppression
- Confidence filtering
- Coordinate normalization
    ↓
Detection Results
```

#### Implementation Options

**Option A: Google Cloud Vision + Custom Model**
```typescript
// lib/ai/visionApi.ts
import vision from '@google-cloud/vision';

async function detectFashionItems(imageUrl: string): Promise<DetectionResponse> {
  const client = new vision.ImageAnnotatorClient();

  // Object detection
  const [objectResult] = await client.objectLocalization(imageUrl);

  // Filter to fashion items
  const fashionItems = objectResult.localizedObjectAnnotations
    .filter(obj => FASHION_CATEGORIES.includes(obj.name))
    .map(obj => ({
      id: generateId(),
      bbox: normalizeVertices(obj.boundingPoly.normalizedVertices),
      category: mapToCategory(obj.name),
      confidence: obj.score,
    }));

  return { success: true, detections: fashionItems };
}
```

**Option B: Custom TensorFlow Model**
```typescript
// lib/ai/customModel.ts
import * as tf from '@tensorflow/tfjs-node';

const MODEL_PATH = 'gs://decoded-models/fashion-detection/v1';
let model: tf.GraphModel;

async function loadModel() {
  if (!model) {
    model = await tf.loadGraphModel(MODEL_PATH);
  }
  return model;
}

async function detectFashionItems(imageBuffer: Buffer): Promise<DetectionResponse> {
  const model = await loadModel();
  const tensor = tf.node.decodeImage(imageBuffer, 3);
  const predictions = await model.predict(tensor);
  // Process predictions...
}
```

#### Files to Create/Modify
- `lib/ai/visionApi.ts`
- `lib/ai/detection.ts`
- `lib/ai/classification.ts`
- `app/api/ai/detect/route.ts`

---

### S-02 Scraper Engine

- **Description**: Parse product metadata from shopping site URLs
- **Priority**: P0 (Internal)
- **Status**: Not Started
- **Dependencies**: None

#### Acceptance Criteria
- [ ] Accept shopping URL input
- [ ] Extract: product name, brand, price, currency, image
- [ ] Support 10+ major shopping sites
- [ ] Handle JavaScript-rendered pages
- [ ] Respect robots.txt
- [ ] Rate limiting per domain
- [ ] Caching for repeated URLs
- [ ] Graceful degradation on failure

#### Technical Specification

**API Contract**:
```typescript
// POST /api/scrape
interface ScrapeRequest {
  url: string;
  forceRefresh?: boolean;
}

interface ScrapeResponse {
  success: boolean;
  data?: {
    productName: string;
    brand: string;
    price: number;
    currency: string;
    imageUrl: string;
    description?: string;
    originalUrl: string;
    scrapedAt: Date;
  };
  error?: string;
  cached?: boolean;
}
```

**Site Configurations**:
```typescript
// lib/scraper/sites/musinsa.ts
const musinsaConfig: SiteConfig = {
  domain: 'musinsa.com',
  selectors: {
    productName: '.product_title',
    brand: '.product_article_contents a',
    price: '.product_article_price .price',
    image: '.product_img img',
  },
  priceParser: (text) => parseInt(text.replace(/[^0-9]/g, '')),
  currency: 'KRW',
};

// lib/scraper/sites/index.ts
const siteConfigs: Record<string, SiteConfig> = {
  'musinsa.com': musinsaConfig,
  '29cm.co.kr': cm29Config,
  'farfetch.com': farfetchConfig,
  // ...
};
```

**Scraper Implementation**:
```typescript
// lib/scraper/index.ts
import puppeteer from 'puppeteer';

async function scrapeUrl(url: string): Promise<ScrapeResponse> {
  // Check cache first
  const cached = await checkCache(url);
  if (cached) return { success: true, data: cached, cached: true };

  // Get site config
  const domain = new URL(url).hostname.replace('www.', '');
  const config = siteConfigs[domain];

  if (!config) {
    return { success: false, error: 'Unsupported site' };
  }

  // Check robots.txt
  if (!await canScrape(url)) {
    return { success: false, error: 'Blocked by robots.txt' };
  }

  // Rate limit
  await rateLimiter.wait(domain);

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    const data = {
      productName: await page.$eval(config.selectors.productName, el => el.textContent),
      brand: await page.$eval(config.selectors.brand, el => el.textContent),
      price: config.priceParser(await page.$eval(config.selectors.price, el => el.textContent)),
      currency: config.currency,
      imageUrl: await page.$eval(config.selectors.image, el => el.src),
      originalUrl: url,
      scrapedAt: new Date(),
    };

    await browser.close();

    // Cache result
    await setCache(url, data);

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

#### Supported Sites

| Site | Region | Status |
|------|--------|--------|
| Musinsa | Korea | Planned |
| 29CM | Korea | Planned |
| W Concept | Korea | Planned |
| SSF Shop | Korea | Planned |
| Coupang | Korea | Planned |
| Farfetch | Global | Planned |
| SSENSE | Global | Planned |
| Net-a-Porter | Global | Planned |
| Shopbop | Global | Planned |
| Amazon | Global | Planned |

#### Files to Create/Modify
- `lib/scraper/index.ts`
- `lib/scraper/sites/*.ts` - Per-site configs
- `lib/scraper/cache.ts`
- `lib/scraper/rateLimiter.ts`
- `app/api/scrape/route.ts`

---

### S-03 Deep Link Generator

- **Description**: Convert shopping URLs to affiliate tracked links
- **Priority**: P0 (Internal)
- **Status**: Not Started
- **Dependencies**: Affiliate network partnerships

#### Acceptance Criteria
- [ ] Convert direct URLs to affiliate URLs
- [ ] Support multiple affiliate networks
- [ ] Track click attribution (user, item)
- [ ] Generate short URLs
- [ ] Handle expired/invalid affiliate links
- [ ] Fallback to direct link if affiliate unavailable

#### Technical Specification

**API Contract**:
```typescript
interface GenerateLinkRequest {
  originalUrl: string;
  itemId: string;
  userId?: string;
  campaign?: string;
}

interface GenerateLinkResponse {
  trackedUrl: string;
  shortUrl: string;
  affiliateNetwork?: string;
  expiresAt?: Date;
}
```

**Affiliate Network Integration**:
```typescript
// lib/affiliate/networks/index.ts
interface AffiliateNetwork {
  name: string;
  supportedDomains: string[];
  generateLink: (url: string, params: TrackingParams) => string;
}

const networks: AffiliateNetwork[] = [
  {
    name: 'linkprice',
    supportedDomains: ['musinsa.com', '29cm.co.kr'],
    generateLink: (url, params) => {
      return `https://click.linkprice.com/click.php?m=decoded&a=${params.itemId}&p=${encodeURIComponent(url)}`;
    },
  },
  // ... more networks
];
```

#### Files to Create/Modify
- `lib/affiliate/index.ts`
- `lib/affiliate/networks/*.ts`
- `lib/affiliate/shortener.ts`
- `app/api/links/generate/route.ts`

---

### S-04 Hierarchical DB Management

- **Description**: Maintain Category-Media-Cast-Item relationships
- **Priority**: P0 (Internal)
- **Status**: Partial (basic tables exist)
- **Dependencies**: Database setup

#### Acceptance Criteria
- [ ] Category table with enum types
- [ ] Media table with category FK
- [ ] Cast table with media junction
- [ ] Context type enum
- [ ] Post metadata columns (media_id, context_type)
- [ ] Post-Cast junction table
- [ ] Efficient queries for hierarchical filtering
- [ ] Materialized views for filter counts

#### Database Schema

See [data-models.md](./data-models.md) for complete schema.

**Key Relationships**:
```
Category (enum)
    ↓ 1:N
Media
    ↓ N:M (media_cast)
Cast
    ↓ N:M (post_cast)
Post
    ↓ 1:N (post_image)
Image
    ↓ 1:N
Item
```

**Materialized Views**:
```sql
-- Filter counts by category
CREATE MATERIALIZED VIEW filter_counts_category AS
SELECT
  m.category,
  COUNT(DISTINCT p.id) as post_count,
  COUNT(DISTINCT i.id) as item_count
FROM media m
JOIN post p ON p.media_id = m.id
JOIN post_image pi ON pi.post_id = p.id
JOIN image img ON img.id = pi.image_id
JOIN item i ON i.image_id = img.id
GROUP BY m.category;

-- Refresh periodically
CREATE OR REPLACE FUNCTION refresh_filter_counts()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW filter_counts_category;
  REFRESH MATERIALIZED VIEW filter_counts_media;
  REFRESH MATERIALIZED VIEW filter_counts_cast;
END;
$$ LANGUAGE plpgsql;
```

#### Files to Create/Modify
- `lib/supabase/migrations/xxx_hierarchical_structure.sql`
- `lib/supabase/views/filter_counts.sql`
- `lib/supabase/functions/refresh_counts.sql`

---

### S-05 Click Tracker

- **Description**: Log and analyze affiliate link clicks
- **Priority**: P1 (Internal)
- **Status**: Not Started
- **Dependencies**: S-03 (Deep Link Generator)

#### Acceptance Criteria
- [ ] Log all affiliate link clicks
- [ ] Track: user, item, timestamp, source
- [ ] Detect and filter bot/fraud clicks
- [ ] Real-time click counting
- [ ] Attribution to contributors
- [ ] Conversion tracking webhook

#### Technical Specification

**Click Event Schema**:
```typescript
interface ClickEvent {
  id: string;
  itemId: string;
  userId?: string;
  sessionId: string;
  ipHash: string;
  userAgent: string;
  referrer?: string;
  sourcePostId?: string;
  clickedAt: Date;
  affiliateNetwork?: string;
  isConverted: boolean;
  convertedAt?: Date;
  orderValue?: number;
}
```

**Click Flow**:
```
User clicks "Buy" button
    ↓
Client calls /api/track/click
    ↓
Server logs click event
    ↓
Server generates tracked redirect URL
    ↓
Client redirects to affiliate link
    ↓
[Later] Affiliate sends conversion webhook
    ↓
Server updates click with conversion data
```

**Fraud Detection**:
```typescript
// lib/tracking/fraudDetection.ts
interface FraudSignals {
  rapidClicks: boolean;        // > 5 clicks in 1 minute
  knownBotUserAgent: boolean;
  suspiciousIpPattern: boolean;
  noReferrer: boolean;
  headlessBrowser: boolean;
}

async function isLikelyFraud(click: ClickEvent): Promise<boolean> {
  const signals = await checkFraudSignals(click);
  const fraudScore = calculateFraudScore(signals);
  return fraudScore > 0.7;
}
```

#### API Endpoints
```
POST /api/track/click
  body: { itemId, sourcePostId }
  response: { redirectUrl }

POST /api/webhooks/affiliate
  body: { clickId, orderValue, commission }
```

#### Files to Create/Modify
- `lib/tracking/clickTracker.ts`
- `lib/tracking/fraudDetection.ts`
- `app/api/track/click/route.ts`
- `app/api/webhooks/affiliate/route.ts`

---

### S-06 Reward Batch

- **Description**: Calculate and distribute earnings to contributors
- **Priority**: P2 (Internal)
- **Status**: Not Started
- **Dependencies**: S-05 (Click Tracker), U-01 (User System)

#### Acceptance Criteria
- [ ] Daily batch job to calculate rewards
- [ ] Revenue share rules (e.g., 70% to contributor)
- [ ] Minimum payout threshold
- [ ] Pending period for conversions (e.g., 30 days)
- [ ] Handle refunds/chargebacks
- [ ] Audit trail for all calculations

#### Technical Specification

**Reward Calculation**:
```typescript
// lib/rewards/calculator.ts
interface RewardConfig {
  contributorShare: number;    // 0.7 (70%)
  minimumPayout: number;       // 10000 (₩10,000)
  pendingDays: number;         // 30
}

async function calculateDailyRewards(date: Date) {
  // Get all conversions from (date - pendingDays)
  const conversions = await getConfirmedConversions(
    subDays(date, config.pendingDays)
  );

  for (const conversion of conversions) {
    // Find contributor (item uploader)
    const contributor = await getItemContributor(conversion.itemId);

    // Calculate share
    const reward = {
      userId: contributor.id,
      type: 'conversion',
      amount: conversion.commission * config.contributorShare,
      itemId: conversion.itemId,
      clickId: conversion.clickId,
      status: 'confirmed',
    };

    await createReward(reward);
    await updateUserEarnings(contributor.id, reward.amount);
  }
}
```

**Batch Job Schedule**:
```typescript
// Run daily at 3 AM KST
const CRON_SCHEDULE = '0 3 * * *';

// lib/rewards/batch.ts
async function runDailyRewardBatch() {
  const date = new Date();

  logger.info('Starting reward batch', { date });

  try {
    await calculateDailyRewards(date);
    await updateRankings(date);
    await sendRewardNotifications();

    logger.info('Reward batch completed');
  } catch (error) {
    logger.error('Reward batch failed', { error });
    await alertOps(error);
  }
}
```

#### Files to Create/Modify
- `lib/rewards/calculator.ts`
- `lib/rewards/batch.ts`
- `lib/rewards/notifications.ts`
- `app/api/cron/rewards/route.ts` (Vercel Cron)

---

### S-07 Context-based Badge System

- **Description**: Award badges to users based on contribution to specific tags
- **Priority**: P1 (Internal)
- **Status**: Not Started
- **Dependencies**: S-06 (Reward Batch), Contribution tracking

#### Acceptance Criteria
- [ ] Define badge criteria per tag
- [ ] Track user contributions per tag
- [ ] Award badges when criteria met
- [ ] Badge types: Expert, Master, Pioneer
- [ ] Weekly/Monthly recalculation
- [ ] Badge display on profile
- [ ] Notification when badge earned

#### Technical Specification

**Badge Criteria**:
```typescript
interface BadgeCriteria {
  type: 'expert' | 'master' | 'pioneer';
  targetType: 'media' | 'cast' | 'category';
  targetId?: string;

  rules: {
    minContributions: number;     // Minimum posts/answers
    minAcceptRate?: number;       // Minimum accuracy (0-1)
    timeWindow?: 'weekly' | 'monthly' | 'allTime';
    rankPosition?: number;        // Top N position
  };
}

// Example badges
const badgeDefinitions: BadgeCriteria[] = [
  {
    type: 'expert',
    targetType: 'cast',
    targetId: 'jennie-uuid',
    rules: {
      minContributions: 20,
      minAcceptRate: 0.8,
      timeWindow: 'allTime',
    },
    title: 'JENNIE Fashion Expert',
    titleKo: '제니 패션 전문가',
  },
  {
    type: 'master',
    targetType: 'media',
    targetId: 'blackpink-uuid',
    rules: {
      minContributions: 50,
      rankPosition: 1,
      timeWindow: 'monthly',
    },
    title: 'BLACKPINK Master',
    titleKo: 'BLACKPINK 마스터',
  },
];
```

**Badge Calculation**:
```typescript
// lib/badges/calculator.ts
async function calculateBadges(userId: string) {
  const stats = await getUserContributionStats(userId);

  for (const badge of badgeDefinitions) {
    const qualifies = await checkBadgeCriteria(userId, badge, stats);

    if (qualifies) {
      const existing = await getUserBadge(userId, badge.id);
      if (!existing) {
        await awardBadge(userId, badge.id, stats);
        await notifyBadgeEarned(userId, badge);
      }
    }
  }
}
```

#### Files to Create/Modify
- `lib/badges/definitions.ts`
- `lib/badges/calculator.ts`
- `lib/badges/notifications.ts`
- `app/api/cron/badges/route.ts`

---

### S-08 Contributor Ranking

- **Description**: Calculate and display rankings globally and per-tag
- **Priority**: P1 (Internal)
- **Status**: Not Started
- **Dependencies**: Contribution tracking

#### Acceptance Criteria
- [ ] Global ranking by total contributions
- [ ] Per-media ranking (e.g., "This week's BTS #1")
- [ ] Per-cast ranking
- [ ] Weekly and monthly periods
- [ ] Points calculation (posts, answers, votes received)
- [ ] Tie-breaking rules
- [ ] Historical ranking data

#### Technical Specification

**Ranking Calculation**:
```typescript
interface RankingConfig {
  points: {
    post: number;           // 10 points per post
    acceptedAnswer: number; // 5 points per accepted answer
    voteReceived: number;   // 1 point per vote
  };
  periods: ('weekly' | 'monthly' | 'allTime')[];
  scopes: ('global' | 'media' | 'cast')[];
}

async function calculateRankings(period: string, scope: string, scopeId?: string) {
  const startDate = getPeriodStart(period);

  const contributions = await getContributions({
    startDate,
    scope,
    scopeId,
  });

  // Calculate points per user
  const userPoints = contributions.reduce((acc, c) => {
    const points =
      c.type === 'post' ? config.points.post :
      c.type === 'answer' && c.accepted ? config.points.acceptedAnswer :
      c.type === 'vote_received' ? config.points.voteReceived : 0;

    acc[c.userId] = (acc[c.userId] || 0) + points;
    return acc;
  }, {});

  // Sort and assign ranks
  const ranked = Object.entries(userPoints)
    .sort(([, a], [, b]) => b - a)
    .map(([userId, points], index) => ({
      userId,
      points,
      rank: index + 1,
      period,
      scope,
      scopeId,
      calculatedAt: new Date(),
    }));

  // Store rankings
  await upsertRankings(ranked);
}
```

**Ranking Display**:
```typescript
// GET /api/rankings?scope=media&scopeId=xxx&period=weekly
interface RankingResponse {
  rankings: Array<{
    rank: number;
    user: {
      id: string;
      displayName: string;
      avatarUrl: string;
    };
    points: number;
    contributions: number;
  }>;
  userRank?: {
    rank: number;
    points: number;
  };
  period: string;
  scope: string;
}
```

#### Files to Create/Modify
- `lib/rankings/calculator.ts`
- `lib/rankings/points.ts`
- `app/api/rankings/route.ts`
- `app/api/cron/rankings/route.ts`

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Routes (/api/*)                         │
├─────────────────────────────────────────────────────────────────┤
│  /ai/detect    │  /scrape      │  /track/click  │  /rankings   │
└─────────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   Vision API    │  │    Scraper      │  │   Click Tracker │
│   (S-01)        │  │    (S-02)       │  │   (S-05)        │
└─────────────────┘  └─────────────────┘  └─────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Supabase (PostgreSQL)                         │
├─────────────────────────────────────────────────────────────────┤
│  media  │  cast  │  post  │  item  │  user  │  reward  │  ...  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Background Jobs (Cron)                      │
├─────────────────────────────────────────────────────────────────┤
│  Reward Batch (S-06)  │  Badge Calc (S-07)  │  Rankings (S-08)  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Migration Path

### Phase 1: Database Structure
1. Create media, cast, junction tables
2. Add metadata columns to post
3. Create materialized views

### Phase 2: AI & Scraping
1. Set up Vision API integration
2. Build scraper with initial sites
3. Create detection pipeline

### Phase 3: Tracking & Links
1. Implement click tracker
2. Build affiliate link generator
3. Set up conversion webhooks

### Phase 4: Gamification
1. Implement reward batch
2. Build badge system
3. Create ranking calculations

---

## Monitoring & Alerts

- Vision API latency/error rate
- Scraper success rate per site
- Click fraud detection rate
- Reward calculation anomalies
- Ranking job completion
