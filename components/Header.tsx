"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef } from "react";
import {
  MagnifyingGlassIcon,
  Bars3Icon,
  PlusCircleIcon,
  PlayIcon,
  PauseIcon,
} from "@heroicons/react/20/solid";
import AddIcon from "@mui/icons-material/Add";
import { main_font, secondary_font } from "@/components/helpers/util";
import { LoginModal } from "./ui/modal";

const headers = ["home", "news", "login"];

function Header() {
  return (
    <header className="grid grid-cols-2 lg:grid-cols-3 items-center">
      <LogoSection />
      <div
        className="flex justify-center items-center cursor-pointer"
        onClick={() => {
          alert("Coming Soon!");
        }}
      >
        <AddIcon className="w-10 h-10 bg-[#FF204E] rounded-xl" />
      </div>
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
          if (header === "login") {
            return (
              <div
                key={index}
                className={`${secondary_font.className} text-2xl cursor-pointer`}
                onClick={() =>
                  (
                    document.getElementById("my_modal_4") as HTMLDialogElement
                  )?.showModal()
                }
              >
                {header.toUpperCase()}
                {/* TODO: get nonce from server */}
                <LoginModal />
              </div>
            );
          }
          return (
            <li
              key={index}
              className={`list-none transition-all duration-100 ease-in-out hover:scale-100 ${
                header === "home"
                  ? pathname === "/"
                    ? "border-b-2 border-[#000000]"
                    : ""
                  : currentPath === header
                  ? "border-b-2 border-[#000000]"
                  : ""
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
  return (
    <div className="flex flex-row justify-center">
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
