/**
 * Infinity Quilt Grid - Cards Provider
 * 
 * 핵심 공급자 함수 - 실서버 전환 시 이 함수만 교체
 * 시드 배열 슬라이싱으로 limit+1 처리하여 hasMore, nextCursor, prevCursor 계산
 */

import type { Card, CardsRequest, CardsResponse } from '../types/card'
import type { CursorInfo } from '../types/card'
import { getSeedCards } from '../mocks/factory'
import { decodeCursor, encodeCursor, createCursorFromCard } from '../utils/cursor'
import { CARD_CONSTANTS } from '../types/card'

/**
 * 카드 필터링 함수
 */
function filterCards(cards: Card[], filters: Partial<CardsRequest>): Card[] {
  let filtered = cards
  
  // 카테고리 필터
  if (filters.category) {
    filtered = filtered.filter(card => 
      card.metadata?.category === filters.category
    )
  }
  
  // 태그 필터
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(card =>
      card.metadata?.tags?.some(tag => filters.tags!.includes(tag))
    )
  }
  
  // 작성자 필터
  if (filters.author) {
    filtered = filtered.filter(card =>
      card.metadata?.author?.id === filters.author
    )
  }
  
  // 타입 필터
  if (filters.type) {
    filtered = filtered.filter(card => card.type === filters.type)
  }
  
  // 우선순위 필터
  if (filters.priority) {
    filtered = filtered.filter(card => card.priority === filters.priority)
  }
  
  return filtered
}

/**
 * 카드 정렬 함수
 */
function sortCards(cards: Card[], sortBy: string = 'latest'): Card[] {
  const sorted = [...cards]
  
  switch (sortBy) {
    case 'latest':
      return sorted.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        const dateCompare = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        if (dateCompare !== 0) return dateCompare
        return b.id.localeCompare(a.id)
      })
      
    case 'popular':
      return sorted.sort((a, b) => {
        const popularityA = (a.metadata?.likeCount || 0) + (a.metadata?.viewCount || 0) * 0.1
        const popularityB = (b.metadata?.likeCount || 0) + (b.metadata?.viewCount || 0) * 0.1
        return popularityB - popularityA
      })
      
    case 'trending':
      // 최근 생성된 것 중 인기있는 것
      const recentThreshold = Date.now() - (7 * 24 * 60 * 60 * 1000) // 7일
      return sorted.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        const aRecent = new Date(a.createdAt).getTime() > recentThreshold
        const bRecent = new Date(b.createdAt).getTime() > recentThreshold
        
        if (aRecent && !bRecent) return -1
        if (!aRecent && bRecent) return 1
        
        const trendingScoreA = aRecent ? 
          ((a.metadata?.likeCount || 0) + (a.metadata?.shareCount || 0) * 2) : 0
        const trendingScoreB = bRecent ? 
          ((b.metadata?.likeCount || 0) + (b.metadata?.shareCount || 0) * 2) : 0
        
        return trendingScoreB - trendingScoreA
      })
      
    case 'random':
      return sorted.sort(() => Math.random() - 0.5)
      
    default:
      return sorted
  }
}

/**
 * 커서 기반으로 카드 찾기
 */
function findCardIndex(cards: Card[], cursor: string): number {
  try {
    const cursorInfo: CursorInfo = decodeCursor(cursor)
    
    return cards.findIndex(card => 
      card.createdAt === cursorInfo.createdAt && card.id === cursorInfo.id
    )
  } catch {
    return -1
  }
}

/**
 * 슬라이싱 범위 계산
 */
function calculateSliceRange(
  cards: Card[], 
  cursor: string | undefined, 
  direction: 'forward' | 'backward',
  limit: number
): { start: number; end: number } {
  if (!cursor) {
    // 첫 페이지
    return { start: 0, end: limit + 1 } // +1 for hasMore check
  }
  
  const cursorIndex = findCardIndex(cards, cursor)
  if (cursorIndex === -1) {
    throw new Error('Invalid cursor: card not found')
  }
  
  if (direction === 'forward') {
    // 다음 페이지 (커서 이후)
    const start = cursorIndex + 1
    const end = start + limit + 1 // +1 for hasMore check
    return { start, end }
  } else {
    // 이전 페이지 (커서 이전)
    const end = cursorIndex
    const start = Math.max(0, end - limit - 1) // -1 for hasPrev check
    return { start, end }
  }
}

/**
 * 메인 카드 공급자 함수
 * 
 * 실서버 전환 시 이 함수만 교체하면 됨
 */
