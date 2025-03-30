"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Card } from "../../../components/ui/card";
import { useLocaleContext } from "@/lib/contexts/locale-context";
import { TabType } from "@/components/Header/nav/modal/types/mypage";
import { Heart, HelpCircle, CheckCircle, Bookmark, MessageSquareText } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { mypageService } from "@/lib/api/requests/mypage";
import { useAuth } from "@/lib/hooks/features/auth/useAuth";
import { useInfiniteScroll } from "@/lib/hooks/scroll/use-infinite-scroll";
import { useRouter } from "next/navigation";
import Image from "next/image";

// 콘텐츠 아이템 타입 정의
interface ContentItem {
  id: string;
  imageUrl: string;
  title?: string;
  type?: TabType;
  image_doc_id?: string;
  image_url?: string;
  item_doc_id?: string;
  name?: string;
  item_category?: string;
}

// 각 콘텐츠 카드 컴포넌트
interface ContentCardProps {
  item: ContentItem;
  index: number;
  filterIcons: Record<TabType, JSX.Element>;
  t: any;
}

const ContentCard = ({ item, index, filterIcons, t }: ContentCardProps) => {
  // 라우터 추가
  const router = useRouter();
  // 북마크 토글 상태 추가
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // API 응답에 따라 이미지 URL을 적절히 가져옵니다
  const imageUrl = item.imageUrl || item.image_url || '';
  const imageId = item.image_doc_id || item.id;
  
  // 이미지 상세 페이지로 이동하는 함수
  const handleCardClick = () => {
    router.push(`/details/${imageId}`);
  };
  
  // 북마크 토글 함수
  const toggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
    setIsBookmarked(prev => !prev);
    // 여기에 실제 북마크 기능 API 호출 추가 필요
  };
  
  return (
    <motion.div
      key={`${item.type}-${item.id}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={handleCardClick}
      className="cursor-pointer"
    >
      <Card className="bg-[#1A1A1A] border-white/5 overflow-hidden hover:shadow-lg transition-all duration-200">
        <div className="relative">
          {/* 이미지 컨테이너에 4:5 비율 적용 */}
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-lg">
            <Image 
              src={imageUrl} 
              alt={`이미지 ${index + 1}`} 
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 hover:scale-110"
              unoptimized
            />
          </div>
          <div className="absolute top-2 left-2">
            <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center">
              {item.type === "request" ? filterIcons.request : 
               item.type === "provide" ? filterIcons.provide : 
               filterIcons.like}
              {item.type === "request" ? t.mypage.tabs.request : 
               item.type === "provide" ? t.mypage.tabs.provide : 
               t.mypage.tabs.like}
            </span>
          </div>
          <div className="absolute top-2 right-2">
            <button 
              className="bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
              onClick={toggleBookmark}
            >
              <Bookmark 
                className={`h-4 w-4 ${isBookmarked ? 'text-[#EAFD66] fill-[#EAFD66]' : 'text-white'}`} 
              />
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// 보드 카드 컴포넌트
interface BoardCardProps {
  type: TabType;
  filterIcons: Record<TabType, JSX.Element>;
  counts: Record<TabType, number>;
  isActive: boolean;
  onClick: () => void;
  title: string;
}

const BoardCard = ({ type, filterIcons, counts, isActive, onClick, title }: BoardCardProps) => {
  return (
    <motion.div 
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={isActive ? "" : "opacity-40 hover:opacity-70 transition-opacity"}
      onClick={onClick}
    >
      <Card className="bg-[#1A1A1A] border-white/5 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer">
        <div className="grid grid-cols-2 gap-1 p-1">
          <div className="bg-gray-800 rounded aspect-square"></div>
          <div className="bg-gray-800 rounded aspect-square"></div>
          <div className="bg-gray-800 rounded aspect-square"></div>
          <div className="bg-gray-800 rounded aspect-square"></div>
        </div>
        <div className="p-3">
          <div className="flex items-center">
            {filterIcons[type]}
            <p className="text-sm font-medium text-white">{title}</p>
          </div>
          <p className="text-xs text-white/60 mt-1">핀 {counts[type]}개</p>
        </div>
      </Card>
    </motion.div>
  );
};

// 필터 버튼 컴포넌트
interface FilterButtonProps {
  type: TabType;
  label: string;
  count: number;
  isActive: boolean;
  icon: JSX.Element;
  onClick: () => void;
}

const FilterButton = ({ type, label, count, isActive, icon, onClick }: FilterButtonProps) => {
  const buttonStyle = isActive 
    ? "bg-white text-black hover:bg-white/90 shadow-md transform-gpu scale-105 transition-all duration-200"
    : "bg-transparent border-white/20 text-white/60 hover:text-white transition-all duration-200";

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className={`rounded-full text-xs flex items-center ${buttonStyle}`}
      onClick={onClick}
    >
      {icon}
      {label}
    </Button>
  );
};

// 탭 전환 헤더 컴포넌트
interface TabHeaderProps {
  viewMode: 'pins' | 'boards';
  setViewMode: (mode: 'pins' | 'boards') => void;
}

const TabHeader = ({ viewMode, setViewMode }: TabHeaderProps) => {
  return (
    <div className="flex items-center justify-between border-b border-white/10 pb-4">
      <div className="flex space-x-3">
        <button 
          className={`text-sm font-medium relative pb-4 ${viewMode === "pins" ? "text-white" : "text-white/60 hover:text-white/80"} transition-colors duration-200`}
          onClick={() => setViewMode("pins")}
        >
          핀
          {viewMode === "pins" && (
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              className="absolute bottom-0 left-0 right-0 h-1 bg-white" 
            />
          )}
        </button>
        <button 
          className={`text-sm font-medium relative pb-4 ${viewMode === "boards" ? "text-white" : "text-white/60 hover:text-white/80"} transition-colors duration-200`}
          onClick={() => setViewMode("boards")}
        >
          보드
          {viewMode === "boards" && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              className="absolute bottom-0 left-0 right-0 h-1 bg-white" 
            />
          )}
        </button>
      </div>
    </div>
  );
};

// 각 탭에 대한 무한 스크롤 커스텀 훅
function useTabInfiniteScroll(type: TabType) {
  const { isLogin, isInitialized } = useAuth();
  const userId = typeof window !== 'undefined' ? window.sessionStorage.getItem('USER_DOC_ID') : null;

  // 요청 데이터를 가져오는 함수
  const fetchRequestData = async ({ next_id, limit = 10 }: { next_id?: string; limit?: number }) => {
    if (!userId) throw new Error('사용자 정보를 찾을 수 없습니다');
    
    try {
      console.log('[요청] API 호출 시작:', { userId, next_id, limit });
      const response = await mypageService.getUserRequests(userId, { next_id, limit });
      
      if (!response) {
        throw new Error('API 응답이 없습니다');
      }
      
      console.log('[요청] API 응답 데이터:', response.data);
      
      // API 응답 구조에 맞게 변경
      const responseData: any = response.data;
      const requests: any[] = responseData?.requests || [];
      const nextId = responseData?.next_id || null;
      
      console.log('[요청] 처리된 데이터:', { requestsCount: requests.length, nextId });
      
      const docs = requests.map((item: any) => ({
        id: item.image_doc_id || String(Math.random()),
        imageUrl: item.image_url || '',
        title: `요청 이미지`,
        type: 'request' as TabType
      }));
      
      console.log('[요청] 변환된 docs:', { docsCount: docs.length, firstItem: docs[0] });
      
      return {
        data: {
          docs,
          next_id: nextId
        }
      };
    } catch (error) {
      console.error('[요청] 데이터 가져오기 실패:', error);
      throw error;
    }
  };

  // 제공 데이터를 가져오는 함수
  const fetchProvideData = async ({ next_id, limit = 10 }: { next_id?: string; limit?: number }) => {
    if (!userId) throw new Error('사용자 정보를 찾을 수 없습니다');
    
    try {
      console.log('[제공] API 호출 시작:', { userId, next_id, limit });
      const response = await mypageService.getUserProvides(userId, { next_id, limit });
      
      if (!response) {
        throw new Error('API 응답이 없습니다');
      }
      
      console.log('[제공] API 응답 데이터:', response.data);
      
      // API 응답 구조에 맞게 변경
      const responseData: any = response.data;
      const provides: any[] = responseData?.provides || [];
      const nextId = responseData?.next_id || null;
      
      console.log('[제공] 처리된 데이터:', { providesCount: provides.length, nextId });
      
      const docs = provides.map((item: any) => ({
        id: item.image_doc_id || String(Math.random()),
        imageUrl: item.image_url || '',
        title: `제공 이미지`,
        type: 'provide' as TabType
      }));
      
      console.log('[제공] 변환된 docs:', { docsCount: docs.length, firstItem: docs[0] });
      
      return {
        data: {
          docs,
          next_id: nextId
        }
      };
    } catch (error) {
      console.error('[제공] 데이터 가져오기 실패:', error);
      throw error;
    }
  };

  // 좋아요 데이터를 가져오는 함수
  const fetchLikeData = async ({ next_id, limit = 10 }: { next_id?: string; limit?: number }) => {
    if (!userId) throw new Error('사용자 정보를 찾을 수 없습니다');
    
    try {
      console.log('[좋아요] API 호출 시작:', { userId, next_id, limit });
      const response = await mypageService.getUserLikedImages(userId, { next_id, limit });
      
      if (!response) {
        throw new Error('API 응답이 없습니다');
      }
      
      console.log('[좋아요] API 응답 데이터:', response.data);
      
      // API 응답 구조에 맞게 변경
      const responseData: any = response.data;
      const likes: any[] = responseData?.likes || [];
      const nextId = responseData?.next_id || null;
      
      console.log('[좋아요] 처리된 데이터:', { likesCount: likes.length, nextId });
      
      const docs = likes.map((item: any) => ({
        id: item.image_doc_id || String(Math.random()),
        imageUrl: item.image_url || '',
        title: `좋아요 이미지`,
        type: 'like' as TabType
      }));
      
      console.log('[좋아요] 변환된 docs:', { docsCount: docs.length, firstItem: docs[0] });
      
      return {
        data: {
          docs,
          next_id: nextId
        }
      };
    } catch (error) {
      console.error('[좋아요] 데이터 가져오기 실패:', error);
      throw error;
    }
  };

  // 현재 활성화된 탭에 따라 적절한 fetch 함수 선택
  const fetchFunction = useMemo(() => {
    console.log('[TabInfiniteScroll] 선택된 탭:', type);
    switch (type) {
      case 'request':
        return fetchRequestData;
      case 'provide':
        return fetchProvideData;
      case 'like':
        return fetchLikeData;
      default:
        return fetchRequestData;
    }
  }, [type]);

  // useInfiniteScroll 훅으로 데이터 로딩
  const {
    items,
    isLoading,
    error,
    hasMore,
    loadingRef
  } = useInfiniteScroll({
    fetchFunction,
    initialLimit: 10,
    threshold: 0.1,
  });

  // 로그 추가
  useEffect(() => {
    console.log(`[TabInfiniteScroll][${type}] 상태 업데이트:`, {
      itemsCount: items.length,
      isLoading,
      error: error?.message,
      hasMore
    });
  }, [items, isLoading, error, hasMore, type]);

  // 각 탭의 데이터 카운트를 저장할 ref
  const countRef = useRef<number>(items.length);
  
  // 항목 수가 변경될 때만 countRef 업데이트
  if (items.length !== countRef.current) {
    countRef.current = items.length;
    console.log(`[TabInfiniteScroll][${type}] 카운트 업데이트:`, countRef.current);
  }

  return {
    items,
    isLoading,
    error,
    hasMore,
    loadingRef,
    count: countRef.current
  };
}

export function ActivityTabs() {
  const { t } = useLocaleContext();
  const [viewMode, setViewMode] = useState<"pins" | "boards">("pins");
  const [activeFilter, setActiveFilter] = useState<TabType>("request");
  
  // 각 탭의 무한 스크롤 훅 사용
  const requestData = useTabInfiniteScroll('request');
  const provideData = useTabInfiniteScroll('provide');
  const likeData = useTabInfiniteScroll('like');
  
  // 현재 활성화된 탭의 데이터
  const activeData = useMemo(() => {
    console.log('[ActivityTabs] 활성화된 탭:', activeFilter);
    console.log('[ActivityTabs] 각 탭 데이터 상태:', {
      request: { count: requestData.count, items: requestData.items.length },
      provide: { count: provideData.count, items: provideData.items.length },
      like: { count: likeData.count, items: likeData.items.length }
    });
    
    switch (activeFilter) {
      case 'request':
        return requestData;
      case 'provide':
        return provideData;
      case 'like':
        return likeData;
      default:
        return requestData;
    }
  }, [activeFilter, requestData, provideData, likeData]);
  
  useEffect(() => {
    console.log('[ActivityTabs] 활성 데이터:', {
      items: activeData.items.length,
      isLoading: activeData.isLoading,
      error: activeData.error?.message,
      hasMore: activeData.hasMore
    });
  }, [activeData]);
  
  const handleFilterChange = (filter: TabType) => {
    setActiveFilter(filter);
  };
  
  // 각 필터 타입별 카운트
  const counts = useMemo(() => ({
    home: 0, // home 탭은 현재 사용하지 않지만 타입 에러 방지를 위해 추가
    request: requestData.count,
    provide: provideData.count,
    like: likeData.count,
    board: 0,
    comment: 0
  }), [requestData.count, provideData.count, likeData.count]);

  // 필터 아이콘 매핑
  const filterIcons = useMemo(() => ({
    home: <></>, // home 탭은 현재 사용하지 않지만 타입 에러 방지를 위해 추가
    request: <HelpCircle className="h-3 w-3 mr-1.5" />,
    provide: <CheckCircle className="h-3 w-3 mr-1.5" />,
    like: <Heart className="h-3 w-3 mr-1.5" fill={activeFilter === "like" ? "currentColor" : "none"} />,
    board: <MessageSquareText className="h-3 w-3 mr-1.5" />,
    comment: <MessageSquareText className="h-3 w-3 mr-1.5" />
  }), [activeFilter]);

  // 로딩 상태 처리 (초기 로딩)
  if ((requestData.isLoading && requestData.items.length === 0) && 
      (provideData.isLoading && provideData.items.length === 0) && 
      (likeData.isLoading && likeData.items.length === 0)) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-2 text-white/60">데이터를 불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태 처리
  if (activeData.error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>에러가 발생했습니다: {activeData.error.message}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          다시 시도
        </Button>
      </div>
    );
  }

  // 데이터가 없는 경우 처리
  if (!requestData.isLoading && !provideData.isLoading && !likeData.isLoading && 
      requestData.items.length === 0 && provideData.items.length === 0 && likeData.items.length === 0) {
    return (
      <div className="text-center py-8 bg-[#1A1A1A] border border-white/5 rounded-lg">
        <p className="text-white/60 mb-4">
          활동 내역이 없습니다.
        </p>
        <p className="text-white/40 text-sm">
          요청, 제공, 좋아요 기능을 이용해보세요!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 핀/보드 탭 헤더 */}
      <TabHeader viewMode={viewMode} setViewMode={setViewMode} />
      
      {viewMode === "pins" ? (
        <div>
          {/* 필터 탭 버튼 영역 */}
          <div className="flex flex-wrap gap-2 mb-6">
            <FilterButton 
              type="request"
              label={t.mypage.tabs.request}
              count={counts.request}
              isActive={activeFilter === "request"}
              icon={filterIcons.request}
              onClick={() => handleFilterChange("request")}
            />
            <FilterButton 
              type="provide"
              label={t.mypage.tabs.provide}
              count={counts.provide}
              isActive={activeFilter === "provide"}
              icon={filterIcons.provide}
              onClick={() => handleFilterChange("provide")}
            />
            <FilterButton 
              type="like"
              label={t.mypage.tabs.like}
              count={counts.like}
              isActive={activeFilter === "like"}
              icon={filterIcons.like}
              onClick={() => handleFilterChange("like")}
            />
          </div>
          
          {/* 콘텐츠 표시 영역 */}
          <div className="mt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {activeData.items.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {/* 렌더링할 아이템 로그 */}
                    {(() => { console.log('[Render] 렌더링할 아이템:', activeData.items.length); return null; })()}
                    {activeData.items.map((item: ContentItem, index) => (
                      <ContentCard 
                        key={`${item.type}-${item.id}-${index}`}
                        item={item}
                        index={index}
                        filterIcons={filterIcons}
                        t={t}
                      />
                    ))}
                    
                    {/* 로더 엘리먼트 - 무한 스크롤용 */}
                    {activeData.hasMore && (
                      <div 
                        ref={activeData.loadingRef} 
                        className="col-span-full flex justify-center py-4"
                      >
                        {/* 로딩 상태 로그 */}
                        {(() => { console.log('[Render] 더 로딩할 데이터 있음, 로딩 상태:', activeData.isLoading); return null; })()}
                        {activeData.isLoading && (
                          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <Card className="bg-[#1A1A1A] border-white/5 p-4">
                    {/* 데이터 없음 로그 */}
                    {(() => { console.log('[Render] 데이터 없음 표시'); return null; })()}
                    <p className="text-white/60 text-center py-8">
                      {activeFilter === "request" ? "요청한" : 
                       activeFilter === "provide" ? "제공한" : 
                       "좋아요를 누른"} 콘텐츠가 없습니다.
                    </p>
                  </Card>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
          >
            <BoardCard 
              type="request"
              filterIcons={filterIcons}
              counts={counts}
              isActive={activeFilter === "request"}
              onClick={() => handleFilterChange("request")}
              title="요청 보드"
            />
            <BoardCard 
              type="provide"
              filterIcons={filterIcons}
              counts={counts}
              isActive={activeFilter === "provide"}
              onClick={() => handleFilterChange("provide")}
              title="제공 보드"
            />
            <BoardCard 
              type="like"
              filterIcons={filterIcons}
              counts={counts}
              isActive={activeFilter === "like"}
              onClick={() => handleFilterChange("like")}
              title="좋아요 보드"
            />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
} 