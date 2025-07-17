"use client";

import { Suspense } from "react";
import { useCurationContents } from "./hooks/use-curation-contents";
import { useLocaleContext } from "@/lib/contexts/locale-context";
import { CurationCard } from "./components/card";
import { BannerCard } from "./components/banner";
import { StoryCard } from "./components/story";

export function CurationList({
  type,
  variant = "card",
  isRow = false,
}: {
  type: "identity" | "brand" | "context";
  variant: "banner" | "card" | "story" | "grid";
  isRow?: boolean;
}) {
  const { data: contents, isLoading, error } = useCurationContents(type);

  if (isLoading) {
    return (
      <div className="space-y-8">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-[600px] bg-zinc-800/50 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) return null;
  if (!contents?.length) return null;

  return (
    <div
      className={`${
        isRow ? "grid grid-cols-1 sm:grid-cols-3 gap-6" : "space-y-12"
      }`}
    >
      {contents.map((content) =>
        variant === "card" ? (
          <CurationCard key={content._id} content={content} />
        ) : variant === "banner" ? (
          <BannerCard key={content._id} content={content} />
        ) : variant === "story" ? (
          <StoryCard key={content._id} content={content} />
        ) : (
          <div>Grid</div>
        )
      )}
    </div>
  );
}

export function CurationSection({
  type,
  variant,
  isRow = false,
}: {
  type: "identity" | "brand" | "context";
  variant: "banner" | "card" | "story" | "grid";
  isRow?: boolean;
}) {
  const { t } = useLocaleContext();

  return (
    <div className="container">
      <section className="py-8 max-w-6xl mx-auto">
        <Suspense
          fallback={
            <div className="space-y-8">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-[600px] bg-zinc-800/50 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          }
        >
          <CurationList type={type} variant={variant} isRow={isRow} />
        </Suspense>
      </section>
    </div>
  );
}
