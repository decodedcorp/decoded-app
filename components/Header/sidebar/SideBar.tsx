"use client";

import { Dispatch, SetStateAction, useState } from "react";
import Link from "next/link";
import { pretendardBold } from "@/lib/constants/fonts";
import CloseIcon from "@mui/icons-material/Close";
import PlusIcon from "@mui/icons-material/Add";
import MinusIcon from "@mui/icons-material/Remove";

const headers: Record<string, string[]> = {
  home: [],
  artist: ["kpop", "rapper", "actor", "model"],
  brand: ["luxury", "streetwear"],
  explore: [],
};

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

function Sidebar({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (header: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(header)) {
        next.delete(header);
      } else {
        next.add(header);
      }
      return next;
    });
  };

  return (
    <div
      className={`fixed top-0 right-0 h-screen bg-gray-900 text-white transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
      } z-50 w-full lg:w-[30%]`}
    >
      <div className="flex justify-end p-4">
        <button onClick={() => setIsSidebarOpen(false)}>
          <CloseIcon className="text-2xl" />
        </button>
      </div>
      <ul className="flex flex-col gap-4 p-4">
        {Object.entries(headers).map(([header, subHeaders]) => (
          <li key={header} className={`${pretendardBold.className} text-4xl`}>
            <div className="flex justify-between items-center">
              <Link
                href={header === 'home' ? '/' : `/${header}`}
                onClick={() => setIsSidebarOpen(false)}
              >
                {header.toUpperCase()}
              </Link>
              {subHeaders.length > 0 && (
                <button onClick={() => toggleSection(header)}>
                  {expandedSections.has(header) ? (
                    <MinusIcon className="text-2xl" />
                  ) : (
                    <PlusIcon className="text-2xl" />
                  )}
                </button>
              )}
            </div>
            {expandedSections.has(header) && (
              <div className="flex flex-col py-2">
                {subHeaders.map((subHeader) => (
                  <Link
                    key={subHeader}
                    href={`/search?query=${subHeader}`}
                    prefetch={false}
                    className="text-white/20 py-2 text-md md:text-xl hover:text-white"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    {subHeader.toUpperCase()}
                  </Link>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
