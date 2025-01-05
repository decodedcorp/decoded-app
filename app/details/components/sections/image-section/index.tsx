import { DetailPageState } from '@/types/model.d';
import { ImageView } from '../../layouts/image-section/view';

interface ImageSectionProps {
  detailPageState: DetailPageState;
  imageUrl: string;
}

export default function ImageSection({ detailPageState, imageUrl }: ImageSectionProps) {
  return (
    <div className="w-full">
      <ImageView
        detailPageState={detailPageState}
        imageUrl={imageUrl}
      />
    </div>
  );
}
