"use client";

import { SearchHeader } from "@/backup/app/search/components/searchHeader";
import { SearchResults } from "@/backup/app/search/components/searchResults";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { networkManager } from "@/lib/network/network";
import type { ImageDoc } from "@/lib/api/types";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [isLoading, setIsLoading] = useState(true);
  const [searchImages, setSearchImages] = useState<ImageDoc[] | null>(null);
  const [trendingImages, setTrendingImages] = useState<Set<ImageDoc> | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!query) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const [searchResponse, trendingResponse] = await Promise.all([
          networkManager.request(
            `search?query=${encodeURIComponent(query)}`,
            "GET"
          ),
          networkManager.request("metrics/trending/images", "GET"),
        ]);

        if (searchResponse.status_code === 200) {
          setSearchImages(searchResponse.data.related_images);
        }
        if (trendingResponse.status_code === 200) {
          trendingResponse.data.forEach((data: any) => {
            setTrendingImages((prev) => {
              const newSet = new Set(prev);
              newSet.add(data.image);
              return newSet;
            });
          });
        }
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [query]);

  return (
    <div className="min-h-screen bg-black pt-24">
      {/* 트렌딩 섹션 - 별도로 배치 (전체 너비) */}
      <div className="mt-12 w-full">
        {!isLoading && (
          <SearchResults
            searchImages={searchImages || []}
            trendingImages={Array.from(trendingImages || [])}
          />
        )}
      </div>
    </div>
  );
}
