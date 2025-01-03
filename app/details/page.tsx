'use client';

import { useSearchParams, notFound } from 'next/navigation';
import Header from './components/layouts/header';
import ImageSection from './components/sections/image-section';
import LoadingView from '@/components/ui/loading';
import { useDetailPageData } from '@/lib/hooks/useDetailPageData';

export default function DetailPage() {
  const searchParams = useSearchParams();
  const imageId = searchParams.get('imageId');
  const imageUrl = searchParams.get('imageUrl');

  const { detailPageState, items, isLoading, error } = useDetailPageData(
    imageId || ''
  );

  if (!imageId || !imageUrl) {
    notFound();
  }

  if (isLoading || !detailPageState) {
    return <LoadingView />;
  }

  if (error) {
    // TODO: Add error boundary or error component
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col items-center my-32 w-full">
      <Header
        title={detailPageState.img?.title}
        description={detailPageState.img?.description}
      />
      <div className="flex justify-center w-full">
        <div className="flex w-full max-w-[1280px] justify-center">
          <ImageSection detailPageState={detailPageState} imageUrl={imageUrl} />
        </div>
      </div>
    </div>
  );
}
