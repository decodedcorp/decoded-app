"use client";

import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpotItem {
  id: string;
  imageUrl: string;
  label: string;
  category: string;
  createdAt: string;
}

const MOCK_SPOTS: SpotItem[] = [
  {
    id: "sp1",
    imageUrl: "https://picsum.photos/seed/spot1/100/100",
    label: "Jacket - NewJeans Minji",
    category: "Outerwear",
    createdAt: "2025-01-15",
  },
  {
    id: "sp2",
    imageUrl: "https://picsum.photos/seed/spot2/100/100",
    label: "Bag - BLACKPINK Jennie",
    category: "Accessories",
    createdAt: "2025-01-10",
  },
  {
    id: "sp3",
    imageUrl: "https://picsum.photos/seed/spot3/100/100",
    label: "Shoes - IVE Wonyoung",
    category: "Footwear",
    createdAt: "2025-01-05",
  },
];

export interface SpotsListProps {
  spots?: SpotItem[];
  className?: string;
}

export function SpotsList({ spots = MOCK_SPOTS, className }: SpotsListProps) {
  if (spots.length === 0) {
    return (
      <div className="py-12 text-center">
        <MapPin className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
        <p className="text-sm text-muted-foreground">No spots created yet</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {spots.map((spot) => (
        <div
          key={spot.id}
          className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:bg-accent/50 transition-colors cursor-pointer"
        >
          <div className="h-12 w-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
            <img
              src={spot.imageUrl}
              alt={spot.label}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{spot.label}</p>
            <p className="text-xs text-muted-foreground">{spot.category}</p>
          </div>
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {new Date(spot.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      ))}
    </div>
  );
}
