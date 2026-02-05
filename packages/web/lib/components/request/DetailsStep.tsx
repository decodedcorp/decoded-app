"use client";

import {
  useRequestStore,
  selectMediaSource,
  selectArtistName,
  selectGroupName,
  selectContext,
  selectAiMetadata,
} from "@/lib/stores/requestStore";
import { DescriptionInput } from "./DescriptionInput";
import { MediaSourceInput } from "./MediaSourceInput";
import { ArtistInput } from "./ArtistInput";
import { ContextSelector } from "./ContextSelector";
import { type ContextType } from "@/lib/api";

export function DetailsStep() {
  const mediaSource = useRequestStore(selectMediaSource);
  const artistName = useRequestStore(selectArtistName);
  const groupName = useRequestStore(selectGroupName);
  const context = useRequestStore(selectContext);
  const aiMetadata = useRequestStore(selectAiMetadata);

  const setMediaSource = useRequestStore((s) => s.setMediaSource);
  const setArtistName = useRequestStore((s) => s.setArtistName);
  const setGroupName = useRequestStore((s) => s.setGroupName);
  const setContext = useRequestStore((s) => s.setContext);

  return (
    <div className="space-y-6">
      {/* Description */}
      <div className="text-center pb-2">
        <p className="text-sm text-muted-foreground">
          Add details about where this image is from
        </p>
      </div>

      {/* Description (Optional) - AI extracts metadata */}
      <div className="p-4 rounded-xl bg-foreground/[0.02] border border-border">
        <DescriptionInput />
      </div>

      {/* Media Source (Required) */}
      <div className="p-4 rounded-xl bg-foreground/[0.02] border border-border">
        <MediaSourceInput value={mediaSource} onChange={setMediaSource} />
      </div>

      {/* Artist Info (Optional) */}
      <div className="p-4 rounded-xl bg-foreground/[0.02] border border-border">
        <ArtistInput
          artistName={artistName}
          groupName={groupName}
          aiRecommendedArtist={aiMetadata.artistName}
          onArtistNameChange={setArtistName}
          onGroupNameChange={setGroupName}
        />
      </div>

      {/* Context (Optional) */}
      <div className="p-4 rounded-xl bg-foreground/[0.02] border border-border">
        <ContextSelector
          value={context}
          aiRecommendedContext={aiMetadata.context as ContextType | undefined}
          onChange={setContext}
        />
      </div>

      {/* Validation hint */}
      {(!mediaSource?.type || !mediaSource?.title) && (
        <p className="text-xs text-amber-500 text-center">
          Please fill in the required media source fields to continue
        </p>
      )}
    </div>
  );
}
