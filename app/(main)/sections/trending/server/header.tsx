"use client";
import { Flame } from "lucide-react";
import { useLocaleContext } from "@/lib/contexts/locale-context";

export function TrendingHeader() {
  const { t } = useLocaleContext();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Flame className="w-5 h-5 text-[#EAFD66]" />
        <h2 className="text-xl font-semibold text-white">
          {t.home.trending.title}
        </h2>
      </div>
      <p className="text-zinc-400">{t.home.trending.description}</p>
    </div>
  );
}