export async function getCards(request: CardsRequest = {}): Promise<CardsResponse> {
  // 시뮬레이션된 네트워크 지연 (개발 환경에서 로딩 상태 테스트용)
  if (process.env.NODE_ENV === 'development') {
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200))
  }
  
  try {
    // 요청 파라미터 검증 및 기본값 설정
    const {
      limit = CARD_CONSTANTS.DEFAULT_LIMIT,
      cursor,
      direction = 'forward',
      category,
      tags,
      author,
      type,
      priority,
      sortBy = 'latest'
    } = request
    
    // limit 검증
    if (limit < CARD_CONSTANTS.MIN_LIMIT || limit > CARD_CONSTANTS.MAX_LIMIT) {
      throw new Error(`Limit must be between ${CARD_CONSTANTS.MIN_LIMIT} and ${CARD_CONSTANTS.MAX_LIMIT}`)
    }
    
    // 시드 데이터 로드
    let allCards = getSeedCards()
    
    // 디버그 로그 추가
    console.log('CardsProvider Debug:', {
      seedCardsLength: allCards.length,
      request,
      firstCard: allCards[0] ? {
        id: allCards[0].id,
        title: allCards[0].metadata?.title,
        type: allCards[0].type
      } : null
    })
    
    // 필터링 적용
    allCards = filterCards(allCards, { category, tags, author, type, priority })
    
    // 정렬 적용
    allCards = sortCards(allCards, sortBy)
    
    // 슬라이싱 범위 계산
    const { start, end } = calculateSliceRange(allCards, cursor, direction, limit)
    
    // 실제 데이터 슬라이싱
    const slicedCards = allCards.slice(start, end)
    
    // hasMore 및 커서 계산
    let items: Card[]
    let hasMore: boolean
    let nextCursor: string | undefined
    let prevCursor: string | undefined
    
    if (direction === 'forward') {
      hasMore = slicedCards.length > limit
      items = hasMore ? slicedCards.slice(0, limit) : slicedCards
      
      // nextCursor: 마지막 아이템 기준
      if (items.length > 0) {
        nextCursor = hasMore ? createCursorFromCard({
          createdAt: items[items.length - 1].createdAt || new Date().toISOString(),
          id: items[items.length - 1].id
        }) : undefined
      }
      
      // prevCursor: 첫 번째 아이템 기준 (첫 페이지가 아닌 경우)
      if (cursor && items.length > 0) {
        prevCursor = createCursorFromCard({
          createdAt: items[0].createdAt || new Date().toISOString(),
          id: items[0].id
        })
      }
    } else {
      // backward direction
      const hasPrev = start > 0
      items = hasPrev ? slicedCards.slice(1) : slicedCards
      hasMore = hasPrev
      
      // 역방향이므로 커서 계산이 반대
      if (items.length > 0) {
        prevCursor = hasPrev ? createCursorFromCard({
          createdAt: items[0].createdAt || new Date().toISOString(),
          id: items[0].id
        }) : undefined
        nextCursor = createCursorFromCard({
          createdAt: items[items.length - 1].createdAt || new Date().toISOString(),
          id: items[items.length - 1].id
        })
      }
    }
    
    const response: CardsResponse = {
      items,
      hasMore,
      nextCursor,
      prevCursor,
      
      // 응답 메타데이터 (개발용)
      totalCount: allCards.length,
      responseTime: process.env.NODE_ENV === 'development' ? 
        Math.round(100 + Math.random() * 200) : undefined,
      cacheHit: false, // Mock에서는 항상 false
      
      // 페이지네이션 정보
      pageSize: limit
    }
    
    return response
  } catch (error) {
    // 에러 처리
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    console.error('Cards provider error:', errorMessage, request)
    
    // 에러 상황에서도 빈 응답 반환 (앱 크래시 방지)
    return {
      items: [],
      hasMore: false,
      totalCount: 0,
      responseTime: 0,
      cacheHit: false
    }
  }
}

/**
 * 단일 카드 조회 (상세 페이지용)
 */
export async function getCard(id: string): Promise<Card | null> {
  if (process.env.NODE_ENV === 'development') {
    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100))
  }
  
  try {
    const allCards = getSeedCards()
    const card = allCards.find(card => card.id === id)
    return card || null
  } catch (error) {
    console.error('Get card error:', error, { id })
    return null
  }
}

/**
 * 카드 통계 조회 (관리자용)
 */
export async function getCardsStats() {
  try {
    const allCards = getSeedCards()
    
    const stats = {
      total: allCards.length,
      published: allCards.filter(c => c.status === 'published').length,
      draft: allCards.filter(c => c.status === 'draft').length,
      
      byType: allCards.reduce((acc, card) => {
        acc[card.type] = (acc[card.type] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      
      byPriority: allCards.reduce((acc, card) => {
        if (card.priority) {
          acc[card.priority] = (acc[card.priority] || 0) + 1
        }
        return acc
      }, {} as Record<string, number>),
      
      averageInteractions: {
        likes: Math.round(allCards.reduce((sum, c) => sum + (c.metadata?.likeCount || 0), 0) / allCards.length),
        comments: Math.round(allCards.reduce((sum, c) => sum + (c.metadata?.commentCount || 0), 0) / allCards.length),
        views: Math.round(allCards.reduce((sum, c) => sum + (c.metadata?.viewCount || 0), 0) / allCards.length)
      }
    }
    
    return stats
  } catch (error) {
    console.error('Get cards stats error:', error)
    return null
  }
}

// 실서버 전환을 위한 환경별 공급자 스위칭
const isProduction = process.env.NODE_ENV === 'production'
const useRealApi = process.env.NEXT_PUBLIC_USE_REAL_API === 'true'

export const CardsProvider = {
  getCards: isProduction && useRealApi ? 
    // TODO: 실서버 연결 시 이 부분을 실제 API 호출로 교체
    getCards : 
    getCards,
    
  getCard: isProduction && useRealApi ?
    // TODO: 실서버 연결 시 이 부분을 실제 API 호출로 교체  
    getCard :
    getCard,
    
  getStats: getCardsStats
} as const