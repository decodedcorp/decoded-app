import { LoadingView } from '@/components/ui/Loading';
import { useMultiImageData } from '@/lib/hooks/useMultiImageData';
import { FeaturedImageHeader } from './layouts/header/featured-image-header';
import { FeaturedImageList } from './layouts/main/featured-image-list';

interface MultiImageViewProps {
  imageId: string;
}

export function MultiImageView({ imageId }: MultiImageViewProps) {
  const { title, description, featuredImgs } = useMultiImageData(imageId);

  if (!featuredImgs) return <LoadingView />;

  return (
    <div className="flex flex-col justify-center items-center my-32 p-2 w-full overflow-x-hidden">
      <FeaturedImageHeader title={title} description={description} />
      <FeaturedImageList images={featuredImgs} />
    </div>
  );
} 