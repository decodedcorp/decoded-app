/**
 * Infinity Quilt Grid - Card Type Definitions
 * 
 * 실서버 호환을 위한 고정 타입 정의
 * 변경 시 실서버 API 스펙과 동기화 필요
 */

export type CardType = 'image' | 'video' | 'card'

export type CardPriority = 'high' | 'medium' | 'low'

export interface CardAuthor {
  id: string
  name: string
  avatar?: string
  verified?: boolean
}

export interface CardMetadata {
  title?: string
  description?: string
  tags?: string[]
  category?: string
  author?: CardAuthor
  
  // Interaction data
  likeCount: number
  commentCount: number
  viewCount: number
  shareCount: number
  isLiked: boolean
  isSaved: boolean
  
  // SEO and discovery
  seoTitle?: string
  seoDescription?: string
  keywords?: string[]
}

export interface Card {
  // Primary identifiers
  id: string
  createdAt: string // ISO 8601
  updatedAt: string // ISO 8601
  
  // Card type and layout
  type: CardType
  priority: CardPriority
  
  // Layout dimensions (CSS pixels)
  width: number
  height: number
  
  // Grid span (grid units)
  spanX: number
  spanY: number
  
  // Image/media properties
  cdnBase: string // Base URL for CDN transformations
  thumbnailUrl: string // Pre-optimized thumbnail
  originalUrl: string // Original high-res URL
  
  // Visual optimization
  avgColor: string // Hex color for placeholder (#RRGGBB)
  blurhash: string // BlurHash string for placeholder
  aspectRatio: number // width / height
  
  // Content metadata
  metadata: CardMetadata
  
  // Status and visibility
  status: 'published' | 'draft' | 'archived'
  visibility: 'public' | 'private' | 'unlisted'
  
  // Performance hints
  loadPriority?: 'high' | 'normal' | 'low'
  preloadHint?: boolean
}

export interface CursorInfo {
  createdAt: string
  id: string
}

export interface CardsRequest {
  limit?: number // Default: 36, Max: 50
  cursor?: string // Base64URL encoded cursor
  direction?: 'forward' | 'backward' // Default: forward
  
  // Filtering (for future API compatibility)
  category?: string
  tags?: string[]
  author?: string
  type?: CardType
  priority?: CardPriority
  
  // Sorting (for future API compatibility)
  sortBy?: 'latest' | 'popular' | 'trending' | 'random'
  timeRange?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all'
}

export interface CardsResponse {
  items: Card[]
  hasMore: boolean
  nextCursor?: string
  prevCursor?: string
  
  // Response metadata
  totalCount?: number
  responseTime?: number // ms
  cacheHit?: boolean
  
  // Pagination info
  currentPage?: number
  pageSize?: number
}

export interface CardPlacement {
  card: Card
  left: number
  top: number
  width: number
  height: number
  zIndex?: number
}

export interface GridLayoutConfig {
  columns: number
  cellWidth: number
  cellHeight: number
  gap: number
  containerWidth: number
}

export interface ViewportInfo {
  width: number
  height: number
  scrollTop: number
  scrollLeft: number
  devicePixelRatio: number
}

// Error types for robust error handling
export interface CardError {
  code: string
  message: string
  details?: Record<string, unknown>
  retryable: boolean
}

export interface CardsErrorResponse {
  error: CardError
  requestId?: string
  timestamp: string
}

// Utility types for API responses
export type CardsApiResponse = CardsResponse | CardsErrorResponse

export function isCardsError(response: CardsApiResponse): response is CardsErrorResponse {
  return 'error' in response
}

// Constants for validation and defaults
export const CARD_CONSTANTS = {
  // Request limits
  DEFAULT_LIMIT: 36,
  MAX_LIMIT: 50,
  MIN_LIMIT: 1,
  
  // Grid constraints
  MIN_SPAN_X: 1,
  MAX_SPAN_X: 6,
  MIN_SPAN_Y: 1,
  MAX_SPAN_Y: 4,
  
  // Image constraints
  MIN_WIDTH: 100,
  MAX_WIDTH: 2000,
  MIN_HEIGHT: 100,
  MAX_HEIGHT: 2000,
  
  // Performance
  DEFAULT_DPR_CAP: 2,
  INTERSECTION_THRESHOLD: 0.1,
  OVERSCAN_PIXELS: 800,
  
  // Cache
  CACHE_TTL_MS: 5 * 60 * 1000, // 5 minutes
  MAX_CACHE_SIZE: 1000
} as const

// Type guards for runtime validation
export function isValidCard(obj: unknown): obj is Card {
  if (!obj || typeof obj !== 'object') return false
  
  const card = obj as Partial<Card>
  
  return !!(
    card.id &&
    card.createdAt &&
    card.type &&
    typeof card.width === 'number' &&
    typeof card.height === 'number' &&
    typeof card.spanX === 'number' &&
    typeof card.spanY === 'number' &&
    card.cdnBase &&
    card.avgColor &&
    card.blurhash &&
    card.metadata
  )
}

export function isValidCardsResponse(obj: unknown): obj is CardsResponse {
  if (!obj || typeof obj !== 'object') return false
  
  const response = obj as Partial<CardsResponse>
  
  return !!(
    Array.isArray(response.items) &&
    response.items.every(isValidCard) &&
    typeof response.hasMore === 'boolean'
  )
}