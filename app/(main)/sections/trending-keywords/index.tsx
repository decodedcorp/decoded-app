import { TrendingKeywordsList } from './trending-keywords-list';

export function TrendingKeywordsSection() {
  return (
    <section
      className="
      container
      space-y-4
      rounded-2xl 
      backdrop-blur-sm 
      mb-6
    "
    >
      <div
        className="
        flex 
        flex-col 
        gap-1
        sm:flex-row 
        sm:items-center 
        sm:gap-2
        py-2
      "
      >
        <h2
          className="
          text-lg              
          sm:text-xl           
          font-semibold
        "
        >
          트렌딩 키워드
        </h2>
        <span
          className="
          text-xs             
          sm:text-sm          
          text-zinc-500 
          dark:text-zinc-400
        "
        >
          지금 인기 있는 키워드
        </span>
      </div>

      <TrendingKeywordsList />
    </section>
  );
}
