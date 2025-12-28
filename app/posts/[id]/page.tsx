import { PostDetailPage } from "@/lib/components/detail/PostDetailPage";

type Props = {
  params: Promise<{ id: string }>;
};

/**
 * Full page route for /posts/[id]
 * Used when directly accessing URL or refreshing page
 */
export default async function PostDetailPageRoute({ params }: Props) {
  const { id } = await params;
  return <PostDetailPage postId={id} />;
}
