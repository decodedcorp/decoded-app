import { DetailPageState } from '@/types/model.d';
import { pretendardBold, pretendardRegular } from '@/lib/constants/fonts';

interface DescriptionViewProps {
  detailPageState: DetailPageState;
  isFeatured: boolean;
}

export function DescriptionView({
  detailPageState,
  isFeatured,
}: DescriptionViewProps) {
  return (
    <div className="flex flex-col w-full px-2 md:px-40 lg:px-72">
      <h2
        className={`${pretendardBold.className} text-2xl font-bold mb-4 ${
          isFeatured ? 'hidden' : 'block'
        }`}
      >
        {detailPageState.img?.title}
      </h2>
      <p className={`${pretendardRegular.className} text-xs mt-2`}>
        {detailPageState.img?.description}
      </p>
    </div>
  );
}
