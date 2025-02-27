import { TrendingKeywordsList } from './trending-keywords-list';
import { SectionHeader } from '@/components/ui/section-header';

export function TrendingKeywordsSection() {
  return (
    <section
      className="
      container
      px-4
      space-y-4
      rounded-2xl 
      backdrop-blur-sm 
      mb-6
    "
    >
      <SectionHeader title="Trending Keywords" />
      <TrendingKeywordsList />
    </section>
  );
}
