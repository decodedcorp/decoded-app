import { MasonryGrid } from '../client/masonry-grid';

export function GridWrapper({ imageId }: { imageId: string }) {
  return (
    <div className="relative w-full h-full">
      <MasonryGrid />
    </div>
  );
} 