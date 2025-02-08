import { TrendingKeywordsList } from "./trending-keywords-list";

export function TrendingKeywordsSection() {
  return (
    <section className="
      w-full
      space-y-6 
      px-36
      rounded-2xl 
      backdrop-blur-sm 
      mb-6
    ">
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
        <h2 className="text-xl font-semibold">트렌딩 키워드</h2>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          지금 인기 있는 키워드
        </span>
      </div>

      <TrendingKeywordsList />
    </section>
  );
}
