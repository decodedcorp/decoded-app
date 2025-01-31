"use client";

import { useSearchParams } from "next/navigation";
import { useLocaleContext } from "@/lib/contexts/locale-context";

export function SearchHeader() {
  const { t } = useLocaleContext();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-medium text-white">
        &quot;{query}&quot;에 대한 검색 결과
      </h1>
      <p className="text-sm text-white/60">{t.search.description}</p>
    </div>
  );
}
