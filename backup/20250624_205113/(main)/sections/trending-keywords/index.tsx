import { TrendingKeywordsList } from './trending-keywords-list';
import { SectionHeader } from '@/components/ui/section-header';

export function TrendingKeywordsSection() {
  return (
    <section
      className="
      container mx-auto
      px-4 sm:px-4 lg:px-6
      space-y-8
      rounded-2xl 
      backdrop-blur-sm 
      mb-6
    "
    >
      <SectionHeader title="Trending Keywords" description="지금 가장 많이 검색되는 인기 키워드를 확인해보세요" />
      <TrendingKeywordsList />
    </section>
  );
}
