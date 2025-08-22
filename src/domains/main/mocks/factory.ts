/**
 * Infinity Quilt Grid - Mock Data Factory
 * 
 * 800-1000개 시드 데이터 생성
 * AR(Aspect Ratio) → span 규칙 적용
 * 다양한 카드 타입 및 메타데이터 분포
 */

import type { Card, CardType, CardPriority, CardAuthor } from '../types/card'

// 시드 데이터 생성을 위한 상수
const SEED_CONFIG = {
  TOTAL_CARDS: 950, // 800-1000 범위 내
  BASE_DATE: new Date('2024-01-01'),
  
  // 카드 타입 분포 (%)
  TYPE_DISTRIBUTION: {
    image: 85,
    video: 10,
    card: 5
  } as const,
  
  // 우선순위 분포 (%)
  PRIORITY_DISTRIBUTION: {
    high: 15,
    medium: 70,
    low: 15
  } as const,
  
  // 이미지 크기 범위
  DIMENSIONS: {
    MIN_WIDTH: 200,
    MAX_WIDTH: 800,
    MIN_HEIGHT: 200,
    MAX_HEIGHT: 1200
  } as const,
  
  // Aspect Ratio 범위 및 span 매핑
  ASPECT_RATIOS: [
    { min: 0.5, max: 0.75, spanX: 1, spanY: 2 },   // 세로형 (1:2)
    { min: 0.75, max: 1.0, spanX: 1, spanY: 1 },   // 정사각형 근사 (1:1)
    { min: 1.0, max: 1.5, spanX: 2, spanY: 1 },    // 가로형 (2:1)
    { min: 1.5, max: 2.5, spanX: 2, spanY: 1 },    // 와이드 (2:1)
    { min: 2.5, max: 4.0, spanX: 3, spanY: 1 }     // 파노라마 (3:1)
  ] as const
} as const

// 더미 작성자 데이터
const MOCK_AUTHORS: CardAuthor[] = [
  { id: 'author-1', name: 'Alex Chen', avatar: 'https://picsum.photos/100/100?random=1', verified: true },
  { id: 'author-2', name: 'Sarah Kim', avatar: 'https://picsum.photos/100/100?random=2', verified: false },
  { id: 'author-3', name: 'Miguel Rodriguez', avatar: 'https://picsum.photos/100/100?random=3', verified: true },
  { id: 'author-4', name: 'Yuki Tanaka', avatar: 'https://picsum.photos/100/100?random=4', verified: false },
  { id: 'author-5', name: 'Emma Thompson', avatar: 'https://picsum.photos/100/100?random=5', verified: true },
  { id: 'author-6', name: 'David Park', avatar: 'https://picsum.photos/100/100?random=6', verified: false },
  { id: 'author-7', name: 'Priya Sharma', avatar: 'https://picsum.photos/100/100?random=7', verified: true },
  { id: 'author-8', name: 'Jean Dubois', avatar: 'https://picsum.photos/100/100?random=8', verified: false }
]

// 카테고리 및 태그 풀
const CATEGORIES = [
  'fashion', 'interior', 'art', 'photography', 'architecture', 
  'travel', 'food', 'nature', 'technology', 'lifestyle'
] as const

const TAG_POOL = [
  'minimal', 'modern', 'vintage', 'colorful', 'monochrome', 'abstract',
  'portrait', 'landscape', 'urban', 'nature', 'macro', 'street',
  'contemporary', 'classic', 'experimental', 'geometric', 'organic',
  'warm', 'cool', 'bright', 'dark', 'soft', 'bold'
] as const

// 색상 팔레트 (avgColor용)
const COLOR_PALETTE = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
  '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
  '#10AC84', '#EE5A24', '#0ABDE3', '#3742FA', '#2F3542',
  '#A3CB38', '#C8D6E5', '#8395A7', '#576574', '#222F3E'
] as const

