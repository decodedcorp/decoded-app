import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import DetailPageContent from '@/app/details/[imageId]/components/detail-page-content';
import { ErrorDisplay } from '@/app/details/[imageId]/components/error';
import { LoadingDisplay } from '@/app/details/[imageId]/components/loading';
import { getImageDetails } from '@/app/details/utils/hooks/fetchImageDetails';

type PageProps = {
  params: Promise<{
    imageId: string;
  }>;
  searchParams: Promise<{
    itemId?: string;
    showList?: string;
  }>;
};

export default async function DetailsPage({ params, searchParams }: PageProps) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

  const { imageId } = resolvedParams;
  const { itemId, showList } = resolvedSearchParams;

  if (!imageId) {
    notFound();
  }

  try {
    const initialData = await getImageDetails(imageId);

    return (
      <Suspense fallback={<LoadingDisplay />}>
        <DetailPageContent
          initialData={initialData}
          imageId={imageId}
          itemId={itemId}
          showList={showList === 'true'}
        />
      </Suspense>
    );
  } catch (error) {
    console.error('Error fetching image details:', error);
    return <ErrorDisplay />;
  }
}
