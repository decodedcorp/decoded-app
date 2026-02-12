"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface SavedItem {
  id: string;
  imageUrl: string;
  type: "post" | "image";
}

const MOCK_SAVED: SavedItem[] = [
  {
    id: "s1",
    imageUrl: "https://picsum.photos/seed/saved1/400/400",
    type: "post",
  },
  {
    id: "s2",
    imageUrl: "https://picsum.photos/seed/saved2/400/400",
    type: "image",
  },
  {
    id: "s3",
    imageUrl: "https://picsum.photos/seed/saved3/400/400",
    type: "post",
  },
  {
    id: "s4",
    imageUrl: "https://picsum.photos/seed/saved4/400/400",
    type: "image",
  },
];

export interface SavedGridProps {
  items?: SavedItem[];
  className?: string;
}

export function SavedGrid({ items = MOCK_SAVED, className }: SavedGridProps) {
  if (items.length === 0) {
    return (
      <div className="py-12 text-center">
        <Bookmark className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
        <p className="text-sm text-muted-foreground">No saved items yet</p>
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-3 gap-3", className)}>
      {items.map((item) => (
        <Link
          key={item.id}
          href={
            item.type === "post" ? `/posts/${item.id}` : `/images/${item.id}`
          }
          className="group relative aspect-square rounded-lg overflow-hidden bg-muted"
        >
          <img
            src={item.imageUrl}
            alt="Saved item"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-2 right-2">
            <Bookmark className="h-4 w-4 text-white fill-white drop-shadow-md" />
          </div>
        </Link>
      ))}
    </div>
  );
}