// BlurHash 샘플 (실제로는 이미지별로 생성되어야 함)
const BLURHASH_SAMPLES = [
  'LKO2?U%2Tw=w]~RBVZRi};RPxuwH',
  'LBAdAqof00WCqZj[PDay9}ayayay',
  'LDA,+,%1Igay.TfkR*ay0LfkxaWB',
  'LFEETZ~qT0WB_3ofRjWBozfQayf6',
  'L6P?o2WB2yk8pyo0adR*.7kCMdnj',
  'LFHLkR?bWANz.0e.RPj[_Nt7WqNH',
  'L35#l$~p4:IV?H%1M|%L9aWBR*Rj',
  'LDA8:FofRiM|IlNGofay~qWBRjxu'
] as const

/**
 * 랜덤 유틸리티 함수들
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomChoice<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function randomChoices<T>(array: readonly T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

function randomBoolean(probability: number = 0.5): boolean {
  return Math.random() < probability
}

/**
 * 가중치 기반 타입 선택
 */
function selectCardType(): CardType {
  const rand = Math.random() * 100
  
  if (rand < SEED_CONFIG.TYPE_DISTRIBUTION.image) return 'image'
  if (rand < SEED_CONFIG.TYPE_DISTRIBUTION.image + SEED_CONFIG.TYPE_DISTRIBUTION.video) return 'video'
  return 'card'
}

/**
 * 가중치 기반 우선순위 선택
 */
function selectPriority(): CardPriority {
  const rand = Math.random() * 100
  
  if (rand < SEED_CONFIG.PRIORITY_DISTRIBUTION.high) return 'high'
  if (rand < SEED_CONFIG.PRIORITY_DISTRIBUTION.high + SEED_CONFIG.PRIORITY_DISTRIBUTION.medium) return 'medium'
  return 'low'
}

/**
 * Aspect Ratio 기반 span 계산
 */
function calculateSpan(aspectRatio: number): { spanX: number; spanY: number } {
  for (const ar of SEED_CONFIG.ASPECT_RATIOS) {
    if (aspectRatio >= ar.min && aspectRatio < ar.max) {
      return { spanX: ar.spanX, spanY: ar.spanY }
    }
  }
  
  // 기본값 (정사각형)
  return { spanX: 1, spanY: 1 }
}

/**
 * 랜덤 날짜 생성 (최근 1년 이내)
 */
function generateRandomDate(index: number): string {
  const baseTime = SEED_CONFIG.BASE_DATE.getTime()
  const now = Date.now()
  const timeRange = now - baseTime
  
  // 최신 데이터가 더 많이 나오도록 가중치 적용
  const weight = Math.pow(Math.random(), 0.3) // 0.3 거듭제곱으로 최신 편향
  const randomTime = baseTime + (timeRange * weight)
  
  return new Date(randomTime).toISOString()
}

/**
 * 인터랙션 데이터 생성
 */
function generateInteractionData() {
  const basePopularity = Math.random()
  
  return {
    likeCount: Math.floor(basePopularity * 1000),
    commentCount: Math.floor(basePopularity * 100),
    viewCount: Math.floor(basePopularity * 5000),
    shareCount: Math.floor(basePopularity * 50),
    isLiked: randomBoolean(0.15),
    isSaved: randomBoolean(0.08)
  }
}

/**
 * 단일 카드 생성
 */
