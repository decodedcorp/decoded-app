"use client";

import type { PostDetail } from "@/lib/supabase/queries/posts";
import { normalizeItem } from "./types";
import { ShopGrid } from "./ShopGrid";
import Link from "next/link";
import Image from "next/image";
import { ArticleContent } from "./ArticleContent";
import { MetadataTags } from "./MetadataTags";

type Props = {
  postDetail: PostDetail;
};

/**
 * Content component for post detail view
 *
 * Sections:
 * 1. Hero Section - Post info with account
 * 2. Article & Metadata - Markdown content and tags
 * 3. Images Grid - Grid of images from items
 * 4. Shop Grid - Grid of items
 */
export function PostDetailContent({ postDetail }: Props) {
  const { post, items, images } = postDetail;

  // Normalize items
  const normalizedItems = items.map((item) => normalizeItem(item));

  const hasItems = normalizedItems.length > 0;
  const hasImages = images.length > 0;

  return (
    <div className="detail-content">
      {/* Section 1: Hero */}
      <div className="relative min-h-[50vh] flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <div className="mx-auto max-w-4xl px-4 py-16 md:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
              <span className="text-sm font-medium text-foreground">
                @{post.account}
              </span>
            </div>
            {/* Title is usually part of article markdown, but we keep this as backup or for pure aesthetic */}
            {!post.article && (
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Post Details
              </h1>
            )}
            <p className="text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "items"} featured
              {images.length > 0 &&
                ` • ${images.length} ${images.length === 1 ? "image" : "images"}`}
            </p>
            {post.created_at && (
              <p className="text-sm text-muted-foreground mt-2">
                Posted: {new Date(post.created_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Article & Metadata */}
      {post.metadata && <MetadataTags tags={post.metadata} />}
      {post.article && <ArticleContent content={post.article} />}

      {/* Section 3: Images Grid */}
      {hasImages && (
        <div className="bg-muted/10 border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
            <h2 className="text-2xl font-bold mb-6">Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image) => (
                <Link
                  key={image.id}
                  href={`/images/${image.id}`}
                  className="group relative aspect-[3/4] overflow-hidden rounded-lg border border-border bg-muted hover:shadow-lg transition-shadow"
                >
                  {image.image_url ? (
                    <Image
                      src={image.image_url}
                      alt={`Image ${image.id}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                      <span className="text-sm">No image</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Section 4: Shop Grid */}
      {hasItems && <ShopGrid items={normalizedItems} />}

      {/* Fallback: Show basic info if no items */}
      {!hasItems && (
        <div className="mx-auto max-w-4xl px-4 py-16 md:px-8">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-semibold">No Items</h2>
            <p className="text-muted-foreground">
              This post doesn't have any items yet.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
