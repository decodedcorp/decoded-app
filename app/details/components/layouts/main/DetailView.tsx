import { DetailPageState } from '@/types/model.d';
import { DescriptionView } from './DescriptionView';
import { ImageView } from './image-section/view';

interface DetailViewProps {
  detailPageState: DetailPageState;
  imageUrl: string;
  isFeatured: boolean;
}

export function DetailView({
  detailPageState,
  imageUrl,
  isFeatured,
}: DetailViewProps) {
  return (
    <div className="flex flex-col items-center">
      <DescriptionView
        detailPageState={detailPageState}
        isFeatured={isFeatured}
      />
      <ImageView detailPageState={detailPageState} imageUrl={imageUrl} />
    </div>
  );
}