function generateCard(index: number): Card {
  const id = `card-${String(index + 1).padStart(4, '0')}`
  const createdAt = generateRandomDate(index)
  const type = selectCardType()
  const priority = selectPriority()
  
  // 이미지 크기 생성
  const width = randomInt(SEED_CONFIG.DIMENSIONS.MIN_WIDTH, SEED_CONFIG.DIMENSIONS.MAX_WIDTH)
  const height = randomInt(SEED_CONFIG.DIMENSIONS.MIN_HEIGHT, SEED_CONFIG.DIMENSIONS.MAX_HEIGHT)
  const aspectRatio = width / height
  const { spanX, spanY } = calculateSpan(aspectRatio)
  
  // CDN URL 생성 (Picsum Photos 사용)
  const imageId = randomInt(1, 1000)
  const cdnBase = `https://picsum.photos/${width}/${height}?random=${imageId}`
  
  // 메타데이터 생성
  const author = randomChoice(MOCK_AUTHORS)
  const category = randomChoice(CATEGORIES)
  const tags = randomChoices(TAG_POOL, randomInt(2, 5))
  const interactions = generateInteractionData()
  
  const card: Card = {
    id,
    createdAt,
    updatedAt: createdAt,
    type,
    priority,
    
    width,
    height,
    spanX,
    spanY,
    
    cdnBase,
    thumbnailUrl: `${cdnBase}&w=400`,
    originalUrl: `${cdnBase}&w=1200`,
    
    avgColor: randomChoice(COLOR_PALETTE),
    blurhash: randomChoice(BLURHASH_SAMPLES),
    aspectRatio,
    
    metadata: {
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} ${type} #${index + 1}`,
      description: `Beautiful ${category} ${type} with ${tags.join(', ')} aesthetic.`,
      tags,
      category,
      author,
      ...interactions
    },
    
    status: randomBoolean(0.95) ? 'published' : 'draft',
    visibility: randomBoolean(0.98) ? 'public' : 'unlisted',
    
    loadPriority: priority === 'high' ? 'high' : 'medium',
    preloadHint: priority === 'high' && randomBoolean(0.3)
  }
  
  return card
}

/**
 * 전체 시드 데이터 생성
 */
export function generateSeedCards(): Card[] {
  const cards: Card[] = []
  
  for (let i = 0; i < SEED_CONFIG.TOTAL_CARDS; i++) {
    cards.push(generateCard(i))
  }
  
  // createdAt 기준 내림차순 정렬 (최신이 먼저)
  // 같은 createdAt인 경우 id 기준 내림차순
  cards.sort((a, b) => {
    if (!a.createdAt || !b.createdAt) return 0;
    const dateCompare = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    if (dateCompare !== 0) return dateCompare
    return b.id.localeCompare(a.id)
  })
  
  return cards
}

/**
 * 시드 데이터 캐시 (메모리 효율성)
 */
let cachedSeedCards: Card[] | null = null

export function getSeedCards(): Card[] {
  if (!cachedSeedCards) {
    cachedSeedCards = generateSeedCards()
    console.log(`Generated ${cachedSeedCards.length} seed cards`)
  }
  
  return cachedSeedCards
}

/**
 * 캐시 초기화 (테스트/개발용)
 */
export function resetSeedCache(): void {
  cachedSeedCards = null
}

/**
 * 시드 데이터 통계 조회
 */
export function getSeedStats() {
  const cards = getSeedCards()
  
  const typeStats = cards.reduce((acc, card) => {
    acc[card.type] = (acc[card.type] || 0) + 1
    return acc
  }, {} as Record<CardType, number>)
  
  const priorityStats = cards.reduce((acc, card) => {
    if (card.priority) {
      acc[card.priority] = (acc[card.priority] || 0) + 1
    }
    return acc
  }, {} as Record<CardPriority, number>)
  
  const spanStats = cards.reduce((acc, card) => {
    const key = `${card.spanX}x${card.spanY}`
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return {
    total: cards.length,
    typeDistribution: typeStats,
    priorityDistribution: priorityStats,
    spanDistribution: spanStats,
    dateRange: {
      oldest: cards[cards.length - 1]?.createdAt,
      newest: cards[0]?.createdAt
    }
  }
}

// 개발/테스트용 유틸리티
export const MockFactory = {
  generate: generateSeedCards,
  get: getSeedCards,
  reset: resetSeedCache,
  stats: getSeedStats,
  config: SEED_CONFIG
} as const