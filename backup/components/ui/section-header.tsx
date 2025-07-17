"use client";

import { cn } from "@/lib/utils/style";
import { pretendardBold, pretendardRegular } from "@/lib/constants/fonts";

interface SectionHeaderProps {
  title: string;
  description?: string;
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="flex flex-col">
      <h2
        className={cn("text-2xl text-white/80 mb-2", pretendardBold.className)}
      >
        {title}
      </h2>
      <h3 className={cn("text-sm text-gray-400", pretendardRegular.className)}>
        {description}
      </h3>
    </div>
  );
}
