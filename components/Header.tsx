"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MagnifyingGlassIcon, Bars3Icon } from "@heroicons/react/20/solid";
import { custom_font } from "@/components/helpers/util";

function Header() {
  return (
    <header className="grid grid-cols-3 items-center rounded-b-md border-2 border-black">
      <LogoSection />
      <MenuSection />
      <SearchSection />
    </header>
  );
}

function LogoSection() {
  return (
    <Link
      href="/"
      prefetch={false}
      className={`${custom_font.className} text-2xl font-bold`}
    >
      TAGGED
    </Link>
  );
}

function MenuSection() {
  const path = usePathname();
  const homeOpacity = path === "/" ? "text-opacity-100" : "text-opacity-50";
  const newsOpacity = path === "/news" ? "text-opacity-100" : "text-opacity-50";
  return (
    <nav className="w-full justify-items-center">
      <ul className="flex justify-center gap-20">
        <li className="list-none transition-all duration-100 ease-in-out hover:scale-150">
          <Link
            href="/"
            prefetch={false}
            className={`font-bold text-m ${homeOpacity} ${custom_font.className}`}
          >
            HOME
          </Link>
        </li>
        <li className="list-none transition-all duration-100 ease-in-out hover:scale-150">
          <Link
            href="/news"
            prefetch={false}
            className={`font-bold text-m ${newsOpacity} ${custom_font.className}`}
          >
            NEWS
          </Link>
        </li>
      </ul>
    </nav>
  );
}

function SearchSection() {
  const [searchValue, setSearchValue] = useState("");

  const handleInputChange = (event: any) => {
    setSearchValue(event.target.value);
  };

  const clearSearch = () => {
    setSearchValue("");
  };

  return (
    <button
      className="flex justify-end items-center"
      onClick={() => {
        alert("WIP");
      }}
    >
      <MagnifyingGlassIcon className="w-4 h-4" />
      <p className={`mx-1 ${custom_font.className} text-sm`}>SEARCH</p>
    </button>
  );
}

export default Header;
