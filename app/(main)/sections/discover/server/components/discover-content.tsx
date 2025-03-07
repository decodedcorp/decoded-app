import { cn } from "@/lib/utils/style";
import { DiscoverTitle } from "./discover-title";
import { FeatureList } from "../../client/feature-list";
import { DiscoverCTA } from "../../client/discover-cta";
import { ActivityFeedWrapper } from "../../client/components/activity-feed-wrapper";
import { getLocale } from "@/lib/lang/server/get-locale";

export function DiscoverContent() {
  return (
    <div className="relative z-10 grid md:grid-cols-2 gap-8 p-8 md:p-12">
      {/* 왼쪽: 텍스트 영역 */}
      <div className="flex flex-col gap-10">
        <DiscoverTitle />
        <FeatureList />
        <DiscoverCTA />
      </div>

      {/* 오른쪽: 이미지 영역 */}
      <div className="relative aspect-square md:aspect-auto">
        <ActivityFeedWrapper />
      </div>
    </div>
  );
}
