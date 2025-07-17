'use client';

import React, { useState, type ReactElement } from 'react';
import {
  Heart,
  SendHorizonal,
  Download,
  MessageSquareText,
  Bookmark,
} from 'lucide-react';
import { TabType } from '@/components/Header/nav/modal/types/mypage';
import { useTabInfiniteScroll, TabItem } from './useTabInfiniteScroll';
import { ContentCard, ContentItem } from './ContentCard';
import { BoardCard, BoardItem } from './BoardCard';
import { TabHeader } from './TabHeader';

// 활동 탭 컴포넌트
export const ActivityTabs = () => {
  // 탭 및 필터 상태
  const [activeTab, setActiveTab] = useState<TabType>('like');
  const [filter, setFilter] = useState('all');

  // API 엔드포인트
  const API_ENDPOINT = '/api/user/activity';

  // 각 탭에 따른 아이템 타입 가드 함수
  const isImageContent = (item: TabItem): item is ContentItem => {
    return ['like', 'request', 'provide'].includes(item.type || '');
  };

  const isBoardContent = (item: TabItem): item is BoardItem => {
    return ['board', 'comment'].includes(item.type || '');
  };

  // 탭 아이콘 정의
  const filterIcons: Record<TabType, ReactElement> = {
    home: <Heart className="h-3 w-3 mr-1" />,
    like: <Heart className="h-3 w-3 mr-1" />,
    request: <SendHorizonal className="h-3 w-3 mr-1" />,
    provide: <Download className="h-3 w-3 mr-1" />,
    board: <MessageSquareText className="h-3 w-3 mr-1" />,
    comment: <MessageSquareText className="h-3 w-3 mr-1" />,
  };

  // 무한 스크롤 훅 사용
  const { items, loading, error, lastItemRef } = useTabInfiniteScroll<TabItem>({
    tabType: activeTab,
    filter,
    apiEndpoint: API_ENDPOINT,
  });

  // 탭 변경 핸들러
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  // 에러 표시
  if (error) {
    return (
      <div className="p-4 text-red-500 text-center">
        데이터를 불러오는데 오류가 발생했습니다: {error}
      </div>
    );
  }

  return (
    <div>
      {/* 탭 헤더 */}
      <TabHeader
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        filterIcons={filterIcons}
      />

      {/* 콘텐츠 그리드 */}
      <div
        className={
          activeTab === 'board' || activeTab === 'comment'
            ? 'grid gap-3'
            : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'
        }
      >
        {items.length === 0 && !loading ? (
          <div className="col-span-full py-8 text-center text-white/50">
            {activeTab === 'like' && '좋아요한 콘텐츠가 없습니다.'}
            {activeTab === 'request' && '요청한 콘텐츠가 없습니다.'}
            {activeTab === 'provide' && '제공한 콘텐츠가 없습니다.'}
            {activeTab === 'board' && '작성한 게시글이 없습니다.'}
            {activeTab === 'comment' && '작성한 댓글이 없습니다.'}
          </div>
        ) : (
          items.map((item, index) => {
            // 마지막 아이템에 ref 연결
            const ref = index === items.length - 1 ? lastItemRef : undefined;

            // 타입에 따라 적절한 카드 컴포넌트 렌더링
            if (isImageContent(item)) {
              return (
                <div key={`content-${item.id}`} ref={ref}>
                  <ContentCard
                    item={item}
                    index={index}
                    filterIcons={filterIcons}
                  />
                </div>
              );
            } else if (isBoardContent(item)) {
              return (
                <div key={`board-${item.id}`} ref={ref}>
                  <BoardCard
                    item={item}
                    index={index}
                    filterIcons={filterIcons}
                  />
                </div>
              );
            }
            return null;
          })
        )}
      </div>

      {/* 로딩 표시 */}
      {loading && (
        <div className="py-4 text-center text-white/50">로딩 중...</div>
      )}
    </div>
  );
};
