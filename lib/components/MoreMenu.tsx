"use client";

import React from "react";

export function MoreMenu() {
  const [open, setOpen] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target as Node)) setOpen(false);
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    if (open) {
      document.addEventListener("mousedown", onDocClick);
      document.addEventListener("keydown", onKey);
    }

    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="h-9 px-3 rounded-lg bg-white hover:bg-black/5 text-black/50 hover:text-black
                   transition-colors duration-150 ease-out
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
      >
        more
      </button>

      {open && (
        <div
          ref={panelRef}
          role="menu"
          aria-label="More actions"
          className="absolute right-0 mt-2 w-48 rounded-lg border border-black/10 bg-white shadow-sm
                     will-change:opacity,transform
                     transition-all duration-200 ease-out"
          style={{
            opacity: open ? 1 : 0,
            transform: open ? "translateY(0)" : "translateY(-4px)",
          }}
        >
          <ul className="py-2">
            {[
              { label: "discover more", onClick: () => console.log("discover") },
              { label: "download all", onClick: () => console.log("download") },
            ].map((item) => (
              <li key={item.label}>
                <button
                  role="menuitem"
                  onClick={() => {
                    item.onClick();
                    setOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-black/50 hover:text-black hover:bg-black/5
                             transition-colors duration-150 ease-out
                             focus:outline-none focus-visible:bg-black/5"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

