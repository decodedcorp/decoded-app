/**
 * Infinity Quilt Grid - Cursor Utilities
 * 
 * Base64URL 기반 커서 인코딩/디코딩
 * 실서버 API와 호환되는 커서 형식 제공
 */

import type { CursorInfo } from '../types/card'

/**
 * Base64URL 인코딩 (URL-safe)
 * 표준 Base64에서 +, /, = 문자를 URL-safe 문자로 변환
 */
function base64UrlEncode(str: string): string {
  // UTF-8 문자열을 Base64로 인코딩 (modern approach)
  const utf8Bytes = new TextEncoder().encode(str)
  const base64 = btoa(String.fromCharCode(...utf8Bytes))
  
  // URL-safe 문자로 변환
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '') // 패딩 제거
}

/**
 * Base64URL 디코딩
 */
function base64UrlDecode(str: string): string {
  // URL-safe 문자를 표준 Base64 문자로 복원
  let base64 = str
    .replace(/-/g, '+')
    .replace(/_/g, '/')
  
  // 패딩 복원 (4의 배수가 되도록)
  const padLength = (4 - (base64.length % 4)) % 4
  base64 += '='.repeat(padLength)
  
  try {
    // Base64를 UTF-8 문자열로 디코딩 (modern approach)
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return new TextDecoder().decode(bytes)
  } catch (error) {
    throw new Error(`Invalid base64url string: ${str}`)
  }
}

/**
 * 커서 정보를 Base64URL 문자열로 인코딩
 */
export function encodeCursor(cursorInfo: CursorInfo): string {
  try {
    const jsonString = JSON.stringify({
      createdAt: cursorInfo.createdAt,
      id: cursorInfo.id
    })
    
    return base64UrlEncode(jsonString)
  } catch (error) {
    throw new Error(`Failed to encode cursor: ${error}`)
  }
}

/**
 * Base64URL 문자열을 커서 정보로 디코딩
 */
export function decodeCursor(cursor: string): CursorInfo {
  if (!cursor || typeof cursor !== 'string') {
    throw new Error('Cursor must be a non-empty string')
  }
  
  try {
    const jsonString = base64UrlDecode(cursor)
    const parsed = JSON.parse(jsonString)
    
    // 필수 필드 검증
    if (!parsed.createdAt || !parsed.id) {
      throw new Error('Cursor must contain createdAt and id fields')
    }
    
    // ISO 8601 날짜 형식 검증
    const date = new Date(parsed.createdAt)
    if (isNaN(date.getTime())) {
      throw new Error('Cursor createdAt must be a valid ISO 8601 date')
    }
    
    return {
      createdAt: parsed.createdAt,
      id: parsed.id
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to decode cursor: ${error.message}`)
    }
    throw new Error(`Failed to decode cursor: ${error}`)
  }
}

/**
 * 커서 유효성 검증
 */
export function isValidCursor(cursor: string): boolean {
  try {
    decodeCursor(cursor)
    return true
  } catch {
    return false
  }
}

/**
 * 두 커서를 비교하여 순서 결정
 * @returns -1: cursor1이 이전, 0: 동일, 1: cursor1이 이후
 */
export function compareCursors(cursor1: string, cursor2: string): number {
  try {
    const info1 = decodeCursor(cursor1)
    const info2 = decodeCursor(cursor2)
    
    // 먼저 createdAt으로 비교 (DESC 정렬이므로 더 최신이 작음)
    const date1 = new Date(info1.createdAt).getTime()
    const date2 = new Date(info2.createdAt).getTime()
    
    if (date1 > date2) return -1
    if (date1 < date2) return 1
    
    // createdAt이 같으면 id로 비교 (DESC 정렬)
    if (info1.id > info2.id) return -1
    if (info1.id < info2.id) return 1
    
    return 0
  } catch {
    // 디코딩 실패 시 문자열 비교로 폴백
    return cursor1.localeCompare(cursor2)
  }
}

/**
 * 카드로부터 커서 생성
 */
export function createCursorFromCard(card: { createdAt: string; id: string }): string {
  return encodeCursor({
    createdAt: card.createdAt,
    id: card.id
  })
}

/**
 * 현재 시간 기반 커서 생성 (테스트용)
 */
export function createCurrentCursor(id: string = 'current'): string {
  return encodeCursor({
    createdAt: new Date().toISOString(),
    id
  })
}

/**
 * 커서 디버깅용 정보 추출
 */
export function debugCursor(cursor: string): {
  isValid: boolean
  decoded?: CursorInfo
  error?: string
} {
  try {
    const decoded = decodeCursor(cursor)
    return {
      isValid: true,
      decoded
    }
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

// 개발/테스트용 유틸리티
export const CursorUtils = {
  encode: encodeCursor,
  decode: decodeCursor,
  isValid: isValidCursor,
  compare: compareCursors,
  fromCard: createCursorFromCard,
  current: createCurrentCursor,
  debug: debugCursor
} as const