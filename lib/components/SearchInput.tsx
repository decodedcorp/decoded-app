"use client";

import React from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useSearchStore } from "../stores/searchStore";

export function SearchInput() {
  const query = useSearchStore((s) => s.query);
  const setQuery = useSearchStore((s) => s.setQuery);
  const setDebouncedQuery = useSearchStore((s) => s.setDebouncedQuery);
  const debounced = useDebounce(query, 250);

  React.useEffect(() => {
    setDebouncedQuery(debounced);
  }, [debounced, setDebouncedQuery]);

  return (
    <div className="flex items-center gap-2 rounded-full px-4 py-2 backdrop-blur-sm bg-muted/50 border border-input">
      <input
        aria-label="Search 8000 Thiings"
        placeholder="Search 8000 Thiings"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setQuery("");
            (e.target as HTMLInputElement).blur();
          }
        }}
        className="w-40 bg-transparent outline-none md:text-sm text-foreground placeholder-muted-foreground"
        type="text"
      />
      <button
        className={`rounded-full p-1.5 transition-all hover:scale-110 text-foreground hover:bg-accent ${
          query ? "visible" : "invisible"
        }`}
        aria-label="Share search"
        onClick={() => {
          // Share functionality
          console.log("Share search");
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-share2"
          aria-hidden="true"
        >
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line>
          <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line>
        </svg>
      </button>
    </div>
  );
}

