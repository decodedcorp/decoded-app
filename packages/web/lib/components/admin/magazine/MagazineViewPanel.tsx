"use client";

import React from "react";
import { MagazinePreviewPanel } from "./MagazinePreviewPanel";
import type { Magazine } from "@/lib/hooks/admin/useMagazines";
import type { MagazineSession } from "@/lib/hooks/admin/useMagazineSessions";

/**
 * Adapts Magazine (from magazines table) to MagazineSession format for MagazinePreviewPanel.
 */
function magazineToSession(magazine: Magazine): MagazineSession {
  const spec = magazine.spec ?? {};
  const outline = spec.outline as Record<string, unknown> | undefined;
  return {
    id: magazine.id,
    thread_id: "",
    topic: magazine.title,
    image_urls: [],
    current_step: "done",
    step_status: "confirmed",
    images_json: [],
    outline: outline ?? {},
    sections: spec.sections ?? [],
    layout_spec: spec.layout_spec ?? {},
    revision_history: [],
    writer_headline: spec.writer_headline ?? (outline?.title as string),
    writer_subheadline: spec.writer_subheadline ?? undefined,
    writer_standfirst: spec.writer_standfirst ?? undefined,
  };
}

interface MagazineViewPanelProps {
  magazine: Magazine;
}

/**
 * Renders a saved magazine (from magazines table) using MagazinePreviewPanel.
 */
export function MagazineViewPanel({ magazine }: MagazineViewPanelProps) {
  const session = magazineToSession(magazine);
  return <MagazinePreviewPanel session={session} hideDebugBadges />;
}
