import { Suspense } from 'react';
import { LoadingDisplay } from './components/loading';
import { notFound } from 'next/navigation';
import { ErrorDisplay } from './components/error';
import { getImageDetails } from '@/app/details/utils/hooks/fetchImageDetails';
import { ImageSection } from './components/image-section/image-section';
import { DetailsList } from './components/item-list-section/server/details-list';
import { StylingSection } from './components/style-guide/styling-section';
import { DetailSlideSection } from './components/item-detail-section/detail-slide-section';

// 타입 정의
interface PageProps {
  params: Promise<{
    imageId: string;
  }>;
  searchParams: Promise<{
    itemId?: string;
  }>;
}
// 서버 컴포넌트
export default async function DetailsPage({ params, searchParams }: PageProps) {
  const { imageId } = await params;
  const { itemId } = await searchParams;

  if (!imageId) return notFound();

  const initialData = await getImageDetails(imageId);
  if (!initialData) return <ErrorDisplay />;

  return (
    <div className="min-h-screen pt-18 sm:pt-24 bg-black">
      <div className="max-w-4xl mx-auto px-4 space-y-16">
        <div className="bg-[#1A1A1A] rounded-2xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,24rem)_minmax(0,28rem)] gap-6 items-start justify-center">
            <Suspense fallback={<LoadingDisplay />}>
              <ImageSection
                imageData={{
                  items: initialData.items,
                  img_url: initialData.img_url,
                }}
                selectedItemId={itemId}
              />
                <DetailsList imageData={initialData} selectedItemId={itemId} />
            </Suspense>
          </div>
        </div>

        <Suspense fallback={<LoadingDisplay />}>
          <StylingSection />
        </Suspense>
      </div>
    </div>
  );
}
