"use client";
import { useLocaleContext } from "@/lib/contexts/locale-context";

export function TrendingHeader() {
  const { t } = useLocaleContext();

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-white/80">
        {t.home.trending.title}
      </h2>
    </div>
  );
}
