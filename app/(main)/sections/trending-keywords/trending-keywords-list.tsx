'use client';

import { useRouter } from 'next/navigation';
import { Badge } from "@/components/ui/badge";
import { useTrendingKeywords } from './hooks/use-trending-keywords';

export function TrendingKeywordsList() {
  const router = useRouter();
  const { data: response, isLoading } = useTrendingKeywords();

  const handleKeywordClick = (keyword: string) => {
    router.push(`/search?q=${encodeURIComponent(keyword)}`);
  };
  
  if (isLoading) return <div>키워드를 불러오는 중...</div>;

  return (
    <div className="flex flex-wrap gap-3">
      {response?.data?.map((keyword: string, index) => (
        <Badge 
          key={index} 
          variant="default"
          onClick={() => handleKeywordClick(keyword)}
        >
          {keyword}
        </Badge>
      ))}
    </div>
  );
} 