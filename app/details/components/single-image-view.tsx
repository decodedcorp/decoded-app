import { DetailView } from './layouts/main/DetailView';
import { LoadingView } from '@/components/ui/Loading';
import { useSingleImageData } from '@/lib/hooks/useSingleImageData';

interface SingleImageViewProps {
  imageId: string;
  imageUrl: string;
  isFeatured: boolean;
}

export function SingleImageView({ imageId, imageUrl, isFeatured }: SingleImageViewProps) {
  const detailPageState = useSingleImageData(imageId, isFeatured);

  if (!detailPageState) return <LoadingView />;

  return (
    <div className="flex-col justify-center text-center items-center overflow-x-hidden">
      <div className={`flex flex-col p-4 md:p-0 ${isFeatured ? 'mt-0' : 'mt-40'}`}>
        <DetailView
          detailPageState={detailPageState}
          imageUrl={imageUrl}
          isFeatured={isFeatured}
        />
      </div>
    </div>
  );
} 