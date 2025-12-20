"use client";

import { filterKoreanTags } from "@/lib/utils/locale";

type Props = {
  tags: string[] | null;
};

/**
 * Displays filtered Korean metadata tags in a pill layout
 */
export function MetadataTags({ tags }: Props) {
  const koreanTags = filterKoreanTags(tags);

  if (koreanTags.length === 0) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-12 md:px-8">
      <div className="flex flex-wrap gap-2 justify-center">
        {koreanTags.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary/50 text-secondary-foreground border border-border/50 hover:bg-secondary hover:border-border transition-colors cursor-default"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}

