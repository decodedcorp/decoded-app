"use client";

import { cn } from "@/lib/utils/style";
import { DiscoverBadge } from "./discover-badge";
import { useLocaleContext } from "@/lib/contexts/locale-context";

export function DiscoverTitle() {
  const { t } = useLocaleContext();
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <DiscoverBadge />
        <h2 className={cn("text-5xl md:text-4xl font-bold")}>
          {t.home.discover.title}
        </h2>
      </div>
      <p className="text-zinc-400 text-base leading-relaxed">
        {t.home.discover.description}
      </p>
    </div>
  );
}
