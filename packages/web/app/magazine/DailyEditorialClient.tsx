"use client";

import { useEffect } from "react";
import { useMagazineStore } from "@/lib/stores/magazineStore";
import { MagazineSkeleton } from "@/lib/components/magazine";
import { GenerateMyEdition } from "@/lib/components/magazine/GenerateMyEdition";
import { EditorialHero } from "@/lib/components/magazine/EditorialHero";
import { EditorialItemShowcase } from "@/lib/components/magazine/EditorialItemShowcase";
import { AmbientParticles } from "@/lib/components/magazine/AmbientParticles";
import { GrainOverlay } from "@/lib/components/magazine/GrainOverlay";
import { RefreshCw } from "lucide-react";

/**
 * Client component for the daily editorial page (SCR-MAG-01).
 * Cinematic full-black editorial — no GSAP scroll animations on sections
 * to avoid opacity:0 visibility bugs.
 */
export function DailyEditorialClient() {
  const currentIssue = useMagazineStore((s) => s.currentIssue);
  const isLoading = useMagazineStore((s) => s.isLoading);
  const error = useMagazineStore((s) => s.error);
  const loadDailyIssue = useMagazineStore((s) => s.loadDailyIssue);
  const clearError = useMagazineStore((s) => s.clearError);

  useEffect(() => {
    loadDailyIssue();
  }, [loadDailyIssue]);

  if (isLoading) {
    return <MagazineSkeleton />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mag-bg px-6">
        <div className="max-w-sm rounded-lg border border-mag-accent/30 bg-mag-bg p-8 text-center">
          <p className="mb-4 text-mag-text/70">{error}</p>
          <button
            type="button"
            onClick={() => {
              clearError();
              loadDailyIssue();
            }}
            className="inline-flex items-center gap-2 rounded-md border border-mag-accent px-4 py-2 text-sm font-medium text-mag-accent transition-colors hover:bg-mag-accent/10"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!currentIssue) {
    return null;
  }

  const { layout_json } = currentIssue;
  const components = layout_json.components;

  const title = currentIssue.title;
  const subtitle = currentIssue.subtitle;
  const coverImageUrl = currentIssue.cover_image_url;

  const items = components
    .filter((c) => c.type === "item-card")
    .map((c) => c.data as unknown as {
      item_id: string;
      image_url: string;
      brand: string;
      name: string;
      price: string;
    });

  const galleryImages =
    (components.find((c) => c.type === "grid-gallery")?.data?.images as string[]) || [];

  const bodyText =
    (components.find((c) => c.type === "text-block")?.data?.content as string) || "";

  const quote = components.find((c) => c.type === "quote")?.data as
    | { text: string; attribution: string }
    | undefined;

  return (
    <div className="relative min-h-screen overflow-hidden bg-mag-bg text-mag-text">
      <GrainOverlay />
      <AmbientParticles isActive={true} />

      <div className="mx-auto max-w-5xl">
        {/* Hero Section */}
        <EditorialHero
          title={title}
          subtitle={subtitle}
          coverImageUrl={coverImageUrl}
          images={galleryImages.slice(0, 3)}
        />

        {/* Body Text Section */}
        {bodyText && (
          <section className="mx-auto max-w-3xl px-6 py-16 md:px-10">
            <p className="text-base font-light leading-relaxed text-mag-text/70">
              {bodyText}
            </p>
          </section>
        )}

        {/* Item Showcase */}
        <EditorialItemShowcase items={items} />

        {/* Quote Section */}
        {quote && (
          <section className="mx-auto max-w-3xl px-6 py-16 text-center">
            <blockquote className="text-2xl font-light italic text-mag-text/80">
              &ldquo;{quote.text}&rdquo;
            </blockquote>
            <p className="mt-4 text-xs uppercase tracking-widest text-mag-text/40">
              {quote.attribution}
            </p>
          </section>
        )}

        {/* CTA */}
        <GenerateMyEdition />
      </div>
    </div>
  );
}
