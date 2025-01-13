import { cn } from "@/lib/utils/style";
import { MetricsClient } from "../client/metrics-client";

export function MetricsServer() {
  return (
    <section className={cn("container mx-auto px-4 py-16")}>
      <MetricsClient />
    </section>
  );
}
