"use client";

import { cn } from "@/lib/utils/style";
import { Search, Share2, Sparkles } from "lucide-react";
import { useLocaleContext } from "@/lib/contexts/locale-context";

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex items-start gap-4">
      <div
        className={cn(
          "flex-shrink-0",
          "w-10 h-10 rounded-xl",
          "bg-[#EAFD66]/10 text-[#EAFD66]",
          "flex items-center justify-center"
        )}
      >
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="font-medium text-white/80">{title}</h3>
        <p className="text-sm text-zinc-400">{description}</p>
      </div>
    </div>
  );
}

export function FeatureList() {
  const { t } = useLocaleContext();
  return (
    <div className="space-y-4">
      <FeatureItem
        icon={<Search className="w-5 h-5" />}
        title={t.home.featureList.search.title}
        description={t.home.featureList.search.description}
      />
      <FeatureItem
        icon={<Share2 className="w-5 h-5" />}
        title={t.home.featureList.share.title}
        description={t.home.featureList.share.description}
      />
      <FeatureItem
        icon={<Sparkles className="w-5 h-5" />}
        title={t.home.featureList.point.title}
        description={t.home.featureList.point.description}
      />
    </div>
  );
}
