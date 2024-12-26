import LoadingView from '@/components/ui/Loading';
import { useSingleImageData } from '@/lib/hooks/useSingleImageData';
import { ImageView } from '../../layouts/image-section/view';

interface ImageSectionProps {
  featuredImage: {
    imageUrl: string;
    imageDocId: string;
  };
  isItemDetail?: boolean;
}

export default function ImageSection({ 
  featuredImage, 
  isItemDetail = false 
}: ImageSectionProps) {
  const detailPageState = useSingleImageData(featuredImage.imageDocId, true);

  if (!detailPageState) return <LoadingView />;

  return (
    <div className="flex justify-center">
      <ImageView
        detailPageState={detailPageState}
        imageUrl={featuredImage.imageUrl}
        isItemDetail={isItemDetail}
      />
    </div>
  );
}
