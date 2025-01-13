import { DetailPageState } from '@/types/model.d';
import { ClientImageView } from '@/app/details/[imageId]/image-section/client/client-view';

export interface ImageViewProps {
  detailPageState: DetailPageState;
  imageUrl: string;
}

export function ImageView({ detailPageState, imageUrl }: ImageViewProps) {
  if (!detailPageState.img) {
    return null;
  }

  const itemList = detailPageState.itemList ?? [];
  const brandUrlList = detailPageState.brandUrlList ?? new Map();
  const brandImgList = detailPageState.brandImgList ?? new Map();
  const artistImgList = detailPageState.artistImgList ?? [];
  const artistList = detailPageState.artistList ?? [];
  const artistArticleList = detailPageState.artistArticleList ?? [];

  return (
    <ClientImageView
      imageUrl={imageUrl}
      detailPageState={{
        img: detailPageState.img,
        itemList,
        brandUrlList,
        brandImgList,
        artistImgList,
        artistList,
        artistArticleList,
      }}
    />
  );
} 