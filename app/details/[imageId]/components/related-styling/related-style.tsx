import { RelatedStylingClient } from './client/related-styling-client';

export function RelatedStylingSection({
  imageId,
  selectedItemId,
  artistId,
  artistName,
}: {
  imageId: string;
  selectedItemId?: string;
  artistId?: string;
  artistName?: string;
}) {
  return (
    <div className="w-full bg-black/50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <RelatedStylingClient
          imageId={imageId}
          selectedItemId={selectedItemId}
          artistId={artistId || undefined}
          artistName={artistName || undefined}
        />
      </div>
    </div>
  );
}
