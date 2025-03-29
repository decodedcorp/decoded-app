"use client";

import { useLocaleContext } from "@/lib/contexts/locale-context";
import { cn } from "@/lib/utils/style";

export function DiscoverCTA() {
  const { t } = useLocaleContext();
  return (
    <div className="flex flex-wrap gap-4">
      <button
        className={cn(
          "bg-white/5 text-white/80",
          "px-6 py-3 rounded-xl",
          "font-semibold tracking-wide",
          "hover:bg-white/10",
          "transition-all duration-200",
          "border border-white/10"
        )}
      >
        {t.home.discover.cta}
      </button>
    </div>
  );
}
