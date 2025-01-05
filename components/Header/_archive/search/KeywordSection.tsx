import { pretendardSemiBold } from '@/lib/constants/fonts';

interface KeywordSectionProps {
  keywords: string[] | null;
  onKeywordClick: (keyword: string) => void;
}

function KeywordSection({ keywords, onKeywordClick }: KeywordSectionProps) {
  if (!keywords) return null;
  
  return (
    <div className="flex flex-wrap w-full md:w-[70%] justify-center mt-5 mb-5">
      {keywords.map((keyword, index) => (
        <button
          key={index}
          className="w-fit rounded-2xl border-2 border-white/50 m-2 p-2 text-sm 
            md:text-base cursor-pointer text-white hover:bg-white/10 transition-colors"
          onClick={() => onKeywordClick(keyword)}
        >
          {keyword}
        </button>
      ))}
    </div>
  );
}

export default KeywordSection; 