"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useTrendingKeywords } from "./hooks/use-trending-keywords";
import { motion } from "framer-motion";
import { pretendardBold, pretendardSemiBold } from "@/lib/constants/fonts";

export function TrendingKeywordsList() {
  const router = useRouter();
  const { data: response, isLoading } = useTrendingKeywords();

  const handleKeywordClick = (keyword: string) => {
    router.push(`/search?q=${encodeURIComponent(keyword)}`);
  };

  if (isLoading) return <div>키워드를 불러오는 중...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
      {response?.data?.map((keyword: string, index) => (
        <motion.span
          key={index}
          className={`${pretendardBold.className} text-gray-600 text-[2.5rem] sm:text-[3rem] hover:text-[#EAFD66] transition-colors duration-200 cursor-pointer`}
          onClick={() => handleKeywordClick(keyword)}
          whileHover={{ x: 20 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {keyword.toUpperCase()}
        </motion.span>
      ))}
    </div>
  );
}
