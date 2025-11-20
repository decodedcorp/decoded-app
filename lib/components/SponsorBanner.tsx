"use client";

import React from "react";

export function SponsorBanner() {
  return (
    <button
      className="flex items-center gap-1.5 rounded-full px-4 py-3 text-sm backdrop-blur-sm 
                 transition-all hover:scale-105 max-md:hidden 
                 bg-black/30 text-white hover:bg-black/40
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
      onClick={() => {
        window.open("https://example.com/request", "_blank", "noopener,noreferrer");
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
        className="lucide lucide-plus"
        aria-hidden="true"
      >
        <path d="M5 12h14"></path>
        <path d="M12 5v14"></path>
      </svg>
      <span>Request</span>
    </button>
  );
}

