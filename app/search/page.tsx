'use client';

import { SearchResults } from "@/app/search/components/searchResults";
import { SearchHeader } from "@/app/search/components/searchHeader";
import { SearchTrendingSection } from "@/app/search/components/SearchTrendingSection";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { networkManager } from '@/lib/network/network';

interface SearchResponse {
  trending_images: Array<{
    image: {
      _id: string;
      img_url: string;
      title: string | null;
      upload_by: string;
      requested_items: Record<
        string,
        Array<{
          item_doc_id: string;
          position: {
            top: string;
            left: string;
          };
        }>
      >;
      like: number;
    };
  }>;
  related_images?: any[];
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [isLoading, setIsLoading] = useState(true);
  const [trendingData, setTrendingData] = useState<SearchResponse | null>(null);
  
  useEffect(() => {
    const fetchSearchData = async () => {
      if (!query) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await networkManager.request(
          `search?query=${encodeURIComponent(query)}`,
          'GET'
        );

        if (response.status_code === 200) {
          setTrendingData(response.data);
        }
      } catch (error) {
        console.error('검색 결과 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchData();
  }, [query]);

  return (
    <div className="min-h-screen bg-black pt-24">
      {/* 일반 검색 결과 - 컨테이너 내부에 패딩 적용 */}
      <div className="container mx-auto px-4">
        <SearchHeader />
        <SearchResults />
      </div>
      
      {/* 트렌딩 섹션 - 별도로 배치 (전체 너비) */}
      <div className="mt-12 w-full">
        {!isLoading && trendingData?.trending_images && trendingData.trending_images.length > 0 && (
          <SearchTrendingSection trending_images={trendingData.trending_images} />
        )}
      </div>
    </div>
  );
}
