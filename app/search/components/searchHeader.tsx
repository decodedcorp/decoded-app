"use client";

import { useSearchParams } from "next/navigation";
import { useLocaleContext } from "@/lib/contexts/locale-context";
import { cn } from "@/lib/utils/style";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

export function SearchHeader() {
  const { t } = useLocaleContext();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div className=" py-8 space-y-4">
        {/* 검색 아이콘과 쿼리 */}
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-xl",
              "bg-[#EAFD66]/10 backdrop-blur-sm",
              "flex items-center justify-center"
            )}
          >
            <Search className="w-5 h-5 text-[#EAFD66]" />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-white/80/60">검색어</p>
            <h1 className="text-xl font-medium text-white/80">
              &quot;{query}&quot;
            </h1>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
