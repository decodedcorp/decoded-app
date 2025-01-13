import { cn } from "@/lib/utils/style";
import { MetricsClient } from "../client/metrics-client";

export function MetricsServer() {
  return (
    <section
      className={cn(
        "container mx-auto px-4 py-16",
        "border-y border-zinc-800",
        "bg-zinc-900/30"
      )}
    >
      <MetricsClient />
    </section>
  );
} 