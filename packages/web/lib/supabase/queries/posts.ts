/**
 * Query layer for posts table (client-side)
 *
 * This module establishes the pattern: "Supabase direct access only happens in this layer"
 * When RLS policies change, only these query functions need to be updated,
 * keeping frontend code changes minimal.
 *
 * Note: For server-side queries, use posts.server.ts instead.
 */

import { supabaseBrowserClient } from "../client";
import type { Database, ImageRow } from "../types";

type ItemRow = Database["public"]["Tables"]["item"]["Row"];
type PostRow = Database["public"]["Tables"]["post"]["Row"];

export type PostDetail = {
  post: PostRow;
  items: ItemRow[];
  images: ImageRow[];
};

/**
 * Fetches a post with its associated items and images (client-side)
 *
 * This function uses a 3-step query pattern:
 * 1. Fetch post (with item_ids)
 * 2. Fetch items using item_ids
 * 3. Fetch images using items' image_id
 *
 * Note: Items are sorted according to the order in post.item_ids to preserve
 * the curation order intended by the post author.
 *
 * @param postId - Post ID to fetch
 * @returns PostDetail object containing post, items, and images, or null if post not found
 */
export async function fetchPostWithImagesAndItems(
  postId: string
): Promise<PostDetail | null> {
  // 1. Post 조회 (item_ids 포함)
  const { data: post, error: postError } = await supabaseBrowserClient
    .from("post")
    .select("*")
    .eq("id", postId)
    .single<PostRow>();

  if (postError || !post) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "[fetchPostWithImagesAndItems] Error fetching post:",
        postError
      );
    }
    return null;
  }

  // 2. item_ids 타입 안전성 처리 및 검증
  const itemIds = Array.isArray(post.item_ids)
    ? (post.item_ids as string[])
    : [];

  if (itemIds.length === 0) {
    return {
      post,
      items: [],
      images: [],
    };
  }

  // 3. Items 조회
  // Convert string IDs to numbers (item.id is bigint/number in DB)
  const itemIdsAsNumbers = itemIds.map((id) => parseInt(id, 10));

  const { data: itemsData, error: itemsError } = await supabaseBrowserClient
    .from("item")
    .select("*")
    .in("id", itemIdsAsNumbers);

  if (itemsError) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "[fetchPostWithImagesAndItems] Error fetching items:",
        itemsError
      );
    }
    // 에러 발생 시에도 post 정보는 반환 (Graceful Degradation)
    return {
      post,
      items: [],
      images: [],
    };
  }

  // 4. 순서 보장: 조회된 items를 post.item_ids 순서대로 재정렬
  // SQL의 .in() 쿼리는 입력 배열의 순서를 보장하지 않으므로,
  // JavaScript 레벨에서 post.item_ids의 순서에 맞춰 재정렬
  const itemsMap = new Map<string, ItemRow>(
    (itemsData || []).map((item) => [item.id.toString(), item])
  );
  const sortedItems = itemIds
    .map((id) => itemsMap.get(id))
    .filter((item): item is ItemRow => item !== undefined);

  // 5. Images 조회
  // items에서 image_id 추출 및 중복 제거
  const imageIds = Array.from(
    new Set(
      sortedItems
        .map((item) => item.image_id)
        .filter((id): id is string => Boolean(id))
    )
  );

  let images: ImageRow[] = [];

  if (imageIds.length > 0) {
    const { data: imagesData, error: imagesError } = await supabaseBrowserClient
      .from("image")
      .select("*")
      .in("id", imageIds);

    if (imagesError) {
      if (process.env.NODE_ENV === "development") {
        console.error(
          "[fetchPostWithImagesAndItems] Error fetching images:",
          imagesError
        );
      }
      // 이미지만 실패했다면 아이템까지는 반환 (Graceful Degradation)
    } else {
      images = imagesData || [];
    }
  }

  return {
    post,
    items: sortedItems,
    images,
  };
}
