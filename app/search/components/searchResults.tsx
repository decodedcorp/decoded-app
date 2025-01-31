"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { networkManager } from "@/lib/network/network";

export function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;

      setIsLoading(true);
      try {
        const response = await networkManager.request(
          `search?query=${encodeURIComponent(query)}`,
          "GET"
        );

        if (response.status_code === 200) {
          setResults(response.data.results);
        }
      } catch (error) {
        console.error("검색 결과 로딩 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (isLoading) {
    return <div className="text-white/60">검색 중...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      result
    </div>
  );
}
