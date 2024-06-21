"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef } from "react";
import {
  MagnifyingGlassIcon,
  Bars3Icon,
  PlayIcon,
  PauseIcon,
} from "@heroicons/react/20/solid";
import { main_font, secondary_font } from "@/components/helpers/util";

const headers = ["home", "news", "about", "search"];

function Header() {
  return (
    <header className="grid grid-cols-2 items-center">
      <LogoSection />
      {/* <MusicPlayer /> */}
      <MenuSection />
    </header>
  );
}

function LogoSection() {
  return (
    <Link
      href="/"
      prefetch={false}
      className={`${main_font.className} text-6xl lg:text-8xl font-bold`}
    >
      TAGGED
    </Link>
  );
}

function MenuSection() {
  const pathname = usePathname();
  const cleanedPath = pathname.replace(/^\//, "");
  const [currentPath, setCurrentPath] = useState(cleanedPath);

  return (
    <nav className="w-full justify-end hidden lg:block">
      <ul className="flex flex-row gap-3 justify-end pr-1">
        {headers.map((header, index) => {
          return (
            <li
              key={index}
              className={`list-none transition-all duration-100 ease-in-out hover:scale-100 ${
                header === currentPath ? "border-b-2 border-[#000000]" : ""
              }`}
            >
              <Link
                href={header === "home" ? "/" : `/${header}`}
                prefetch={false}
                className={`text-2xl ${secondary_font.className}`}
                onClick={() => setCurrentPath(header)}
              >
                {header.toUpperCase()}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(
    new Audio(
      "https://api.soundcloud.com/tracks/TRACK_ID/stream?client_id=YOUR_CLIENT_ID"
    )
  );

  const togglePlayPause = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
  };

  return (
    <div className="flex flex-row">
      <button>
        <PlayIcon className="w-4 h-4" />
      </button>
      <button>
        <PauseIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

export default Header;
