'use client';

import { useEffect, useState } from 'react';
import { TrendingNowInfo } from '@/types/model';
import { KeywordList } from '../../layouts/keywords';
import { mockTrendingNow } from '@/lib/constants/mock-data';
import { SectionHeader } from '../../layouts/section-header';

export function TrendingKeywords() {
  const [trendingNow, setTrendingNow] = useState<TrendingNowInfo[] | null>(
    null
  );

  useEffect(() => {
    const fetchTrendingNow = async () => {
      setTrendingNow(mockTrendingNow);
    };
    fetchTrendingNow();
  }, []);

  return (
    <div className="flex flex-col w-full mt-10 md:mt-20 p-4 md:p-20">
      <SectionHeader
        title="TRENDING NOW"
        subtitle="인기있는 키워드를 확인해보세요"
      />
      <KeywordList tags={trendingNow || []} />
    </div>
  );
}
