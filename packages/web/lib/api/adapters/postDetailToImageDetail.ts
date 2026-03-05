/**
 * Adapter: PostDetailResponse (백엔드 API) → ImageDetail (기존 UI 호환)
 *
 * ImageDetailModal/ImageDetailContent가 기대하는 ImageDetail 구조로 변환
 */

import type { PostDetailResponse, SpotWithTopSolution } from "@/lib/api/types";
import type { ImageDetail } from "@/lib/supabase/queries/images";
import type { ItemRow } from "@/lib/components/detail/types";

/** Extended ImageDetail with post owner and created_with_solutions for adopt UI */
export type ImageDetailWithPostOwner = ImageDetail & {
  post_owner_id?: string | null;
  /** 포스트 생성 시 솔루션을 알고 등록했는지 */
  created_with_solutions?: boolean | null;
};

function parsePosition(val: string): number {
  const num = parseFloat(val.replace("%", ""));
  return num > 1 ? num / 100 : num;
}

/**
 * PostDetailResponse를 ImageDetail 형식으로 변환
 */
export function postDetailToImageDetail(
  post: PostDetailResponse,
  imageId: string
): ImageDetailWithPostOwner {
  const items: ItemRow[] = post.spots.map(
    (spot: SpotWithTopSolution, idx: number) => {
      const top = spot.top_solution;
      const citationUrl = top?.affiliate_url ?? top?.original_url ?? null;
      const citations = citationUrl ? [citationUrl] : null;
      return {
        id: idx + 1,
        image_id: post.id,
        spot_id: spot.id,
        spot_index: idx + 1,
        brand: null,
        product_name: top?.title ?? null,
        cropped_image_path: top?.thumbnail_url ?? null,
        price: (() => {
          const m = top?.metadata as
            | { price?: string | { amount?: string } }
            | undefined;
          if (!m?.price) return null;
          return typeof m.price === "string"
            ? m.price
            : (m.price?.amount ?? null);
        })(),
        description: null,
        status: spot.status ?? null,
        created_at: spot.created_at ?? null,
        bboxes: null,
        center: [
          parsePosition(spot.position_left),
          parsePosition(spot.position_top),
        ] as [number, number],
        scores: null,
        ambiguity: null,
        citations,
        metadata: null,
        sam_prompt: null,
      };
    }
  );

  return {
    id: imageId,
    image_hash: "",
    image_url: post.image_url,
    post_owner_id: post.user?.id ?? null,
    created_with_solutions: post.created_with_solutions ?? null,
    status: post.status as
      | "pending"
      | "extracted"
      | "skipped"
      | "extracted_metadata",
    with_items: items.length > 0,
    created_at: post.created_at,
    items,
    posts: [
      {
        id: post.id,
        account: post.user?.username ?? "",
        article: post.context ?? null,
        created_at: post.created_at,
        item_ids: null,
        metadata: [],
        ts: post.created_at,
      } as any,
    ],
    postImages: [
      {
        post: {
          id: post.id,
          account: post.user?.username ?? "",
          article: post.context ?? null,
          created_at: post.created_at,
          item_ids: null,
          metadata: [],
          ts: post.created_at,
        } as any,
        created_at: post.created_at,
        item_locations: post.spots.map((s, idx) => ({
          item_id: idx + 1,
          center: [
            parsePosition(s.position_left),
            parsePosition(s.position_top),
          ],
        })),
        item_locations_updated_at: post.updated_at,
      } as any,
    ],
  };
}
