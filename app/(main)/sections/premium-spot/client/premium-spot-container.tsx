"use client";

import { cn } from "@/lib/utils/style";
import { PremiumSpotClient } from "./premium-spot-client";
import { useLocaleContext } from "@/lib/contexts/locale-context";

export function PremiumSpotContainer() {
  const { t } = useLocaleContext();

  return (
    <section className="container mx-auto px-4">
      <div
        className={cn(
          "relative rounded-3xl overflow-hidden",
          "border border-zinc-800/50"
        )}
      >
        <div className="relative z-10 p-8 md:p-12 space-y-12">
          <div className="max-w-2xl space-y-4">
            <h2 className={cn("text-3xl md:text-4xl font-bold")}>
              {t.home.premiumSpot.title}
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              {t.home.premiumSpot.description}
            </p>
          </div>

          <PremiumSpotClient />
        </div>

        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      </div>
    </section>
  );
}
