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
    <header className="flex flex-col items-center fixed w-full sm:rounded-lg py-5 top-0 z-50 bg-white">
      <div className="flex justify-between w-full items-center px-5 ">
        <Link
          href="/"
          prefetch={false}
          className={`${custom_font.className} text-2xl font-bold text-black`}
        >
          TAGGED
        </Link>
        <Search />
      </div>
      <nav className="w-full mt-5 justify-items-center">
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
