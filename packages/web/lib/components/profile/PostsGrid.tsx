"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PostItem {
  id: string;
  imageUrl: string;
  title?: string;
  itemCount: number;
}

const MOCK_POSTS: PostItem[] = [
  {
    id: "1",
    imageUrl: "https://picsum.photos/seed/post1/400/500",
    title: "Airport Fashion",
    itemCount: 3,
  },
  {
    id: "2",
    imageUrl: "https://picsum.photos/seed/post2/400/500",
    title: "Stage Outfit",
    itemCount: 5,
  },
  {
    id: "3",
    imageUrl: "https://picsum.photos/seed/post3/400/500",
    title: "Daily Look",
    itemCount: 2,
  },
  {
    id: "4",
    imageUrl: "https://picsum.photos/seed/post4/400/500",
    title: "Event Style",
    itemCount: 4,
  },
  {
    id: "5",
    imageUrl: "https://picsum.photos/seed/post5/400/500",
    title: "MV Outfit",
    itemCount: 6,
  },
  {
    id: "6",
    imageUrl: "https://picsum.photos/seed/post6/400/500",
    title: "Photoshoot",
    itemCount: 3,
  },
];

export interface PostsGridProps {
  posts?: PostItem[];
  className?: string;
}

export function PostsGrid({ posts = MOCK_POSTS, className }: PostsGridProps) {
  if (posts.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-muted-foreground">No posts yet</p>
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-3 gap-3", className)}>
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/posts/${post.id}`}
          className="group relative aspect-[4/5] rounded-lg overflow-hidden bg-muted"
        >
          <img
            src={post.imageUrl}
            alt={post.title || "Post"}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-xs font-medium text-white truncate">
              {post.title}
            </p>
            <p className="text-[10px] text-white/70">{post.itemCount} items</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
