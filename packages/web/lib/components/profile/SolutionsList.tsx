"use client";

import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SolutionItem {
  id: string;
  imageUrl: string;
  itemName: string;
  brand: string;
  price?: string;
  verified: boolean;
}

const MOCK_SOLUTIONS: SolutionItem[] = [
  {
    id: "sol1",
    imageUrl: "https://picsum.photos/seed/sol1/100/100",
    itemName: "Oversized Blazer",
    brand: "Miu Miu",
    price: "$2,890",
    verified: true,
  },
  {
    id: "sol2",
    imageUrl: "https://picsum.photos/seed/sol2/100/100",
    itemName: "Mini Bag",
    brand: "Chanel",
    price: "$4,500",
    verified: true,
  },
  {
    id: "sol3",
    imageUrl: "https://picsum.photos/seed/sol3/100/100",
    itemName: "Platform Sneakers",
    brand: "New Balance",
    price: "$180",
    verified: false,
  },
];

export interface SolutionsListProps {
  solutions?: SolutionItem[];
  className?: string;
}

export function SolutionsList({
  solutions = MOCK_SOLUTIONS,
  className,
}: SolutionsListProps) {
  if (solutions.length === 0) {
    return (
      <div className="py-12 text-center">
        <CheckCircle className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
        <p className="text-sm text-muted-foreground">
          No solutions submitted yet
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {solutions.map((solution) => (
        <div
          key={solution.id}
          className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:bg-accent/50 transition-colors cursor-pointer"
        >
          <div className="h-12 w-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
            <img
              src={solution.imageUrl}
              alt={solution.itemName}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-medium truncate">
                {solution.itemName}
              </p>
              {solution.verified && (
                <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">{solution.brand}</p>
          </div>
          {solution.price && (
            <span className="text-sm font-medium flex-shrink-0">
              {solution.price}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
