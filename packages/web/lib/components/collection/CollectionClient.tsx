"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useMagazineStore } from "@/lib/stores/magazineStore";
import { BookshelfView } from "./BookshelfView";
import { EmptyBookshelf } from "./EmptyBookshelf";

/**
 * Client orchestrator for the Collection page.
 * Loads collection from store, manages active spine state,
 * and renders bookshelf or empty state.
 */
export function CollectionClient() {
  const {
    collectionIssues,
    isLoading,
    activeIssueId,
    setActiveIssueId,
    loadCollection,
  } = useMagazineStore();

  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    loadCollection().then(() => setHasLoaded(true));
  }, [loadCollection]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-mag-bg/80 backdrop-blur-sm border-b border-mag-text/5">
        <Link
          href="/"
          className="flex items-center gap-1 text-mag-text/60 hover:text-mag-text transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <h1 className="text-sm font-bold tracking-wider text-mag-text uppercase">
          My Collection
        </h1>

        {/* Issue count badge */}
        <div className="min-w-[24px] text-right">
          {collectionIssues.length > 0 && (
            <span className="inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-semibold rounded-full bg-mag-accent text-mag-bg">
              {collectionIssues.length}
            </span>
          )}
        </div>
      </header>

      {/* Content */}
      {isLoading && !hasLoaded ? (
        <LoadingSkeleton />
      ) : collectionIssues.length === 0 ? (
        <EmptyBookshelf />
      ) : (
        <BookshelfView
          issues={collectionIssues}
          activeIssueId={activeIssueId}
          onSelectIssue={setActiveIssueId}
        />
      )}
    </div>
  );
}

/**
 * Skeleton shelf rows with pulsing spine outlines.
 */
function LoadingSkeleton() {
  return (
    <div className="px-4 py-8 md:px-8 space-y-6 max-w-[1400px] mx-auto">
      {[0, 1, 2].map((row) => (
        <div
          key={row}
          className="flex items-end justify-center gap-3 md:gap-5 min-h-[180px] md:min-h-[220px] px-4 pt-6 pb-0 border-b-4 border-[#2a2a2a]"
        >
          {[0, 1, 2, 3].map((spine) => (
            <div
              key={spine}
              className="w-[50px] md:w-[60px] h-[140px] md:h-[160px] rounded-sm bg-mag-text/5 animate-pulse"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
