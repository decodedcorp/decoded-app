import { ImageDetailModal } from '@/lib/components/detail/ImageDetailModal';

type Props = {
  params: Promise<{ id: string }>;
};

/**
 * Intercepting route for /images/[id]
 * This renders as a modal overlay when navigating from grid
 */
export default async function ModalImageDetailPage({ params }: Props) {
  const { id } = await params;
  return <ImageDetailModal imageId={id} />;
}

