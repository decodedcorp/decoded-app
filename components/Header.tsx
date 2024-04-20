"use client";

import React from "react";
import Link from "next/link";
import { MagnifyingGlassIcon, Bars3Icon } from "@heroicons/react/20/solid";
import { usePathname } from "next/navigation";
import { custom_font } from "./helpers/util";

function Header() {
  const path = usePathname();
  const homeOpacity = path === "/" ? "text-opacity-100" : "text-opacity-50";
  const newsOpacity = path === "/news" ? "text-opacity-100" : "text-opacity-50";
  return (
    <header className="grid grid-cols-2 sm:grid-cols-3 items-center fixed sm: w-full mx-10 sm:mx-6 top-5 sm:rounded-lg py-5 left-1/2 -translate-x-1/2 z-10">
      <div className="text-black font-bold mr-auto text-xl flex justify-start flex-1">
        <Link
          href="/"
          prefetch={false}
          className={`${custom_font.className} text-2xl`}
        >
          BRANDBY
        </Link>
      </div>
      {/* 모바일 환경에서는 숨기고, 그 외 환경에서는 보이게 처리 */}
      <div className="hidden sm:flex justify-center flex-1 p-3 rounded-lg">
        <nav>
          <ul className="flex justify-center gap-20">
            <li className="list-none transition-all duration-100 ease-in-out hover:scale-150">
              <Link
                href="/"
                prefetch={false}
                className={`font-bold text-black text-lg ${homeOpacity} ${custom_font.className}`}
              >
                HOME
              </Link>
            </li>
            <li className="list-none transition-all duration-100 ease-in-out hover:scale-150">
              <Link
                href="/news"
                prefetch={false}
                className={`font-bold text-black text-lg ${newsOpacity} ${custom_font.className}`}
              >
                NEWS
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      {/* 모바일 환경에서만 보이는 햄버거 메뉴 아이콘 */}
      <div className=" sm:hidden flex flex-1">
        <Search />
      </div>
    </header>
  );
}

function Search() {
  return (
    <div className="flex bg-gray-300 rounded-md">
      <form className="flex bg-opacity-50 items-center px-2">
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search"
          className="flex-1 outline-none p-2 bg-gray-300 "
        />
      </form>
    </div>
  );
}

export default Header;
