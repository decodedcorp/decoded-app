import React from 'react';
import { ContentItem } from '@/lib/types/content';
import deepEqual from 'fast-deep-equal';

/**
 * 콘텐츠 아이템의 안정적인 키 생성
 * @param item 콘텐츠 아이템
 * @returns 안정적인 키
 */
export function getContentKey(item: ContentItem): string {
  return `${item.id}-${item.status}-${item.date || ''}`;
}

/**
 * 콘텐츠 배열이 실제로 변경되었는지 확인
 * @param prev 이전 콘텐츠 배열
 * @param next 다음 콘텐츠 배열
 * @returns 변경 여부
 */
export function hasContentChanged(prev: ContentItem[], next: ContentItem[]): boolean {
  if (prev.length !== next.length) return true;

  // ID 기반 빠른 비교
  const prevIds = new Set(prev.map((item) => getContentKey(item)));
  const nextIds = new Set(next.map((item) => getContentKey(item)));

  if (prevIds.size !== nextIds.size) return true;

  for (const id of prevIds) {
    if (!nextIds.has(id)) return true;
  }

  // 깊은 비교 (필요한 경우만)
  return !deepEqual(prev, next);
}

/**
 * 콘텐츠 아이템의 중요 속성만 추출하여 비교
 * @param item 콘텐츠 아이템
 * @returns 중요 속성만 포함한 객체
 */
export function getContentComparisonKey(item: ContentItem): Partial<ContentItem> {
  return {
    id: item.id,
    status: item.status,
    title: item.title,
    type: item.type,
    imageUrl: item.imageUrl,
    linkUrl: item.linkUrl,
    date: item.date,
  };
}

/**
 * 콘텐츠 배열을 안정적으로 메모이제이션하기 위한 훅
 * @param contents 콘텐츠 배열
 * @returns 메모이제이션된 콘텐츠 배열
 */
export function useMemoizedContents(contents: ContentItem[]): ContentItem[] {
  const prevContentsRef = React.useRef<ContentItem[] | null>(null);

  return React.useMemo(() => {
    if (prevContentsRef.current && deepEqual(prevContentsRef.current, contents)) {
      return prevContentsRef.current;
    }

    prevContentsRef.current = contents;
    return contents;
  }, [contents]);
}

/**
 * 콘텐츠 필터링 결과를 메모이제이션
 * @param contents 원본 콘텐츠 배열
 * @param filterFn 필터 함수
 * @returns 필터링된 콘텐츠 배열
 */
export function useMemoizedFilteredContents<T>(
  contents: ContentItem[],
  filterFn: (item: ContentItem) => T,
): T[] {
  const prevFilteredRef = React.useRef<{ contents: ContentItem[]; result: T[] } | null>(null);

  return React.useMemo(() => {
    if (prevFilteredRef.current && deepEqual(prevFilteredRef.current.contents, contents)) {
      return prevFilteredRef.current.result;
    }

    const result = contents.map(filterFn);
    prevFilteredRef.current = { contents, result };
    return result;
  }, [contents, filterFn]);
}

/**
 * 콘텐츠 그룹화 결과를 메모이제이션
 * @param contents 콘텐츠 배열
 * @param groupBy 그룹화 함수
 * @returns 그룹화된 콘텐츠
 */
export function useMemoizedGroupedContents<K extends string>(
  contents: ContentItem[],
  groupBy: (item: ContentItem) => K,
): Record<K, ContentItem[]> {
  const prevGroupedRef = React.useRef<{
    contents: ContentItem[];
    result: Record<K, ContentItem[]>;
  } | null>(null);

  return React.useMemo(() => {
    if (prevGroupedRef.current && deepEqual(prevGroupedRef.current.contents, contents)) {
      return prevGroupedRef.current.result;
    }

    const result = contents.reduce((acc, item) => {
      const key = groupBy(item);
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {} as Record<K, ContentItem[]>);

    prevGroupedRef.current = { contents, result };
    return result;
  }, [contents, groupBy]);
}
