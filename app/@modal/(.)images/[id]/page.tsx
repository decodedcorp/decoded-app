import { ImageDetailModal } from "@/lib/components/detail/ImageDetailModal";

type Props = {
  params: Promise<{ id: string }>;
};

/**
 * Intercepting route for /images/[id]
 * This renders as a modal overlay when navigating from grid
 */
export default async function ModalImageDetailPage({ params }: Props) {
  const { id } = await params;

  // Debug: Log the imageId being passed
  if (process.env.NODE_ENV === "development") {
    console.log("[ModalImageDetailPage] Received imageId:", id);
  }

  if (!id) {
    console.error("[ModalImageDetailPage] imageId is missing!");
  }

  return <ImageDetailModal imageId={id} />;
}
