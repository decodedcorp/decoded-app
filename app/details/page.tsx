'use client';

import { useSearchParams, notFound } from 'next/navigation';
import Header from './components/layouts/header';
import ImageSection from './components/sections/image-section';
import LoadingView from '@/components/ui/Loading';
import useImageData from '@/lib/hooks/useMultiImageData';

export default function DetailPage() {
  const searchParams = useSearchParams();
  const imageId = searchParams.get('imageId');
  const imageUrl = searchParams.get('imageUrl');
  const { title, description, featuredImgs } = useImageData(imageId || '');

  if (!imageId || !imageUrl) {
    notFound();
  }

  if (!featuredImgs) return <LoadingView />;

  return (
    <div className="flex flex-col items-center my-32 w-full">
      <Header title={title} description={description} />
      <div className="flex justify-center w-full">
        <div className="flex w-full max-w-[1280px] justify-center">
          <ImageSection featuredImage={featuredImgs[2]} />
        </div>
      </div>
    </div>
  );
}
