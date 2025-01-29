"use client";

import { cn } from "@/lib/utils/style";
import { PremiumSpotClient } from "../client/premium-spot-client";
import { PeriodSelector } from "../components/period-selector";
import { Period } from "../types";
import { useState, useEffect } from "react";
import { useAvailablePeriods } from "../client/hooks/use-available-periods";
import { useLocaleContext } from "@/lib/contexts/locale-context";

export function PremiumSpotContainer() {
  const { t } = useLocaleContext();
  const [period, setPeriod] = useState<Period | null>(null);
  const { availablePeriods, isLoading } = useAvailablePeriods();

  useEffect(() => {
    if (!isLoading && availablePeriods.length > 0 && !period) {
      setPeriod(availablePeriods[0]);
    }
  }, [isLoading, availablePeriods, period]);

  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod);
  };

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

          {!isLoading && availablePeriods.length > 0 && (
            <PeriodSelector
              period={period || availablePeriods[0]}
              onPeriodChange={handlePeriodChange}
              availablePeriods={availablePeriods}
            />
          )}

          {period && <PremiumSpotClient key={period} period={period} />}
        </div>

        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      </div>
    </section>
  );
}
