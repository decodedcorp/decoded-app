/**
 * Main Domain - Root Exports
 * 
 * Infinity Quilt Grid 메인 페이지 관련 모든 기능
 * 실서버 전환 시 data layer만 교체하면 됨
 */

// Types
export type {
  Card,
  CardType,
  CardPriority,
  CardAuthor,
  CardMetadata,
  CursorInfo,
  CardsRequest,
  CardsResponse,
  CardPlacement,
  GridLayoutConfig,
  ViewportInfo
} from './types'

export {
  CARD_CONSTANTS,
  isValidCard,
  isValidCardsResponse,
  isCardsError
} from './types'

// Hooks  
export {
  useCards,
  useCard,
  useCardsStats,
  useInfiniteScroll,
  useCardPreloading,
  cardsQueryKeys
} from './hooks'

// Data Providers
export {
  CardsProvider
} from './data'

// Utilities
export {
  encodeCursor,
  decodeCursor,
  isValidCursor,
  compareCursors,
  createCursorFromCard,
  CursorUtils
} from './utils'

// Mock Data (개발용)
export {
  getSeedCards,
  getSeedStats,
  MockFactory
} from './mocks'

// Components
export { MainPage } from './components'