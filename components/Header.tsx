"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { custom_font } from "./helpers/util";
import Search from "./Search";

function Header() {
  const path = usePathname();
  const homeOpacity = path === "/" ? "text-opacity-100" : "text-opacity-50";
  const newsOpacity = path === "/news" ? "text-opacity-100" : "text-opacity-50";

  return (
    <header className="flex flex-col items-center fixed w-full mx-10 sm:mx-6 top-5 sm:rounded-lg py-5 left-1/2 -translate-x-1/2 z-10">
      <div className="flex justify-between w-full items-center">
        <Link
          href="/"
          prefetch={false}
          className={`${custom_font.className} text-2xl font-bold`}
        >
          #TAGGED
        </Link>
        <Search />
      </div>
      <nav className="w-full m-10">
        <ul className="flex justify-center gap-20">
          <li className="list-none transition-all duration-100 ease-in-out hover:scale-150">
            <Link
              href="/"
              prefetch={false}
              className={`font-bold text-black text-xl ${homeOpacity} ${custom_font.className}`}
            >
              HOME
            </Link>
          </li>
          <li className="list-none transition-all duration-100 ease-in-out hover:scale-150">
            <Link
              href="/news"
              prefetch={false}
              className={`font-bold text-black text-xl ${newsOpacity} ${custom_font.className}`}
            >
              NEWS
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
